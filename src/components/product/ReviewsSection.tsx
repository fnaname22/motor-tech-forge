import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { StarRating } from "./StarRating";
import { cn } from "@/lib/utils";

type Review = {
  id: string;
  rating: number;
  comment: string;
  user_name: string;
  created_at: string;
  approved: boolean;
};

export const ReviewsSection = ({ productId }: { productId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data } = await supabase
        .from("reviews")
        .select("id, rating, comment, user_name, created_at, approved")
        .eq("product_id", productId)
        .eq("approved", true)
        .order("created_at", { ascending: false });
      if (active) setReviews((data as Review[]) ?? []);
    };
    load();

    supabase.auth.getUser().then(({ data }) => {
      if (!active || !data.user) return;
      const meta = data.user.user_metadata as { full_name?: string };
      setUser({ id: data.user.id, name: meta?.full_name || data.user.email?.split("@")[0] || "Cliente" });
    });
    return () => { active = false; };
  }, [productId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (comment.trim().length < 5) {
      toast.error("Escreva um comentário com pelo menos 5 caracteres.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("reviews").insert({
      product_id: productId,
      user_id: user.id,
      user_name: user.name,
      rating,
      comment: comment.trim(),
    });
    setLoading(false);
    if (error) {
      if (error.code === "23505") toast.error("Você já avaliou este produto.");
      else toast.error("Não foi possível enviar sua avaliação.");
      return;
    }
    toast.success("Avaliação enviada! Obrigado.");
    setShowForm(false);
    setComment("");
    const { data } = await supabase
      .from("reviews")
      .select("id, rating, comment, user_name, created_at, approved")
      .eq("product_id", productId)
      .eq("approved", true)
      .order("created_at", { ascending: false });
    setReviews((data as Review[]) ?? []);
  };

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-4xl font-extrabold">{avg.toFixed(1)}</span>
            <div>
              <StarRating rating={avg} size="md" />
              <div className="text-xs text-muted-foreground mt-1">{reviews.length} avaliações</div>
            </div>
          </div>
        </div>
        {user ? (
          <Button onClick={() => setShowForm((s) => !s)} variant={showForm ? "outline" : "default"}>
            {showForm ? "Cancelar" : "Escrever Avaliação"}
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground">Faça login para avaliar este produto.</p>
        )}
      </div>

      {showForm && user && (
        <form onSubmit={submit} className="border rounded-lg p-4 space-y-3 bg-muted/30">
          <div>
            <label className="text-sm font-semibold block mb-2">Sua nota</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} estrelas`}>
                  <Star className={cn("h-7 w-7 transition", n <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/40 hover:text-yellow-300")} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold block mb-2">Comentário</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Conte sua experiência com o produto..."
              rows={4}
              maxLength={1000}
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="font-bold">
            {loading ? "Enviando..." : "Enviar Avaliação"}
          </Button>
        </form>
      )}

      {reviews.length === 0 ? (
        <p className="text-muted-foreground text-sm">Seja o primeiro a avaliar este produto.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary grid place-items-center font-bold text-sm">
                    {r.user_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{r.user_name}</div>
                    <StarRating rating={r.rating} size="xs" />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{r.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
