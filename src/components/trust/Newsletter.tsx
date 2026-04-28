import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("E-mail inválido");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: trimmed });
    setLoading(false);
    if (error) {
      if (error.code === "23505") toast.success("Você já está cadastrado!");
      else toast.error("Não foi possível cadastrar. Tente novamente.");
      return;
    }
    toast.success("Cadastro realizado com sucesso!");
    setEmail("");
  };

  return (
    <section className="bg-gradient-dark text-white py-12 border-y border-white/10">
      <div className="container max-w-3xl text-center">
        <Mail className="h-10 w-10 text-primary mx-auto mb-3" />
        <h2 className="font-display text-3xl md:text-4xl uppercase tracking-wider">
          Receba ofertas <span className="text-primary">exclusivas</span> no seu e-mail
        </h2>
        <p className="text-white/70 text-sm mt-2">Promoções, lançamentos e cupons de desconto direto na sua caixa de entrada.</p>
        <form onSubmit={submit} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <Input
            type="email"
            required
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white text-foreground"
          />
          <Button type="submit" disabled={loading} size="lg" className="font-bold tracking-wider shadow-red">
            {loading ? "Enviando..." : "QUERO RECEBER"}
          </Button>
        </form>
        <p className="text-xs text-white/50 mt-3">Seus dados estão seguros conforme nossa Política de Privacidade.</p>
      </div>
    </section>
  );
};
