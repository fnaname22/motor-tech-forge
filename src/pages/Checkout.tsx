import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/context/CartContext";
import { formatBRL } from "@/data/catalog";
import { Check, ChevronRight, CreditCard, Lock, MapPin, Package, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { TrustBadge, PaymentIcons } from "@/components/trust/TrustBadge";

import { useViaCep } from "@/hooks/use-viacep";

const steps = [
  { key: "cart", label: "Carrinho", icon: ShoppingBag },
  { key: "address", label: "Endereço de Entrega", icon: MapPin },
  { key: "payment", label: "Pagamento", icon: CreditCard },
  { key: "done", label: "Confirmação do Pedido", icon: Check },
];

const Checkout = () => {
  const { items, subtotal, clear } = useCart();
  const [step, setStep] = useState(0);
  const [payment, setPayment] = useState("pix");
  const { fetchAddress, loading: loadingCep } = useViaCep();
  const navigate = useNavigate();

  const [addressData, setAddressData] = useState({
    name: "",
    cpf: "",
    cep: "",
    phone: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: ""
  });

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setAddressData({ ...addressData, cep: val });

    if (val.length === 8) {
      const data = await fetchAddress(val);
      if (data) {
        setAddressData(prev => ({
          ...prev,
          cep: val,
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf
        }));
      }
    }
  };

  const shipping = subtotal >= 299 ? 0 : 29.9;
  const total = subtotal + shipping;
  const orderId = useMemo(() => "MT-" + Math.floor(Math.random() * 900000 + 100000), []);

  if (items.length === 0 && step < 3) {
    return (
      <div className="container py-20 text-center">
        <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h1 className="font-display text-3xl uppercase tracking-wider mb-2">Seu carrinho está vazio</h1>
        <Button asChild className="mt-4"><Link to="/">Continuar comprando</Link></Button>
      </div>
    );
  }

  const next = () => setStep((s) => Math.min(3, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const finishOrder = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Pedido confirmado!", description: `Pedido ${orderId}` });
    setStep(3);
    clear();
  };

  return (
    <div className="container py-6 lg:py-10">
      {/* Stepper */}
      <ol className="flex items-center justify-between mb-10 max-w-3xl mx-auto">
        {steps.map((s, i) => (
          <li key={s.key} className="flex-1 flex items-center">
            <div className={cn("flex flex-col items-center text-center gap-1 flex-1", i <= step ? "text-primary" : "text-muted-foreground")}>
              <div className={cn("h-9 w-9 rounded-full grid place-items-center border-2 font-bold text-sm",
                i < step ? "bg-primary border-primary text-primary-foreground" :
                i === step ? "border-primary text-primary" : "border-border")}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider hidden sm:block">{s.label}</span>
            </div>
            {i < steps.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />}
          </li>
        ))}
      </ol>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div>
          {step === 0 && (
            <section className="space-y-3">
              <h2 className="font-display text-2xl uppercase tracking-wider mb-3">Carrinho</h2>
              {items.map(({ product, qty }) => (
                <div key={product.id} className="flex gap-4 border rounded-lg p-3">
                  <img src={product.image} alt={product.name} className="h-20 w-20 object-cover rounded" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{product.name}</div>
                    <div className="text-xs text-muted-foreground">Qtd: {qty}</div>
                  </div>
                  <div className="text-primary font-bold">{formatBRL(product.price * qty)}</div>
                </div>
              ))}
              <div className="flex justify-between pt-4">
                <Button variant="outline" asChild><Link to="/">Continuar comprando</Link></Button>
                <Button onClick={next}>Próximo: Endereço</Button>
              </div>
            </section>
          )}

          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); next(); }} className="space-y-4">
              <h2 className="font-display text-2xl uppercase tracking-wider mb-3">Endereço de Entrega</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <div><Label>Nome completo</Label><Input required value={addressData.name} onChange={e => setAddressData({...addressData, name: e.target.value})} /></div>
                <div><Label>CPF</Label><Input required placeholder="000.000.000-00" value={addressData.cpf} onChange={e => setAddressData({...addressData, cpf: e.target.value})} /></div>
                <div><Label>CEP</Label><Input required placeholder="00000-000" value={addressData.cep} onChange={handleCepChange} maxLength={8} /></div>
                <div><Label>Telefone</Label><Input required placeholder="(11) 90000-0000" value={addressData.phone} onChange={e => setAddressData({...addressData, phone: e.target.value})} /></div>
                <div className="sm:col-span-2"><Label>Rua / Logradouro</Label><Input required value={addressData.street} onChange={e => setAddressData({...addressData, street: e.target.value})} /></div>
                <div><Label>Número</Label><Input required value={addressData.number} onChange={e => setAddressData({...addressData, number: e.target.value})} /></div>
                <div><Label>Complemento</Label><Input value={addressData.complement} onChange={e => setAddressData({...addressData, complement: e.target.value})} /></div>
                <div><Label>Bairro</Label><Input required value={addressData.neighborhood} onChange={e => setAddressData({...addressData, neighborhood: e.target.value})} /></div>
                <div><Label>Cidade</Label><Input required value={addressData.city} onChange={e => setAddressData({...addressData, city: e.target.value})} disabled /></div>
                <div><Label>Estado</Label><Input required value={addressData.state} onChange={e => setAddressData({...addressData, state: e.target.value})} disabled /></div>
              </div>
              <div className="flex justify-between pt-2">
                <Button type="button" variant="outline" onClick={prev}>Voltar</Button>
                <Button type="submit" disabled={loadingCep}>{loadingCep ? "Buscando CEP..." : "Próximo: Pagamento"}</Button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={finishOrder} className="space-y-4">
              <h2 className="font-display text-2xl uppercase tracking-wider mb-3">Pagamento</h2>
              <RadioGroup value={payment} onValueChange={setPayment} className="space-y-2">
                {[
                  { v: "pix", l: "PIX (5% de desconto)" },
                  { v: "card", l: "Cartão de Crédito" },
                  { v: "boleto", l: "Boleto Bancário" },
                ].map((o) => (
                  <Label key={o.v} className={cn("flex items-center gap-3 border rounded-lg p-4 cursor-pointer hover:border-primary", payment === o.v && "border-primary bg-primary/5")}>
                    <RadioGroupItem value={o.v} />
                    <span className="font-semibold">{o.l}</span>
                  </Label>
                ))}
              </RadioGroup>

              {payment === "card" && (
                <div className="grid sm:grid-cols-2 gap-3 border rounded-lg p-4">
                  <div className="sm:col-span-2"><Label>Número do cartão</Label><Input required placeholder="0000 0000 0000 0000" /></div>
                  <div className="sm:col-span-2"><Label>Nome no cartão</Label><Input required /></div>
                  <div><Label>Validade</Label><Input required placeholder="MM/AA" /></div>
                  <div><Label>CVV</Label><Input required placeholder="000" /></div>
                </div>
              )}

              <div className="flex items-center text-xs text-muted-foreground gap-1"><Lock className="h-3 w-3" /> Pagamento seguro com criptografia SSL</div>

              <div className="flex justify-between pt-2">
                <Button type="button" variant="outline" onClick={prev}>Voltar</Button>
                <Button type="submit" className="font-bold tracking-wider">FINALIZAR PEDIDO</Button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-12 max-w-lg mx-auto">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground grid place-items-center mx-auto mb-4">
                <Check className="h-8 w-8" />
              </div>
              <h2 className="font-display text-3xl uppercase tracking-wider">Pedido confirmado!</h2>
              <p className="text-muted-foreground mt-2">Recebemos seu pedido com sucesso.</p>
              <div className="mt-6 border rounded-lg p-5 text-left bg-muted/40">
                <div className="flex items-center gap-2 text-sm"><Package className="h-4 w-4 text-primary" /> Pedido <strong>{orderId}</strong></div>
                <div className="text-xs text-muted-foreground mt-1">Você receberá um e-mail com os detalhes e o código de rastreio.</div>
              </div>
              <Button asChild className="mt-6"><Link to="/">Voltar para a loja</Link></Button>
            </div>
          )}
        </div>

        {step < 3 && (
          <aside className="lg:sticky lg:top-32 self-start space-y-3 h-fit">
            <div className="border rounded-lg p-5 bg-muted/30">
              <h3 className="font-display text-lg uppercase tracking-wider mb-3">Resumo</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatBRL(subtotal)}</span></div>
                <div className="flex justify-between"><span>Frete</span><span>{shipping === 0 ? "Grátis" : formatBRL(shipping)}</span></div>
                <div className="border-t mt-2 pt-2 flex justify-between text-lg font-extrabold">
                  <span>Total</span><span className="text-primary">{formatBRL(total)}</span>
                </div>
                <div className="text-xs text-muted-foreground">em até 3x sem juros</div>
              </div>
            </div>
            <TrustBadge />
            <div className="border rounded-lg p-4 bg-card">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Formas de pagamento aceitas</div>
              <PaymentIcons />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default Checkout;
