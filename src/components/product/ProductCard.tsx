import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Product, formatBRL, installments } from "@/data/catalog";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export const ProductCard = ({ product }: { product: Product }) => {
  const { add, open } = useCart();
  const { has, toggle } = useWishlist();
  const fav = has(product.id);

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add(product, 1);
    toast({ title: "Adicionado ao carrinho", description: product.name });
    open();
  };

  return (
    <Link to={`/produto/${product.id}`} className="group bg-card rounded-lg overflow-hidden border border-border hover:border-primary hover:shadow-red transition-all duration-300 flex flex-col">
      <div className="relative bg-muted overflow-hidden aspect-square">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={800}
          height={800}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.oldPrice && (
          <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
            -{Math.round((1 - product.price / product.oldPrice) * 100)}%
          </span>
        )}
        <button
          onClick={(e) => { e.preventDefault(); toggle(product.id); }}
          aria-label="Favoritar"
          className={cn(
            "absolute top-2 right-2 h-9 w-9 grid place-items-center rounded-full bg-white/90 backdrop-blur transition",
            fav ? "text-primary" : "text-foreground hover:text-primary"
          )}
        >
          <Heart className={cn("h-4 w-4", fav && "fill-current")} />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gray">{product.subcategoryName}</span>
        <h3 className="text-sm font-semibold leading-tight line-clamp-2 min-h-[2.5rem]">{product.name}</h3>

        <div className="mt-auto pt-2">
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through block">{formatBRL(product.oldPrice)}</span>
          )}
          <div className="text-xl font-extrabold text-primary leading-none">{formatBRL(product.price)}</div>
          <div className="text-[11px] text-muted-foreground mt-1">{installments(product.price)}</div>
        </div>

        <Button onClick={addToCart} className="mt-3 w-full font-bold tracking-wide" size="sm">
          <ShoppingCart className="h-4 w-4 mr-2" />
          ADICIONAR
        </Button>
      </div>
    </Link>
  );
};

export const ProductCardSkeleton = () => (
  <div className="bg-card rounded-lg overflow-hidden border border-border">
    <div className="aspect-square bg-muted animate-pulse" />
    <div className="p-4 space-y-2">
      <div className="h-3 bg-muted animate-pulse rounded w-1/3" />
      <div className="h-4 bg-muted animate-pulse rounded w-4/5" />
      <div className="h-6 bg-muted animate-pulse rounded w-1/2 mt-2" />
      <div className="h-9 bg-muted animate-pulse rounded mt-2" />
    </div>
  </div>
);
