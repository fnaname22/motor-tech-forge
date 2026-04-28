import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";
import { Link } from "react-router-dom";

const KEY = "mt-cookie-consent";

export const CookieBanner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setShow(true);
  }, []);

  const accept = (mode: "all" | "essential") => {
    localStorage.setItem(KEY, JSON.stringify({ mode, at: new Date().toISOString() }));
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-4 pb-20 lg:pb-4">
      <div className="container max-w-5xl mx-auto bg-card border shadow-2xl rounded-lg p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Cookie className="h-6 w-6 text-primary shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold mb-1">Usamos cookies para melhorar sua experiência.</p>
            <p className="text-muted-foreground text-xs">
              Ao continuar navegando, você concorda com nossa{" "}
              <Link to="/politica-de-privacidade" className="text-primary underline">
                Política de Privacidade
              </Link>
              . Conforme a LGPD.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" onClick={() => accept("essential")} className="flex-1 md:flex-none">
            Configurar
          </Button>
          <Button size="sm" onClick={() => accept("all")} className="flex-1 md:flex-none font-bold">
            Aceitar Todos
          </Button>
        </div>
        <button
          aria-label="Fechar"
          onClick={() => accept("essential")}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground md:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
