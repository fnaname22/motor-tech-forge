import { Link, NavLink, useNavigate } from "react-router-dom";
import { Heart, Search, ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.jpeg";
import { categories, products } from "@/data/catalog";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Header = () => {
  const { count, open } = useCart();
  const { count: wishCount } = useWishlist();
  const [q, setQ] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openCat, setOpenCat] = useState<string | null>(null);
  const navigate = useNavigate();

  const suggestions = q.length > 1
    ? products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())).slice(0, 5)
    : [];

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions[0]) navigate(`/produto/${suggestions[0].id}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-brand-black text-white shadow-hard">
      {/* Top promo strip */}
      <div className="bg-gradient-red text-primary-foreground text-center text-xs py-1.5 font-semibold tracking-wide">
        FRETE GRÁTIS PARA COMPRAS ACIMA DE R$ 299 • PARCELE EM ATÉ 12X
      </div>

      {/* Main row */}
      <div className="container flex items-center gap-4 py-3">
        <Link to="/" className="flex items-center shrink-0">
          <img src={logo} alt="MotorTech Parts" className="h-12 w-auto" width={200} height={96} />
        </Link>

        <form onSubmit={submitSearch} className="relative flex-1 hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-gray" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar peças, faróis, acessórios..."
            className="pl-9 bg-white text-foreground border-0 h-10"
          />
          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-popover text-popover-foreground rounded-md shadow-hard overflow-hidden z-50">
              {suggestions.map((p) => (
                <Link
                  key={p.id}
                  to={`/produto/${p.id}`}
                  onClick={() => setQ("")}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-muted text-sm"
                >
                  <img src={p.image} alt={p.name} className="h-8 w-8 object-cover rounded" />
                  <span className="line-clamp-1">{p.name}</span>
                </Link>
              ))}
            </div>
          )}
        </form>

        <div className="flex items-center gap-1 md:gap-2 ml-auto">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hidden sm:inline-flex" aria-label="Conta">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 relative" aria-label="Lista de desejos">
            <Heart className="h-5 w-5" />
            {wishCount > 0 && <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] rounded-full h-4 min-w-4 px-1 flex items-center justify-center font-bold">{wishCount}</span>}
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 relative" onClick={open} aria-label="Carrinho">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] rounded-full h-4 min-w-4 px-1 flex items-center justify-center font-bold">{count}</span>}
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Menu">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Category nav (desktop) */}
      <nav className="hidden lg:block border-t border-white/10 bg-brand-black-2">
        <div className="container flex items-center gap-1">
          {categories.map((cat) => (
            <div
              key={cat.slug}
              className="relative"
              onMouseEnter={() => setOpenCat(cat.slug)}
              onMouseLeave={() => setOpenCat(null)}
            >
              <NavLink
                to={`/categoria/${cat.slug}`}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-1 px-4 py-3 text-sm font-display tracking-wider uppercase transition-colors",
                    "hover:text-primary-glow",
                    isActive && "text-primary"
                  )
                }
              >
                {cat.name}
                {cat.subcategories.length > 0 && <ChevronDown className="h-3 w-3" />}
              </NavLink>

              {openCat === cat.slug && cat.subcategories.length > 0 && (
                <div className="absolute left-0 top-full bg-brand-black-2 border-t-2 border-primary min-w-48 shadow-hard animate-fade-in">
                  {cat.subcategories.map((sub) => (
                    <Link
                      key={sub.slug}
                      to={`/categoria/${cat.slug}?sub=${sub.slug}`}
                      className="block px-4 py-2.5 text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-brand-black text-white overflow-y-auto animate-slide-in-right">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <span className="font-display text-xl">MENU</span>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} className="text-white">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <form onSubmit={submitSearch} className="p-4 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-gray" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar..." className="pl-9 bg-white text-foreground border-0" />
              </div>
            </form>
            <div className="p-2">
              {categories.map((cat) => (
                <details key={cat.slug} className="group border-b border-white/5">
                  <summary className="flex items-center justify-between px-3 py-3 cursor-pointer font-display tracking-wider uppercase text-sm">
                    {cat.name}
                    <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="pb-2">
                    <Link to={`/categoria/${cat.slug}`} onClick={() => setMobileOpen(false)} className="block px-6 py-2 text-sm text-primary-glow">Ver tudo</Link>
                    {cat.subcategories.map((s) => (
                      <Link key={s.slug} to={`/categoria/${cat.slug}?sub=${s.slug}`} onClick={() => setMobileOpen(false)} className="block px-6 py-2 text-sm text-white/80 hover:text-white">
                        {s.name}
                      </Link>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
