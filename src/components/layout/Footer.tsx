import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Clock, MessageCircle, ShieldCheck, Lock, Award, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/use-categories";

export const Footer = () => {
  const { categories } = useCategories();
  return (
  <footer className="bg-brand-black text-white/80 mt-16 pb-20 lg:pb-0">
    {/* SECURITY SEALS */}
    <div className="border-b border-white/10 bg-black/40">
      <div className="container py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Lock, t: "SSL Seguro", s: "Criptografia 256-bit" },
          { icon: ShieldCheck, t: "Site Blindado", s: "Proteção contra fraudes" },
          { icon: BadgeCheck, t: "Mercado Pago", s: "Pagamento oficial" },
          { icon: Award, t: "Compra Garantida", s: "Reembolso garantido" },
        ].map((b) => (
          <div key={b.t} className="flex items-center gap-3">
            <div className="h-10 w-10 grid place-items-center rounded bg-primary/15 text-primary shrink-0">
              <b.icon className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="text-white text-xs font-bold uppercase tracking-wider">{b.t}</div>
              <div className="text-[11px] text-white/60">{b.s}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* MAIN GRID */}
    <div className="container py-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
      <div>
        <h3 className="font-display text-2xl text-white mb-3">MOTORTECH PARTS</h3>
        <p className="text-sm leading-relaxed">
          Peças e acessórios automotivos com performance, qualidade e o visual que o seu veículo merece.
        </p>
        <div className="flex gap-3 mt-4">
          <a href="#" aria-label="Instagram" className="w-9 h-9 grid place-items-center rounded bg-white/10 hover:bg-primary transition"><Instagram className="h-4 w-4" /></a>
          <a href="#" aria-label="Facebook" className="w-9 h-9 grid place-items-center rounded bg-white/10 hover:bg-primary transition"><Facebook className="h-4 w-4" /></a>
          <a href="#" aria-label="YouTube" className="w-9 h-9 grid place-items-center rounded bg-white/10 hover:bg-primary transition"><Youtube className="h-4 w-4" /></a>
        </div>
      </div>

      <div>
        <h4 className="font-display text-lg text-white mb-3 tracking-wider">INSTITUCIONAL</h4>
        <ul className="space-y-2">
          <li><Link to="/quem-somos" className="text-brand-gray hover:text-white transition-colors">Quem Somos</Link></li>
          <li><Link to="/prazo-de-entrega" className="text-brand-gray hover:text-white transition-colors">Prazo de Entrega</Link></li>
          <li><Link to="/trocas-e-devolucoes" className="text-brand-gray hover:text-white transition-colors">Trocas e Devoluções</Link></li>
          <li><Link to="/politica-de-privacidade" className="text-brand-gray hover:text-white transition-colors">Política de Privacidade</Link></li>
          <li><Link to="/admin" className="text-brand-gray hover:text-white transition-colors text-xs opacity-50 mt-4 block">Painel Administrativo</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-display text-lg text-white mb-3 tracking-wider">CATEGORIAS</h4>
        <ul className="space-y-2 text-sm">
          {categories.map((c) => (
            <li key={c.slug}><Link to={`/categoria/${c.slug}`} className="hover:text-primary transition">{c.name}</Link></li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-display text-lg text-white mb-3 tracking-wider">ATENDIMENTO</h4>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary shrink-0" /> (11) 4000-1234</li>
          <li className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-primary shrink-0" />
            <a href="https://wa.me/5511940001234" target="_blank" rel="noopener" className="hover:text-primary">WhatsApp: (11) 94000-1234</a>
          </li>
          <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary shrink-0" /> contato@motortechparts.com.br</li>
          <li className="flex items-start gap-2"><MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" /> Av. das Indústrias, 1000<br />Vila Industrial — São Paulo/SP<br />CEP 01000-000</li>
          <li className="flex items-start gap-2"><Clock className="h-4 w-4 text-primary mt-0.5 shrink-0" /> Seg a Sex: 8h às 20h<br />Sáb: 9h às 14h</li>
        </ul>

        <h4 className="font-display text-lg text-white mt-6 mb-3 tracking-wider">PAGAMENTO</h4>
        <div className="flex flex-wrap gap-1.5">
          {[
            { l: "PIX", c: "bg-[#32BCAD]" },
            { l: "BOLETO", c: "bg-white/15" },
            { l: "VISA", c: "bg-[#1A1F71]" },
            { l: "MASTER", c: "bg-[#EB001B]" },
            { l: "ELO", c: "bg-white/15" },
            { l: "AMEX", c: "bg-[#2E77BB]" },
          ].map((m) => (
            <span key={m.l} className={`px-2 py-1 rounded text-[10px] font-extrabold tracking-wider text-white ${m.c}`}>{m.l}</span>
          ))}
        </div>
      </div>
    </div>

    <div className="border-t border-white/10">
      <div className="container py-4 text-xs text-white/50 flex flex-col md:flex-row justify-between gap-2">
        <span>© {new Date().getFullYear()} MotorTech Parts. Todos os direitos reservados.</span>
        <span><strong className="text-white/70">CNPJ:</strong> 00.000.000/0001-00 — MotorTech Parts Comércio LTDA.</span>
      </div>
    </div>
  </footer>
);
};
