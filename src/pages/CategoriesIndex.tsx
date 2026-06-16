import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/use-categories";
import { Wrench, Cog, Lightbulb, Zap, ArrowRight, Loader2 } from "lucide-react";

const icons: Record<string, JSX.Element> = {
  acessorios: <Wrench className="h-10 w-10" />,
  automotivo: <Cog className="h-10 w-10" />,
  iluminacao: <Lightbulb className="h-10 w-10" />,
  eletrica: <Zap className="h-10 w-10" />,
};

const CategoriesIndex = () => {
  const { categories, loading } = useCategories();
  return (
    <div className="container py-10">
      <h1 className="font-display text-4xl md:text-5xl uppercase tracking-wider mb-8">Todas as Categorias</h1>
      {loading ? (
        <div className="flex items-center justify-center py-20 text-brand-gray"><Loader2 className="animate-spin h-6 w-6 mr-2" /> Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((c) => (
            <Link key={c.slug} to={`/categoria/${c.slug}`} className="group bg-gradient-dark text-white p-6 rounded-lg border border-white/5 hover:border-primary hover:shadow-red transition-all">
              <div className="text-primary mb-4">{icons[c.slug] ?? <Cog className="h-10 w-10" />}</div>
              <h2 className="font-display text-2xl uppercase tracking-wider mb-2">{c.name}</h2>
              <ul className="text-sm text-white/70 space-y-0.5 mb-3">
                {c.subcategories.length > 0
                  ? c.subcategories.map((s) => <li key={s.slug}>• {s.name}</li>)
                  : <li className="italic">Subcategorias em breve</li>}
              </ul>
              <span className="text-primary text-sm font-semibold inline-flex items-center gap-1">Explorar <ArrowRight className="h-3 w-3" /></span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesIndex;

