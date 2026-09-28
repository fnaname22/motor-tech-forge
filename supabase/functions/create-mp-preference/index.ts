import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
  qty: number;
}

interface OrderPayload {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  addressData: {
    name: string;
    cpf: string;
    email?: string;
    phone: string;
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const accessToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");
    if (!accessToken) throw new Error("MERCADOPAGO_ACCESS_TOKEN não configurado");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload: OrderPayload = await req.json();
    const { items, subtotal, shipping, total, addressData } = payload;

    // Gera número do pedido
    const orderNumber = "MT-" + Math.floor(Math.random() * 900000 + 100000);

    // Busca o usuário da sessão (se houver)
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;

    if (authHeader) {
      const supabaseClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: { user } } = await supabaseClient.auth.getUser();
      userId = user?.id ?? null;
    }

    // Cria o pedido no Supabase
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: userId ?? "anonymous",
        subtotal,
        shipping_cost: shipping,
        total,
        payment_method: "mercadopago",
        payment_status: "pending",
        status: "pending",
        shipping_address: {
          name: addressData.name,
          cpf: addressData.cpf,
          phone: addressData.phone,
          zipcode: addressData.cep,
          street: addressData.street,
          number: addressData.number,
          complement: addressData.complement ?? "",
          neighborhood: addressData.neighborhood,
          city: addressData.city,
          state: addressData.state,
        },
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Cria os itens do pedido
    const orderItems = items.map(({ product, qty }) => ({
      order_id: order.id,
      product_id: product.id,
      product_name: product.name,
      product_image: product.image ?? null,
      quantity: qty,
      unit_price: product.price,
    }));

    await supabase.from("order_items").insert(orderItems);

    // Monta URL base (origin do request ou fallback)
    const origin = req.headers.get("origin") ?? "http://localhost:5173";

    // Cria preferência no Mercado Pago
    const mpItems = items.map(({ product, qty }) => ({
      id: product.id,
      title: product.name,
      picture_url: product.image,
      quantity: qty,
      unit_price: product.price,
      currency_id: "BRL",
    }));

    if (shipping > 0) {
      mpItems.push({
        id: "shipping",
        title: "Frete",
        picture_url: undefined,
        quantity: 1,
        unit_price: shipping,
        currency_id: "BRL",
      });
    }

    const preference = {
      items: mpItems,
      payer: {
        name: addressData.name,
        email: addressData.email ?? "cliente@motortechforge.com.br",
        phone: {
          area_code: addressData.phone.slice(1, 3),
          number: addressData.phone.slice(4).replace(/\D/g, ""),
        },
        identification: {
          type: "CPF",
          number: addressData.cpf.replace(/\D/g, ""),
        },
        address: {
          zip_code: addressData.cep,
          street_name: addressData.street,
          street_number: addressData.number,
        },
      },
      back_urls: {
        success: `${origin}/checkout/retorno?status=approved&order_id=${order.id}`,
        failure: `${origin}/checkout/retorno?status=failure&order_id=${order.id}`,
        pending: `${origin}/checkout/retorno?status=pending&order_id=${order.id}`,
      },
      auto_return: "approved",
      external_reference: order.id,
      notification_url: `${supabaseUrl}/functions/v1/mp-webhook`,
      statement_descriptor: "MOTOR TECH FORGE",
      metadata: {
        order_id: order.id,
        order_number: orderNumber,
      },
    };

    const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preference),
    });

    if (!mpResponse.ok) {
      const err = await mpResponse.text();
      throw new Error(`Mercado Pago API error: ${err}`);
    }

    const mpData = await mpResponse.json();

    // Salva o preference_id no pedido
    await supabase
      .from("orders")
      .update({ payment_id: mpData.id })
      .eq("id", order.id);

    return new Response(
      JSON.stringify({
        order_id: order.id,
        order_number: orderNumber,
        init_point: mpData.init_point,        // produção
        sandbox_init_point: mpData.sandbox_init_point, // sandbox/teste
        preference_id: mpData.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Erro ao criar preferência MP:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
