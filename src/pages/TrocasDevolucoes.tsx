import { Seo } from "@/components/seo/Seo";
import { CheckCircle2, AlertTriangle, Mail, Package } from "lucide-react";

const TrocasDevolucoes = () => (
  <>
    <Seo title="Trocas e Devoluções — MotorTech Parts" description="Política de trocas e devoluções: 7 dias para arrependimento conforme CDC, passo a passo e prazos de reembolso." />
    <div className="container max-w-3xl py-10">
      <h1 className="font-display text-3xl md:text-4xl uppercase tracking-wider mb-2">Trocas e Devoluções</h1>
      <p className="text-muted-foreground">Conforme o Código de Defesa do Consumidor (Lei nº 8.078/90).</p>

      <section className="mt-8 bg-muted/40 border-l-4 border-primary p-5 rounded">
        <h2 className="font-display text-xl uppercase tracking-wider mb-2">Direito de arrependimento — 7 dias</h2>
        <p className="text-sm text-muted-foreground">
          Você tem até <strong>7 dias corridos após o recebimento</strong> para desistir da compra, sem necessidade de justificativa.
          O produto deve estar lacrado, sem uso, com etiquetas, manuais e embalagem original.
        </p>
      </section>

      <h2 className="font-display text-2xl uppercase tracking-wider mt-10 mb-4">Passo a passo para devolver</h2>
      <ol className="space-y-3">
        {[
          { i: Mail, t: "Solicite a devolução", d: "Envie um e-mail para devolucao@motortechparts.com.br com o número do pedido e o motivo." },
          { i: CheckCircle2, t: "Aguarde aprovação", d: "Em até 24h úteis enviaremos o código de postagem nos Correios (sem custo)." },
          { i: Package, t: "Embale e poste", d: "Reembale o produto com cuidado e leve à agência dos Correios mais próxima." },
          { i: CheckCircle2, t: "Receba o reembolso", d: "Após análise do produto (até 5 dias úteis), processamos o reembolso." },
        ].map(({ i: Icon, t, d }, idx) => (
          <li key={t} className="flex gap-4 border rounded-lg p-4">
            <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground grid place-items-center font-bold shrink-0">
              {idx + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 font-semibold"><Icon className="h-4 w-4 text-primary" /> {t}</div>
              <p className="text-sm text-muted-foreground mt-1">{d}</p>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="font-display text-2xl uppercase tracking-wider mt-10 mb-4">Condições para troca</h2>
      <ul className="space-y-2 text-sm">
        {[
          "Produto sem sinais de uso ou instalação",
          "Embalagem original preservada com todos os acessórios",
          "Nota fiscal acompanhando o produto",
          "Troca por produto de igual valor ou pagamento da diferença",
        ].map((c) => (
          <li key={c} className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <span>{c}</span>
          </li>
        ))}
      </ul>

      <h2 className="font-display text-2xl uppercase tracking-wider mt-10 mb-4">Prazo de reembolso por forma de pagamento</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border rounded-lg overflow-hidden">
          <thead className="bg-muted">
            <tr><th className="text-left p-3">Forma de Pagamento</th><th className="text-left p-3">Prazo</th></tr>
          </thead>
          <tbody>
            <tr className="border-t"><td className="p-3">PIX</td><td className="p-3">Até 5 dias úteis</td></tr>
            <tr className="border-t"><td className="p-3">Boleto</td><td className="p-3">Até 10 dias úteis</td></tr>
            <tr className="border-t"><td className="p-3">Cartão de Crédito</td><td className="p-3">Estorno na fatura em 1-2 ciclos</td></tr>
          </tbody>
        </table>
      </div>

      <div className="mt-10 p-5 border rounded bg-yellow-50 dark:bg-yellow-950/20 border-yellow-300/50 flex gap-3">
        <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0" />
        <p className="text-sm">Produtos com defeito de fabricação têm garantia de <strong>12 meses</strong>. Entre em contato pelo WhatsApp para acionar a garantia.</p>
      </div>
    </div>
  </>
);

export default TrocasDevolucoes;
