import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { categories } from "@/data/catalog";

export const Footer = () => (
  <footer className="bg-brand-black text-white/80 mt-16 pb-20 lg:pb-0">
    <div className="container py-12 grid gap-10 md:grid-cols-4">
      <div>
        <h3 className="font-display text-2xl text-white mb-3">MOTORTECH PARTS</h3>
        <p className="text-sm leading-relaxed">Peças e acessórios automotivos com performance, qualidade e o visual que o seu veículo merece.</p>
        <div className="flex gap-3 mt-4">
          <a href="#" aria-label="Instagram" className="w-9 h-9 grid place-items-center rounded bg-white/10 hover:bg-primary transition"><Instagram className="h-4 w-4" /></a>
          <a href="#" aria-label="Facebook" className="w-9 h-9 grid place-items-center rounded bg-white/10 hover:bg-primary transition"><Facebook className="h-4 w-4" /></a>
          <a href="#" aria-label="YouTube" className="w-9 h-9 grid place-items-center rounded bg-white/10 hover:bg-primary transition"><Youtube className="h-4 w-4" /></a>
        </div>
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
          <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> (11) 4000-1234</li>
          <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> contato@motortechparts.com.br</li>
          <li className="flex items-start gap-2"><MapPin className="h-4 w-4 text-primary mt-0.5" /> Av. das Indústrias, 1000 — São Paulo/SP</li>
        </ul>
      </div>

      <div>
        <h4 className="font-display text-lg text-white mb-3 tracking-wider">PAGAMENTO</h4>
        <div className="flex flex-wrap gap-2">
          {["VISA", "MASTER", "ELO", "AMEX", "PIX", "BOLETO"].map((m) => (
            <span key={m} className="px-2.5 py-1 rounded bg-white/10 text-xs font-bold tracking-wider">{m}</span>
          ))}
        </div>
        <p className="text-xs mt-4 text-white/50">Site 100% seguro • SSL</p>
      </div>
    </div>
    <div className="border-t border-white/10">
      <div className="container py-4 text-xs text-white/50 flex flex-col md:flex-row justify-between gap-2">
        <span>© {new Date().getFullYear()} MotorTech Parts. Todos os direitos reservados.</span>
        <span>CNPJ: 00.000.000/0001-00</span>
      </div>
    </div>
  </footer>
);
