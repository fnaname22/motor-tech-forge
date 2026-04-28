import { ShieldCheck, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export const TrustBadge = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center gap-3 p-3 rounded-lg border bg-muted/30", className)}>
    <div className="h-10 w-10 grid place-items-center rounded-full bg-primary/10 text-primary shrink-0">
      <ShieldCheck className="h-5 w-5" />
    </div>
    <div className="text-xs leading-tight">
      <div className="font-bold uppercase tracking-wider">Compra 100% Segura</div>
      <div className="text-muted-foreground">Site protegido com criptografia SSL</div>
    </div>
    <Lock className="h-4 w-4 text-muted-foreground ml-auto" />
  </div>
);

export const PaymentIcons = ({ className }: { className?: string }) => {
  const methods = [
    { label: "PIX", color: "bg-[#32BCAD] text-white" },
    { label: "BOLETO", color: "bg-foreground text-background" },
    { label: "VISA", color: "bg-[#1A1F71] text-white" },
    { label: "MASTER", color: "bg-[#EB001B] text-white" },
    { label: "ELO", color: "bg-foreground text-background" },
    { label: "AMEX", color: "bg-[#2E77BB] text-white" },
  ];
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {methods.map((m) => (
        <span
          key={m.label}
          className={cn("px-2 py-1 rounded text-[10px] font-extrabold tracking-wider", m.color)}
        >
          {m.label}
        </span>
      ))}
    </div>
  );
};
