import { MessageCircle } from "lucide-react";

const PHONE = "5511940001234"; // (11) 94000-1234
const MESSAGE = encodeURIComponent("Olá! Vim pelo site MotorTech Parts e preciso de ajuda.");

export const WhatsAppButton = () => (
  <a
    href={`https://wa.me/${PHONE}?text=${MESSAGE}`}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Fale Conosco no WhatsApp"
    className="group fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-40"
  >
    <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-foreground text-background text-xs font-semibold px-3 py-1.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none hidden sm:block">
      Fale Conosco no WhatsApp
    </span>
    <span className="relative flex h-14 w-14">
      <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-60 animate-ping" />
      <span className="relative inline-flex h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#1da851] items-center justify-center text-white shadow-xl transition">
        <MessageCircle className="h-7 w-7" fill="white" />
      </span>
    </span>
  </a>
);
