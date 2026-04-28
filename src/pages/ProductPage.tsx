import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { findProduct, productsBySubcategory, formatBRL, installments } from "@/data/catalog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "@/hooks/use-toast";
import { ProductCard } from "@/components/product/ProductCard";
import { ChevronRight, Heart, ShoppingCart, Star, Truck, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { TrustBadge, PaymentIcons } from "@/components/trust/TrustBadge";
import { ReviewsSection } from "@/components/product/ReviewsSection";
import { Seo } from "@/components/seo/Seo";

const ProductPage = () => {
  const { id = "" } = useParams();
  const product = findProduct(id);
  const { add, open } = useCart();
  const { has, toggle } = useWishlist();
  const [imgIdx, setImgIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const navigate = useNavigate();

  if (!product) return <div className="container py-20 text-center">Produto não encontrado. <Link to="/" className="text-primary">Voltar</Link></div>;

  const related = productsBySubcategory(product.subcategory).filter((p) => p.id !== product.id).slice(0, 4);

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
              src={product.images[imgIdx]}
              alt={product.name}
              className={cn("w-full h-full object-cover transition-transform duration-300", zoom && "scale-150")}
            />
          </div>
          <div className="grid grid-cols-4 gap-2 mt-3">
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setImgIdx(i)} className={cn("aspect-square bg-muted rounded border-2 overflow-hidden", imgIdx === i ? "border-primary" : "border-transparent")}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <span className="inline-block text-xs font-bold tracking-widest text-primary">{product.brand}</span>
          <h1 className="font-display text-3xl md:text-4xl uppercase tracking-wide mt-1 leading-tight">{product.name}</h1>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={cn("h-4 w-4", i < Math.round(product.rating) ? "fill-primary text-primary" : "text-muted")} />
              ))}
            </div>
            <span>{product.rating.toFixed(1)} ({product.reviewsCount} avaliações)</span>
            <span>•</span>
            <span>SKU: {product.sku}</span>
          </div>

          <div className="mt-6 bg-muted/40 p-5 rounded-lg border">
            {product.oldPrice && <div className="text-sm text-muted-foreground line-through">{formatBRL(product.oldPrice)}</div>}
            <div className="text-4xl font-extrabold text-primary leading-tight">{formatBRL(product.price)}</div>
            <div className="text-sm text-muted-foreground mt-1">ou {installments(product.price, 3)}</div>
            <div className="text-xs mt-1">À vista no PIX: <span className="font-bold text-foreground">{formatBRL(product.price * 0.95)}</span> (5% off)</div>
          </div>

          {/* Vehicle compatibility */}
          <div className="mt-6">
            <h3 className="font-display text-lg uppercase tracking-wider mb-2">Compatibilidade do Veículo</h3>
            <div className="grid grid-cols-3 gap-2">
              <Select><SelectTrigger><SelectValue placeholder="Ano" /></SelectTrigger><SelectContent>{["2024","2023","2022","2021","2020","2019","2018"].map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent></Select>
              <Select><SelectTrigger><SelectValue placeholder="Marca" /></SelectTrigger><SelectContent>{["VW","Fiat","Chevrolet","Ford","Toyota","Honda","Hyundai"].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select>
              <Select><SelectTrigger><SelectValue placeholder="Modelo" /></SelectTrigger><SelectContent>{["Gol","Onix","HB20","Civic","Corolla","Strada"].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button size="lg" onClick={() => handleAdd(false)} className="font-bold tracking-wider">
              <ShoppingCart className="h-4 w-4 mr-2" /> ADICIONAR AO CARRINHO
            </Button>
            <Button size="lg" onClick={() => handleAdd(true)} variant="default" className="font-bold tracking-wider bg-foreground hover:bg-foreground/90">
              <Zap className="h-4 w-4 mr-2" /> COMPRAR AGORA
            </Button>
          </div>
          <Button variant="outline" className="w-full mt-3" onClick={() => toggle(product.id)}>
            <Heart className={cn("h-4 w-4 mr-2", has(product.id) && "fill-primary text-primary")} />
            {has(product.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          </Button>

          {/* TRUST BADGE + PAYMENT ICONS */}
          <div className="mt-4 space-y-3">
            <TrustBadge />
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-muted-foreground font-semibold">Aceitamos:</span>
              <PaymentIcons />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs">
            <div className="border rounded p-3"><Truck className="h-5 w-5 text-primary mx-auto mb-1" />Frete grátis</div>
            <div className="border rounded p-3"><ShieldCheck className="h-5 w-5 text-primary mx-auto mb-1" />Garantia 12 meses</div>
            <div className="border rounded p-3"><Zap className="h-5 w-5 text-primary mx-auto mb-1" />Envio rápido</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="desc" className="mt-12">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
          <TabsTrigger value="desc" className="font-display tracking-wider rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent">DESCRIÇÃO</TabsTrigger>
          <TabsTrigger value="specs" className="font-display tracking-wider rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent">ESPECIFICAÇÕES</TabsTrigger>
          <TabsTrigger value="rev" className="font-display tracking-wider rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent">AVALIAÇÕES</TabsTrigger>
        </TabsList>
        <TabsContent value="desc" className="py-6 max-w-3xl text-muted-foreground leading-relaxed">{product.description}</TabsContent>
        <TabsContent value="specs" className="py-6 max-w-3xl">
          <table className="w-full text-sm">
            <tbody>
              {product.specs.map((s) => (
                <tr key={s.label} className="border-b">
                  <th className="text-left py-2 pr-4 font-semibold w-1/3">{s.label}</th>
                  <td className="py-2 text-muted-foreground">{s.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabsContent>
        <TabsContent value="rev" className="py-6 max-w-3xl">
          <ReviewsSection productId={product.id} />
        </TabsContent>
      </Tabs>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl md:text-3xl uppercase tracking-wider mb-6">Produtos relacionados</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductPage;
