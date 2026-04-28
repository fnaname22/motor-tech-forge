import { Link } from "react-router-dom";
import { ArrowRight, Truck, ShieldCheck, CreditCard, Headphones, Wrench, Lightbulb, Zap, Cog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categories, bestSellers } from "@/data/catalog";
import { ProductCard } from "@/components/product/ProductCard";
import { GoogleReviews } from "@/components/trust/GoogleReviews";
import { Newsletter } from "@/components/trust/Newsletter";
import { Seo } from "@/components/seo/Seo";
import hero from "@/assets/hero.jpg";

const catIcons: Record<string, JSX.Element> = {
  acessorios: <Wrench className="h-8 w-8" />,
  automotivo: <Cog className="h-8 w-8" />,
  iluminacao: <Lightbulb className="h-8 w-8" />,
  eletrica: <Zap className="h-8 w-8" />,
};

const Index = () => {
  return (
    <>
      <Seo
        title="MotorTech Parts — Peças e Acessórios Automotivos"
        description="Faróis LED, lanternas, grades, ponteiras e acessórios automotivos. Frete grátis acima de R$ 299 e parcelamento em 12x sem juros."
      />
      {/* HERO */}
      <section className="relative bg-brand-black text-white overflow-hidden">
        <img src={hero} alt="MotorTech" width={1920} height={1080} className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/70 to-transparent" />
        {/* Speed line streaks */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-full h-1 bg-gradient-speed animate-speed-streak" />
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-speed animate-speed-streak" style={{ animationDelay: "0.6s" }} />
          <div className="absolute bottom-1/4 left-0 w-full h-1 bg-gradient-speed animate-speed-streak" style={{ animationDelay: "1.2s" }} />
        </div>

        <div className="container relative py-20 md:py-32 max-w-3xl">
          <span className="inline-block bg-primary text-primary-foreground text-xs font-bold tracking-widest px-3 py-1 rounded mb-4">PERFORMANCE • ESTILO • POTÊNCIA</span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl uppercase leading-[0.9] tracking-wider">
            Peças e Acessórios <span className="text-primary">para o seu Veículo</span>
          </h1>
          <p className="mt-6 text-lg text-white/80 max-w-xl">
            Mais de 10.000 itens originais e esportivos com entrega rápida em todo o Brasil.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="font-bold tracking-wider shadow-red">
              <Link to="/categorias">VER CATÁLOGO <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white hover:text-foreground">
              <Link to="/categoria/iluminacao">Promoções</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-brand-black-2 text-white">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10">
          {[
            { icon: Truck, t: "Frete Grátis", s: "Acima de R$ 299" },
            { icon: CreditCard, t: "Parcele em 12x", s: "Sem juros" },
            { icon: ShieldCheck, t: "Compra Segura", s: "Site SSL" },
            { icon: Headphones, t: "Atendimento", s: "Seg-Sáb 8h-20h" },
          ].map((b) => (
            <div key={b.t} className="bg-brand-black-2 p-5 flex items-center gap-3">
              <b.icon className="h-6 w-6 text-primary shrink-0" />
              <div>
                <div className="font-bold text-sm">{b.t}</div>
                <div className="text-xs text-white/60">{b.s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold tracking-widest text-primary">CATEGORIAS</span>
            <h2 className="font-display text-3xl md:text-5xl uppercase tracking-wider">Encontre por categoria</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/categoria/${cat.slug}`}
              className="group relative bg-gradient-dark text-white rounded-lg overflow-hidden p-6 min-h-[180px] flex flex-col justify-between border border-white/5 hover:border-primary transition-all hover:-translate-y-1 hover:shadow-red"
            >
              <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity" />
              <div className="text-primary group-hover:text-white transition-colors">{catIcons[cat.slug]}</div>
              <div>
                <h3 className="font-display text-2xl uppercase tracking-wider">{cat.name}</h3>
                <span className="text-xs text-white/60 group-hover:text-white inline-flex items-center gap-1 mt-1">
                  Ver produtos <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PROMO STRIP */}
      <section className="relative bg-gradient-red text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white animate-speed-streak" />
        </div>
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-center relative">
          <Truck className="h-7 w-7" />
          <span className="font-display text-xl md:text-3xl uppercase tracking-wider">Frete Grátis acima de R$ 299</span>
          <span className="hidden sm:inline">•</span>
          <span className="text-sm font-semibold">para todo o Brasil</span>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="container py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold tracking-widest text-primary">DESTAQUES</span>
            <h2 className="font-display text-3xl md:text-5xl uppercase tracking-wider">Mais Vendidos</h2>
          </div>
          <Link to="/categorias" className="text-sm font-semibold hover:text-primary hidden sm:inline-flex items-center gap-1">
            Ver todos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {bestSellers().map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* GOOGLE REVIEWS */}
      <GoogleReviews />

      {/* NEWSLETTER */}
      <Newsletter />
    </>
  );
};

export default Index;
