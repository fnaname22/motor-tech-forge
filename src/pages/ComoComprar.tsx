import { Seo } from "@/components/seo/Seo";
import { Search, Wrench, ShoppingCart, CreditCard, Truck, PackageCheck } from "lucide-react";

const steps = [
  { i: Search, t: "1. Encontre o produto", d: "Use o menu de Categorias ou a busca no topo do site para encontrar exatamente o que precisa." },
  { i: Wrench, t: "2. Verifique a compatibilidade", d: "Na página do produto, selecione Ano, Marca e Modelo do seu veículo para confirmar a compatibilidade." },
  { i: ShoppingCart, t: "3. Adicione ao carrinho", d: "Clique em ADICIONAR AO CARRINHO. Você pode continuar comprando ou ir direto ao checkout." },
  { i: CreditCard, t: "4. Escolha o pagamento", d: "PIX (5% off à vista), Boleto, ou Cartão em até 12x sem juros via Mercado Pago." },
  { i: Truck, t: "5. Acompanhe o envio", d: "Despachamos em até 24h úteis. Você recebe o código de rastreio por e-mail e em Minha Conta." },
  { i: PackageCheck, t: "6. Receba em casa", d: "Conferência simples na entrega. Em caso de qualquer problema, conte com nosso suporte." },
];

const ComoComprar = () => (
  <>
    <Seo title="Como Comprar — MotorTech Parts" description="Guia passo a passo para comprar na MotorTech Parts: busca, compatibilidade, pagamento e entrega." />
    <section className="bg-gradient-dark text-white py-12">
      <div className="container max-w-3xl text-center">
        <span className="text-xs font-bold tracking-widest text-primary">GUIA RÁPIDO</span>
        <h1 className="font-display text-4xl md:text-5xl uppercase tracking-wider mt-2">Como Comprar</h1>
        <p className="text-white/70 mt-3">Comprar na MotorTech é simples, rápido e seguro.</p>
      </div>
    </section>

    <div className="container max-w-4xl py-12">
      <div className="grid md:grid-cols-2 gap-4">
        {steps.map(({ i: Icon, t, d }) => (
          <article key={t} className="border rounded-lg p-5 hover:border-primary transition flex gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display text-lg uppercase tracking-wider">{t}</h3>
              <p className="text-sm text-muted-foreground mt-1">{d}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 bg-muted/40 rounded-lg p-6 border-l-4 border-primary">
        <h2 className="font-display text-2xl uppercase tracking-wider mb-2">Precisa de ajuda?</h2>
        <p className="text-sm text-muted-foreground">
          Nossa equipe está disponível pelo WhatsApp de Segunda a Sábado, das 8h às 20h. Clique no botão verde
          flutuante no canto da tela para falar agora mesmo!
        </p>
      </div>
    </div>
  </>
);

export default ComoComprar;
