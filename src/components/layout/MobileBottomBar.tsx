import { Home, LayoutGrid, Search, ShoppingCart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

export const MobileBottomBar = () => {
  const { count, open } = useCart();
  const { pathname } = useLocation();

  const item = (active: boolean) => cn(
    "flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold tracking-wide transition-colors",
    active ? "text-primary" : "text-white/70 hover:text-white"
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-brand-black border-t border-white/10">
      <div className="grid grid-cols-4 h-16">
        <Link to="/" className={item(pathname === "/")}>
          <Home className="h-5 w-5" />HOME
        </Link>
        <Link to="/categorias" className={item(pathname.startsWith("/categoria"))}>
          <LayoutGrid className="h-5 w-5" />CATEGORIAS
        </Link>
        <Link to="/busca" className={item(pathname === "/busca")}>
          <Search className="h-5 w-5" />BUSCA
        </Link>
        <button onClick={open} className={item(false) + " relative"}>
          <ShoppingCart className="h-5 w-5" />CARRINHO
          {count > 0 && <span className="absolute top-1 right-1/4 bg-primary text-primary-foreground text-[10px] rounded-full h-4 min-w-4 px-1 flex items-center justify-center font-bold">{count}</span>}
        </button>
      </div>
    </nav>
  );
};
