import { Star } from "lucide-react";

const reviews = [
  { name: "Carlos M.", rating: 5, text: "Produto chegou super rápido e a qualidade é excelente! Voltarei a comprar com certeza." },
  { name: "Juliana R.", rating: 5, text: "Atendimento via WhatsApp impecável, tiraram todas minhas dúvidas. Recomendo demais!" },
  { name: "Rafael T.", rating: 4, text: "Farol LED instalei no meu carro e ficou show. Embalagem reforçada e bem protegida." },
  { name: "Patrícia L.", rating: 5, text: "Site confiável, paguei no PIX com desconto e recebi em 3 dias úteis. Top!" },
];

export const GoogleReviews = () => (
  <section className="container py-14">
    <div className="text-center mb-10">
      <span className="text-xs font-bold tracking-widest text-primary">DEPOIMENTOS</span>
      <h2 className="font-display text-3xl md:text-5xl uppercase tracking-wider">O que nossos clientes dizem</h2>
      <div className="flex items-center justify-center gap-2 mt-3">
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <span className="text-sm font-bold">4.9</span>
        <span className="text-sm text-muted-foreground">• Avaliações no Google</span>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {reviews.map((r) => (
        <article key={r.name} className="bg-card border rounded-lg p-5 flex flex-col gap-3 hover:border-primary transition">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground grid place-items-center font-bold">
              {r.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm">{r.name}</div>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3 w-3 ${i < r.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                ))}
              </div>
            </div>
            {/* Google G logo */}
            <svg className="h-5 w-5" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.6 39.5 16.2 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.2 5.2C41.4 35.6 44 30.2 44 24c0-1.3-.1-2.4-.4-3.5z"/>
            </svg>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">"{r.text}"</p>
        </article>
      ))}
    </div>
  </section>
);
