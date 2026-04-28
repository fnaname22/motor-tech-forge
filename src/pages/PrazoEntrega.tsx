import { Seo } from "@/components/seo/Seo";
import { Truck, MapPin, Search, AlertCircle } from "lucide-react";

const PrazoEntrega = () => (
  <>
    <Seo title="Prazo de Entrega — MotorTech Parts" description="Prazos de entrega por região, transportadoras parceiras (Correios, Jadlog) e como rastrear seu pedido." />
    <div className="container max-w-4xl py-10">
      <h1 className="font-display text-3xl md:text-4xl uppercase tracking-wider mb-2">Prazo de Entrega</h1>
      <p className="text-muted-foreground">Despachamos em até 24h úteis após confirmação do pagamento.</p>

      <h2 className="font-display text-2xl uppercase tracking-wider mt-10 mb-4 flex items-center gap-2">
        <MapPin className="h-6 w-6 text-primary" /> Tempo médio por região
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border rounded-lg overflow-hidden">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">Região</th>
              <th className="text-left p-3">Econômico</th>
              <th className="text-left p-3">Expresso</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Sudeste (SP, RJ, MG, ES)", "3 a 7 dias úteis", "1 a 3 dias úteis"],
              ["Sul (PR, SC, RS)", "5 a 10 dias úteis", "2 a 4 dias úteis"],
              ["Centro-Oeste (DF, GO, MT, MS)", "7 a 12 dias úteis", "3 a 5 dias úteis"],
              ["Nordeste", "8 a 15 dias úteis", "4 a 7 dias úteis"],
              ["Norte", "10 a 20 dias úteis", "5 a 10 dias úteis"],
            ].map(([region, eco, exp]) => (
              <tr key={region} className="border-t">
                <td className="p-3 font-semibold">{region}</td>
                <td className="p-3 text-muted-foreground">{eco}</td>
                <td className="p-3 text-muted-foreground">{exp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="font-display text-2xl uppercase tracking-wider mt-10 mb-4 flex items-center gap-2">
        <Truck className="h-6 w-6 text-primary" /> Transportadoras parceiras
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="border rounded-lg p-5">
          <div className="font-display text-xl uppercase tracking-wider mb-1">Correios</div>
          <p className="text-sm text-muted-foreground">PAC e SEDEX para todo o Brasil. Cobertura nacional incluindo CEPs interioranos.</p>
        </div>
        <div className="border rounded-lg p-5">
          <div className="font-display text-xl uppercase tracking-wider mb-1">Jadlog / Total Express</div>
          <p className="text-sm text-muted-foreground">Entregas expressas para capitais e regiões metropolitanas.</p>
        </div>
      </div>

      <h2 className="font-display text-2xl uppercase tracking-wider mt-10 mb-4 flex items-center gap-2">
        <Search className="h-6 w-6 text-primary" /> Como rastrear seu pedido
      </h2>
      <ol className="list-decimal pl-5 space-y-2 text-sm">
        <li>Acesse <strong>Minha Conta → Meus Pedidos</strong>.</li>
        <li>Clique no pedido desejado para ver o código de rastreio.</li>
        <li>Use o link de rastreio para acompanhar em tempo real no site da transportadora.</li>
        <li>Você também receberá um e-mail com cada atualização de status.</li>
      </ol>

      <div className="mt-10 p-5 border rounded bg-yellow-50 dark:bg-yellow-950/20 border-yellow-300/50 flex gap-3">
        <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0" />
        <div className="text-sm">
          <strong>Pedido atrasado?</strong> Entre em contato pelo WhatsApp ou e-mail informando o número do pedido. Faremos a abertura
          de protocolo junto à transportadora em até 24h úteis.
        </div>
      </div>
    </div>
  </>
);

export default PrazoEntrega;
