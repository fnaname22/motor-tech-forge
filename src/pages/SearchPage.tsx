import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/use-products";
import { formatDbProduct } from "@/pages/CategoryPage";
import { Input } from "@/components/ui/input";
import { ProductCard, ProductCardSkeleton } from "@/components/product/ProductCard";
import { Search } from "lucide-react";

const SearchPage = () => {
  const [q, setQ] = useState("");
  const { data: dbProducts, isLoading } = useProducts();

  const list = useMemo(() => {
    if (!dbProducts) return [];
    const formatted = dbProducts.map(formatDbProduct);
    if (!q.trim()) return formatted;

    const term = q.toLowerCase();
    return formatted.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term) ||
        p.subcategoryName.toLowerCase().includes(term)
    );
  }, [dbProducts, q]);

  return (
    <div className="container py-10">
      <h1 className="font-display text-4xl uppercase tracking-wider mb-6">Busca</h1>
      <div className="relative max-w-xl mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="O que você procura? (ex: ponteira, uno, milha, filtro)"
          className="pl-9 h-12"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : list.length === 0 ? (
        <p className="text-muted-foreground">
          Nenhum produto encontrado. <Link to="/" className="text-primary font-bold">Voltar para o início</Link>
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
