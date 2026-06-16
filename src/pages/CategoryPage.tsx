import { Link, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { productsByCategory } from "@/data/catalog";
import { useCategories } from "@/hooks/use-categories";
import { ProductCard, ProductCardSkeleton } from "@/components/product/ProductCard";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CategoryPage = () => {
  const { slug = "" } = useParams();
  const [params, setParams] = useSearchParams();
  const sub = params.get("sub");
  const [sort, setSort] = useState("relevance");
  const [loading, setLoading] = useState(true);
  const { categories } = useCategories();

  const category = categories.find((c) => c.slug === slug);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [slug, sub]);

  const list = useMemo(() => {
    let l = productsByCategory(slug);
    if (sub) l = l.filter((p) => p.subcategory === sub);
    if (sort === "price-asc") l = [...l].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") l = [...l].sort((a, b) => b.price - a.price);
    else if (sort === "best") l = [...l].sort((a, b) => Number(!!b.bestSeller) - Number(!!a.bestSeller));
    return l;
  }, [slug, sub, sort]);

  if (!category) return <div className="container py-20 text-center">Categoria não encontrada.</div>;

  const subActive = category.subcategories.find((s) => s.slug === sub);

  const setSub = (s: string | null) => {
    if (s) params.set("sub", s); else params.delete("sub");
    setParams(params);
  };

  return (
    <div className="container py-6 lg:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-muted-foreground mb-4 flex-wrap">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-3 w-3 mx-1" />
        <Link to={`/categoria/${category.slug}`} className="hover:text-primary">{category.name}</Link>
        {subActive && (<><ChevronRight className="h-3 w-3 mx-1" /><span className="text-foreground">{subActive.name}</span></>)}
      </nav>

      <div className="mb-6">
        <h1 className="font-display text-4xl md:text-5xl uppercase tracking-wider">{subActive?.name || category.name}</h1>
        <p className="text-muted-foreground text-sm mt-1">{list.length} produto(s) encontrado(s)</p>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-32">
            <h3 className="font-display text-lg uppercase tracking-wider mb-3">Subcategorias</h3>
            {category.subcategories.length === 0 ? (
              <p className="text-sm text-muted-foreground">Em breve, novas subcategorias.</p>
            ) : (
              <ul className="space-y-1">
                <li>
                  <button onClick={() => setSub(null)} className={cn("text-sm w-full text-left px-3 py-2 rounded hover:bg-muted", !sub && "bg-primary text-primary-foreground hover:bg-primary font-bold")}>
                    Todos
                  </button>
                </li>
                {category.subcategories.map((s) => (
                  <li key={s.slug}>
                    <button onClick={() => setSub(s.slug)} className={cn("text-sm w-full text-left px-3 py-2 rounded hover:bg-muted", sub === s.slug && "bg-primary text-primary-foreground hover:bg-primary font-bold")}>
                      {s.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        <div>
          {/* Mobile sub chips */}
          {category.subcategories.length > 0 && (
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-4 -mx-1 px-1">
              <button onClick={() => setSub(null)} className={cn("shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border", !sub ? "bg-primary text-primary-foreground border-primary" : "bg-muted")}>Todos</button>
              {category.subcategories.map((s) => (
                <button key={s.slug} onClick={() => setSub(s.slug)} className={cn("shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border", sub === s.slug ? "bg-primary text-primary-foreground border-primary" : "bg-muted")}>{s.name}</button>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center mb-4">
            <span className="text-xs text-muted-foreground hidden sm:inline">Ordenar por:</span>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-56 ml-auto"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevância</SelectItem>
                <SelectItem value="price-asc">Menor preço</SelectItem>
                <SelectItem value="price-desc">Maior preço</SelectItem>
                <SelectItem value="best">Mais vendidos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : list.length === 0
                ? <p className="col-span-full text-center text-muted-foreground py-12">Nenhum produto nesta categoria ainda.</p>
                : list.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
