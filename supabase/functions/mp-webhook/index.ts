import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    const body = await req.json();
    console.log("Webhook recebido:", JSON.stringify(body));

    // O MP envia notificações do tipo "payment"
    if (body.type !== "payment") {
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const paymentId = body.data?.id;
    if (!paymentId) {
      return new Response(JSON.stringify({ error: "payment id ausente" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Busca detalhes do pagamento na API do MP
    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!mpResponse.ok) {
      throw new Error(`Erro ao buscar pagamento MP: ${mpResponse.status}`);
    }

    const payment = await mpResponse.json();
    console.log("Dados do pagamento:", JSON.stringify(payment));

    const orderId = payment.external_reference;
    if (!orderId) {
      console.warn("external_reference não encontrado no pagamento");
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Mapeia status do MP para status interno
    const mpStatus = payment.status; // approved, pending, rejected, cancelled, refunded
    let paymentStatus: string;
    let orderStatus: string;

    switch (mpStatus) {
      case "approved":
        paymentStatus = "paid";
        orderStatus = "processing";
        break;
      case "pending":
      case "in_process":
        paymentStatus = "pending";
        orderStatus = "pending";
        break;
      case "rejected":
        paymentStatus = "failed";
        orderStatus = "cancelled";
        break;
      case "cancelled":
        paymentStatus = "failed";
        orderStatus = "cancelled";
        break;
      case "refunded":
      case "charged_back":
        paymentStatus = "refunded";
        orderStatus = "cancelled";
        break;
      default:
        paymentStatus = "pending";
        orderStatus = "pending";
    }

    // Atualiza o pedido no Supabase
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: paymentStatus,
        status: orderStatus,
        payment_id: String(paymentId),
        payment_method: payment.payment_type_id ?? "mercadopago",
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (updateError) {
      console.error("Erro ao atualizar pedido:", updateError);
      throw updateError;
    }

    console.log(`Pedido ${orderId} atualizado: payment_status=${paymentStatus}, order_status=${orderStatus}`);

    return new Response(JSON.stringify({ received: true, orderId, paymentStatus }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Erro no webhook MP:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
