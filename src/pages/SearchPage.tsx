import { useState } from "react";
import { Link } from "react-router-dom";
import { products } from "@/data/catalog";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/product/ProductCard";
import { Search } from "lucide-react";

const SearchPage = () => {
  const [q, setQ] = useState("");
  const list = q.length > 0
    ? products.filter((p) => (p.name + p.brand + p.subcategoryName).toLowerCase().includes(q.toLowerCase()))
    : products;

  return (
    <div className="container py-10">
      <h1 className="font-display text-4xl uppercase tracking-wider mb-6">Busca</h1>
      <div className="relative max-w-xl mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="O que você procura?" className="pl-9 h-12" />
      </div>
      {list.length === 0 ? (
        <p className="text-muted-foreground">Nenhum produto encontrado. <Link to="/" className="text-primary">Voltar</Link></p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
