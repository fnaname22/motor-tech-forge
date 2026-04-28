import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { formatBRL } from "@/data/catalog";
import { Minus, Plus, Trash2, Truck } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const CartDrawer = () => {
  const { items, isOpen, close, setQty, remove, subtotal } = useCart();
  const [cep, setCep] = useState("");
  const [shipping, setShipping] = useState<{ label: string; price: number } | null>(null);
  const navigate = useNavigate();

  const calcShipping = () => {
    if (cep.replace(/\D/g, "").length < 8) return;
    const free = subtotal >= 299;
    setShipping(free ? { label: "Frete Grátis", price: 0 } : { label: "Frete Padrão (5-7 dias)", price: 29.9 });
  };

  const goCheckout = () => { close(); navigate("/checkout"); };

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && close()}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-5 py-4 border-b">
          <SheetTitle className="font-display text-2xl tracking-wider">SEU CARRINHO ({items.length})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 grid place-items-center text-center p-6">
            <div>
              <p className="text-muted-foreground mb-4">Seu carrinho está vazio.</p>
              <Button onClick={close}>Continuar comprando</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.map(({ product, qty }) => (
                <div key={product.id} className="flex gap-3">
                  <Link to={`/produto/${product.id}`} onClick={close} className="shrink-0">
                    <img src={product.image} alt={product.name} className="h-20 w-20 object-cover rounded border" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/produto/${product.id}`} onClick={close} className="text-sm font-semibold line-clamp-2 hover:text-primary">{product.name}</Link>
                    <div className="text-primary font-bold mt-1">{formatBRL(product.price * qty)}</div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded">
                        <button onClick={() => setQty(product.id, qty - 1)} className="p-1.5 hover:bg-muted" aria-label="Diminuir"><Minus className="h-3 w-3" /></button>
                        <span className="px-3 text-sm font-semibold">{qty}</span>
                        <button onClick={() => setQty(product.id, qty + 1)} className="p-1.5 hover:bg-muted" aria-label="Aumentar"><Plus className="h-3 w-3" /></button>
                      </div>
                      <button onClick={() => remove(product.id)} className="text-muted-foreground hover:text-primary" aria-label="Remover">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t">
                <label className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Truck className="h-4 w-4 text-primary" /> Calcular Frete
                </label>
                <div className="flex gap-2">
                  <Input value={cep} onChange={(e) => setCep(e.target.value)} placeholder="00000-000" maxLength={9} />
                  <Button variant="secondary" onClick={calcShipping}>OK</Button>
                </div>
                {shipping && (
                  <div className="mt-2 flex justify-between text-sm">
                    <span>{shipping.label}</span>
                    <span className="font-bold">{shipping.price === 0 ? "Grátis" : formatBRL(shipping.price)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t p-5 space-y-3 bg-muted/40">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span><span className="font-semibold">{formatBRL(subtotal)}</span>
              </div>
              {shipping && (
                <div className="flex justify-between text-sm">
                  <span>Frete</span><span className="font-semibold">{shipping.price === 0 ? "Grátis" : formatBRL(shipping.price)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-extrabold">
                <span>Total</span>
                <span className="text-primary">{formatBRL(subtotal + (shipping?.price || 0))}</span>
              </div>
              <Button className="w-full font-bold tracking-wider" size="lg" onClick={goCheckout}>FINALIZAR COMPRA</Button>
              <Button variant="outline" className="w-full" onClick={close}>Continuar comprando</Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
