import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { findProduct, formatBRL, installments, Product } from "@/data/catalog";
import { useProduct, useProducts } from "@/hooks/use-products";
import { formatDbProduct } from "@/pages/CategoryPage";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "@/hooks/use-toast";
import { ProductCard } from "@/components/product/ProductCard";
import { ChevronRight, Heart, ShoppingCart, Star, Truck, ShieldCheck, Zap, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrustBadge, PaymentIcons } from "@/components/trust/TrustBadge";
import { ReviewsSection } from "@/components/product/ReviewsSection";
import { Seo } from "@/components/seo/Seo";

const ProductPage = () => {
  const { id = "" } = useParams();
  const isUuid = id.length > 10;

  const { data: dbProduct, isLoading: loadingDb } = useProduct(isUuid ? id : "");
  const staticProduct = !isUuid ? findProduct(id) : null;

  const product: Product | null = useMemo(() => {
    if (dbProduct) return formatDbProduct(dbProduct);
    if (staticProduct) return staticProduct;
    return null;
  }, [dbProduct, staticProduct]);

  const { data: relatedDb } = useProducts(product?.category);

  const related = useMemo(() => {
    if (!product) return [];
    if (relatedDb && relatedDb.length > 0) {
      return relatedDb.filter((p) => p.id !== product.id).slice(0, 4).map(formatDbProduct);
    }
    return [];
  }, [product, relatedDb]);

  const { add, open } = useCart();
  const { has, toggle } = useWishlist();
  const [imgIdx, setImgIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const navigate = useNavigate();

  if (loadingDb) {
    return (
      <div className="container py-20 text-center flex items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="animate-spin h-5 w-5" /> Carregando produto...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-20 text-center">
        Produto não encontrado. <Link to="/" className="text-primary font-bold">Voltar para o início</Link>
      </div>
    );
  }

  const handleAdd = (buyNow = false) => {
    add(product, 1);
    toast({ title: "Adicionado ao carrinho", description: product.name });
    if (buyNow) navigate("/checkout"); else open();
  };

  return (
    <div className="container py-6 lg:py-10">
      <Seo
        title={`${product.name} — MotorTech Parts`}
        description={product.shortDescription}
        image={product.image}
      />
      <nav className="flex items-center text-sm text-muted-foreground mb-6 flex-wrap">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-3 w-3 mx-1" />
        <Link to={`/categoria/${product.category}`} className="hover:text-primary capitalize">{product.category}</Link>
        <ChevronRight className="h-3 w-3 mx-1" />
        <span className="text-foreground line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <div>
          <div
            className="relative aspect-square bg-muted rounded-lg overflow-hidden border cursor-zoom-in"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
          >
            <img
              src={product.images[imgIdx] || product.image}
              alt={product.name}
              className={cn("w-full h-full object-cover transition-transform duration-300", zoom && "scale-125")}
            />
            {product.oldPrice && (
              <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded">
                OFERTA
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={cn("h-20 w-20 rounded border-2 overflow-hidden shrink-0", i === imgIdx ? "border-primary" : "border-transparent opacity-70 hover:opacity-100")}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <div className="text-xs uppercase font-bold text-primary tracking-widest mb-1">{product.brand}</div>
            <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-wider">{product.name}</h1>
            <div className="text-xs text-muted-foreground mt-1">SKU: {product.sku}</div>
          </div>

          <div className="border-y py-4 space-y-1">
            {product.oldPrice && (
              <span className="text-sm text-muted-foreground line-through mr-2">
                {formatBRL(product.oldPrice)}
              </span>
            )}
            <div className="font-display text-4xl text-primary font-bold">
              {formatBRL(product.price)}
            </div>
            <div className="text-xs font-semibold text-muted-foreground">
              {installments(product.price)}
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">{product.shortDescription}</p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button size="lg" className="flex-1 font-bold tracking-wider" onClick={() => handleAdd(false)}>
              <ShoppingCart className="h-4 w-4 mr-2" /> ADICIONAR AO CARRINHO
            </Button>
            <Button size="lg" variant="secondary" className="flex-1 font-bold tracking-wider" onClick={() => handleAdd(true)}>
              COMPRAR AGORA
            </Button>
            <Button size="lg" variant="outline" className="px-4" onClick={() => toggle(product)}>
              <Heart className={cn("h-5 w-5", has(product.id) && "fill-primary text-primary")} />
            </Button>
          </div>

          <TrustBadge />
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="desc">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-4">
            <TabsTrigger value="desc" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent font-display uppercase tracking-wider text-base py-3">
              Descrição
            </TabsTrigger>
            <TabsTrigger value="specs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent font-display uppercase tracking-wider text-base py-3">
              Especificações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="desc" className="pt-6 prose max-w-none text-muted-foreground text-sm">
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          </TabsContent>

          <TabsContent value="specs" className="pt-6">
            <dl className="grid sm:grid-cols-2 gap-4 text-sm max-w-xl">
              {product.specs.map((s) => (
                <div key={s.label} className="border p-3 rounded flex justify-between">
                  <dt className="text-muted-foreground">{s.label}</dt>
                  <dd className="font-semibold">{s.value}</dd>
                </div>
              ))}
            </dl>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16 border-t pt-10">
          <h2 className="font-display text-2xl uppercase tracking-wider mb-6">Produtos Relacionados</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductPage;
