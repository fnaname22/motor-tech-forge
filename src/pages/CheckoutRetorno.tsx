import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Check, XCircle, Clock, ShoppingBag, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type PaymentStatus = "approved" | "pending" | "failure" | "loading";

interface OrderDetails {
  order_number: string;
  total: number;
  payment_method: string | null;
}

const CheckoutRetorno = () => {
  const [searchParams] = useSearchParams();
  const { clear } = useCart();
  const [status, setStatus] = useState<PaymentStatus>("loading");
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  const rawStatus = searchParams.get("status"); // approved, failure, pending
  const orderId = searchParams.get("order_id");
  const paymentId = searchParams.get("payment_id");

  useEffect(() => {
    const resolve = async () => {
      // Determina status com base no parâmetro retornado pelo MP
      let resolvedStatus: PaymentStatus = "pending";

      if (rawStatus === "approved") {
        resolvedStatus = "approved";
        clear(); // Limpa o carrinho apenas em pagamento aprovado
      } else if (rawStatus === "failure") {
        resolvedStatus = "failure";
      } else if (rawStatus === "pending") {
        resolvedStatus = "pending";
        clear(); // PIX e boleto ficam pendentes mas o pedido foi criado
      }

      setStatus(resolvedStatus);

      // Busca detalhes do pedido no Supabase
      if (orderId) {
        const { data } = await supabase
          .from("orders")
          .select("order_number, total, payment_method")
          .eq("id", orderId)
          .single();

        if (data) setOrderDetails(data);
      }
    };

    resolve();
  }, [rawStatus, orderId, clear]);

  if (status === "loading") {
    return (
      <div className="container py-24 text-center">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Verificando seu pagamento...</p>
      </div>
    );
  }

  return (
    <div className="container py-16 max-w-lg mx-auto text-center">
      {/* APROVADO */}
      {status === "approved" && (
        <>
          <div className="h-20 w-20 rounded-full bg-green-500 text-white grid place-items-center mx-auto mb-6">
            <Check className="h-10 w-10" />
          </div>
          <h1 className="font-display text-3xl uppercase tracking-wider text-green-600">
            Pagamento aprovado!
          </h1>
          <p className="text-muted-foreground mt-3">
            Seu pedido foi confirmado e está sendo preparado.
          </p>

          {orderDetails && (
            <div className="mt-6 border rounded-lg p-5 text-left bg-muted/40 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Package className="h-4 w-4 text-primary" />
                Pedido <strong>{orderDetails.order_number}</strong>
              </div>
              <div className="text-xs text-muted-foreground">
                Você receberá um e-mail com os detalhes e o código de rastreio em breve.
              </div>
            </div>
          )}

          <Button asChild className="mt-8 w-full">
            <Link to="/">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Continuar comprando
            </Link>
          </Button>
        </>
      )}

      {/* PENDENTE */}
      {status === "pending" && (
        <>
          <div className="h-20 w-20 rounded-full bg-yellow-500 text-white grid place-items-center mx-auto mb-6">
            <Clock className="h-10 w-10" />
          </div>
          <h1 className="font-display text-3xl uppercase tracking-wider text-yellow-600">
            Pagamento pendente
          </h1>
          <p className="text-muted-foreground mt-3">
            Seu pedido foi criado, mas o pagamento ainda está sendo processado.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Se pagou via <strong>PIX</strong>, a confirmação é imediata.
            Se pagou via <strong>boleto</strong>, pode levar até 3 dias úteis.
          </p>

          {orderDetails && (
            <div className="mt-6 border rounded-lg p-5 text-left bg-muted/40 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Package className="h-4 w-4 text-yellow-500" />
                Pedido <strong>{orderDetails.order_number}</strong>
              </div>
              <div className="text-xs text-muted-foreground">
                Assim que o pagamento for confirmado, você receberá um e-mail.
              </div>
            </div>
          )}

          <Button asChild className="mt-8 w-full" variant="outline">
            <Link to="/">Voltar para a loja</Link>
          </Button>
        </>
      )}

      {/* FALHA */}
      {status === "failure" && (
        <>
          <div className="h-20 w-20 rounded-full bg-red-500 text-white grid place-items-center mx-auto mb-6">
            <XCircle className="h-10 w-10" />
          </div>
          <h1 className="font-display text-3xl uppercase tracking-wider text-red-600">
            Pagamento recusado
          </h1>
          <p className="text-muted-foreground mt-3">
            Não foi possível processar seu pagamento. Verifique os dados do cartão
            ou tente outro método de pagamento.
          </p>

          <div className="mt-6 space-y-3">
            <Button asChild className="w-full">
              <Link to="/checkout">Tentar novamente</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/">Voltar para a loja</Link>
            </Button>
          </div>
        </>
      )}

      {/* Segurança */}
      <div className="mt-10 text-xs text-muted-foreground flex items-center justify-center gap-1">
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clipRule="evenodd"
          />
        </svg>
        Pagamento processado com segurança pelo Mercado Pago
      </div>
    </div>
  );
};

export default CheckoutRetorno;
