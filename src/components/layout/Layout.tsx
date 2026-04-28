import { Outlet, ScrollRestoration } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileBottomBar } from "./MobileBottomBar";
import { BackToTop } from "./BackToTop";
import { CartDrawer } from "@/components/cart/CartDrawer";

export const Layout = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
    <MobileBottomBar />
    <BackToTop />
    <CartDrawer />
  </div>
);
