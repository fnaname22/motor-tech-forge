import { Award, Shield, Zap, Users, CheckCircle2 } from "lucide-react";
import { Seo } from "@/components/seo/Seo";

const QuemSomos = () => (
  <>
    <Seo
      title="Quem Somos — MotorTech Parts"
      description="Conheça a história da MotorTech Parts, especialista em peças e acessórios automotivos com qualidade, confiança e agilidade."
    />
    <section className="bg-gradient-dark text-white py-16">
      <div className="container max-w-4xl text-center">
        <span className="text-xs font-bold tracking-widest text-primary">SOBRE A EMPRESA</span>
        <h1 className="font-display text-4xl md:text-6xl uppercase tracking-wider mt-2">Quem Somos</h1>
        <p className="text-white/70 mt-4 max-w-2xl mx-auto">
          Há mais de 10 anos transformando veículos com peças e acessórios de alta performance.
        </p>
      </div>
    </section>

    <section className="container py-14 max-w-4xl">
      <h2 className="font-display text-2xl md:text-3xl uppercase tracking-wider mb-4">Nossa História</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        A <strong>MotorTech Parts</strong> nasceu em 2014 da paixão por carros e da vontade de oferecer ao mercado brasileiro
        peças e acessórios automotivos com qualidade premium e preço justo. Começamos como uma pequena oficina em São Paulo
        e hoje somos referência nacional em iluminação automotiva, acessórios estéticos e personalização veicular.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-10">
        Atendemos mais de 50 mil clientes em todo o Brasil, com entrega rápida, atendimento humanizado e a melhor curadoria
        de produtos do mercado. Nossa missão é entregar performance, estilo e confiança para cada motorista.
      </p>

      <h2 className="font-display text-2xl md:text-3xl uppercase tracking-wider mb-6">Nossos Valores</h2>
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        {[
          { icon: Award, t: "Qualidade", d: "Produtos selecionados, marcas reconhecidas e testes rigorosos." },
          { icon: Shield, t: "Confiança", d: "Garantia em todos os produtos e atendimento transparente." },
          { icon: Zap, t: "Agilidade", d: "Despacho em até 24h e entrega expressa para todo o Brasil." },
        ].map((v) => (
          <div key={v.t} className="border rounded-lg p-6 hover:border-primary transition">
            <v.icon className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-display text-xl uppercase tracking-wider mb-1">{v.t}</h3>
            <p className="text-sm text-muted-foreground">{v.d}</p>
          </div>
        ))}
      </div>

      <div className="bg-muted rounded-lg aspect-[16/7] grid place-items-center mb-12 text-muted-foreground">
        <Users className="h-12 w-12 mb-2" />
      </div>

      <h2 className="font-display text-2xl md:text-3xl uppercase tracking-wider mb-6">Por que escolher a MotorTech?</h2>
      <ul className="space-y-3">
        {[
          "Mais de 10.000 produtos em estoque com pronta entrega",
          "Frete grátis em compras acima de R$ 299",
          "Parcelamento em até 12x sem juros no cartão",
          "Atendimento especializado via WhatsApp em horário comercial",
          "Garantia mínima de 12 meses em todos os produtos",
          "Site 100% seguro com certificado SSL e Mercado Pago oficial",
        ].map((item) => (
          <li key={item} className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  </>
);

export default QuemSomos;
