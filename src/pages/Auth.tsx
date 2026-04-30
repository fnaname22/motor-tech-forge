import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Layout } from "@/components/layout/Layout";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Cadastro realizado! Verifique seu e-mail.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Login realizado com sucesso!");
        navigate("/admin");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro na autenticação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[70vh] py-12">
      <Card className="w-full max-w-md shadow-hard border-brand-red/20 bg-brand-black-2 text-white">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-display uppercase tracking-wider">
            {isSignUp ? "Criar Conta" : "Acesso Restrito"}
          </CardTitle>
          <CardDescription className="text-brand-gray">
            {isSignUp 
              ? "Preencha os dados para se cadastrar" 
              : "Entre com suas credenciais administrativas"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleAuth}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full bg-brand-red hover:bg-brand-red-dark text-white font-bold"
              disabled={loading}
            >
              {loading ? "Carregando..." : isSignUp ? "Cadastrar" : "Entrar"}
            </Button>
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-brand-gray hover:text-white transition-colors"
            >
              {isSignUp ? "Já tem conta? Entre aqui" : "Não tem conta? Cadastre-se"}
            </button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Auth;
