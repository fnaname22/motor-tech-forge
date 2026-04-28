import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index.tsx";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import CategoriesIndex from "./pages/CategoriesIndex";
import SearchPage from "./pages/SearchPage";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound.tsx";
import QuemSomos from "./pages/QuemSomos";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import TrocasDevolucoes from "./pages/TrocasDevolucoes";
import PrazoEntrega from "./pages/PrazoEntrega";
import ComoComprar from "./pages/ComoComprar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <WishlistProvider>
          <CartProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/categorias" element={<CategoriesIndex />} />
                <Route path="/categoria/:slug" element={<CategoryPage />} />
                <Route path="/produto/:id" element={<ProductPage />} />
                <Route path="/busca" element={<SearchPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/quem-somos" element={<QuemSomos />} />
                <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
                <Route path="/trocas-e-devolucoes" element={<TrocasDevolucoes />} />
                <Route path="/prazo-de-entrega" element={<PrazoEntrega />} />
                <Route path="/como-comprar" element={<ComoComprar />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </CartProvider>
        </WishlistProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
