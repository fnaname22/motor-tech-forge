import grade from "@/assets/products/grade.jpg";
import ponteira from "@/assets/products/ponteira.jpg";
import moldura from "@/assets/products/moldura.jpg";
import farol from "@/assets/products/farol.jpg";
import lanterna from "@/assets/products/lanterna.jpg";
import lente from "@/assets/products/lente.jpg";

export type Subcategory = { slug: string; name: string };
export type Category = { slug: string; name: string; subcategories: Subcategory[] };

export const categories: Category[] = [
  {
    slug: "acessorios",
    name: "Acessórios",
    subcategories: [
      { slug: "grades", name: "Grades" },
      { slug: "ponteiras", name: "Ponteiras" },
      { slug: "molduras", name: "Molduras" },
    ],
  },
  {
    slug: "automotivo",
    name: "Automotivo",
    subcategories: [],
  },
  {
    slug: "iluminacao",
    name: "Iluminação",
    subcategories: [
      { slug: "farois", name: "Faróis" },
      { slug: "lanternas", name: "Lanternas" },
      { slug: "lentes", name: "Lentes" },
    ],
  },
  {
    slug: "eletrica",
    name: "Elétrica",
    subcategories: [],
  },
];

export type Product = {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;       // category slug
  subcategory: string;    // subcategory slug
  subcategoryName: string;
  price: number;
  oldPrice?: number;
  image: string;
  images: string[];
  shortDescription: string;
  description: string;
  specs: { label: string; value: string }[];
  bestSeller?: boolean;
  rating: number;
  reviewsCount: number;
};

const make = (p: Omit<Product, "images">): Product => ({ ...p, images: [p.image, p.image, p.image] });

export const products: Product[] = [
  make({
    id: "p1", sku: "GRD-1001", name: "Grade Dianteiras Cromada Esportiva", brand: "MotorTech",
    category: "acessorios", subcategory: "grades", subcategoryName: "Grades",
    price: 459.9, oldPrice: 599.9, image: grade,
    shortDescription: "Grade dianteira cromada estilo esportivo, alta durabilidade.",
    description: "Grade dianteira em ABS cromado de alta resistência, fácil instalação, acabamento espelhado e visual agressivo para o seu veículo.",
    specs: [
      { label: "Material", value: "ABS Cromado" },
      { label: "Cor", value: "Cromado/Preto" },
      { label: "Garantia", value: "12 meses" },
    ],
    bestSeller: true, rating: 4.7, reviewsCount: 124,
  }),
  make({
    id: "p2", sku: "PNT-2210", name: "Ponteira de Escapamento Inox 63mm", brand: "RaceLine",
    category: "acessorios", subcategory: "ponteiras", subcategoryName: "Ponteiras",
    price: 189.9, image: ponteira,
    shortDescription: "Ponteira polida em aço inox, som esportivo e visual premium.",
    description: "Ponteira de escapamento em aço inoxidável 304, acabamento polido espelhado, fixação por parafuso. Compatível com escapamentos de 38 a 57mm.",
    specs: [
      { label: "Material", value: "Aço Inox 304" },
      { label: "Diâmetro Saída", value: "63 mm" },
      { label: "Fixação", value: "Parafuso lateral" },
    ],
    bestSeller: true, rating: 4.8, reviewsCount: 88,
  }),
  make({
    id: "p3", sku: "MLD-3105", name: "Moldura de Farol Black Piano", brand: "MotorTech",
    category: "acessorios", subcategory: "molduras", subcategoryName: "Molduras",
    price: 129.9, image: moldura,
    shortDescription: "Moldura decorativa preta brilhante para faróis.",
    description: "Par de molduras decorativas em ABS pintura black piano, fixação por adesivo automotivo de alta aderência.",
    specs: [
      { label: "Material", value: "ABS" },
      { label: "Cor", value: "Preto Brilhante" },
      { label: "Conteúdo", value: "Par (2 unid.)" },
    ],
    rating: 4.5, reviewsCount: 42,
  }),
  make({
    id: "p4", sku: "FAR-4501", name: "Farol Full LED Projetor 90W", brand: "LumenPro",
    category: "iluminacao", subcategory: "farois", subcategoryName: "Faróis",
    price: 899.9, oldPrice: 1099.9, image: farol,
    shortDescription: "Farol LED com projetor, iluminação branca 6000K.",
    description: "Farol completo full LED com tecnologia projetor, lente vidro temperado, drive integrado e DRL diurno em formato exclusivo.",
    specs: [
      { label: "Potência", value: "90W" },
      { label: "Temperatura de Cor", value: "6000K" },
      { label: "Tensão", value: "12V" },
    ],
    bestSeller: true, rating: 4.9, reviewsCount: 211,
  }),
  make({
    id: "p5", sku: "LNT-5210", name: "Lanterna Traseira LED Sequencial", brand: "LumenPro",
    category: "iluminacao", subcategory: "lanternas", subcategoryName: "Lanternas",
    price: 749.9, image: lanterna,
    shortDescription: "Lanterna LED com setas sequenciais estilo dinâmico.",
    description: "Par de lanternas traseiras com tecnologia LED, setas sequenciais (efeito dinâmico) e função freio + posição integrada.",
    specs: [
      { label: "Tecnologia", value: "Full LED" },
      { label: "Setas", value: "Sequenciais" },
      { label: "Conteúdo", value: "Par (LD + LE)" },
    ],
    bestSeller: true, rating: 4.8, reviewsCount: 156,
  }),
  make({
    id: "p6", sku: "LNS-6090", name: "Lente de Farol Auxiliar Neblina Amarela", brand: "RaceLine",
    category: "iluminacao", subcategory: "lentes", subcategoryName: "Lentes",
    price: 89.9, image: lente,
    shortDescription: "Lente amarela para farol de neblina, melhora visibilidade.",
    description: "Par de lentes em policarbonato amarelo para faróis auxiliares de neblina. Melhora a visibilidade em condições adversas e visual esportivo.",
    specs: [
      { label: "Material", value: "Policarbonato" },
      { label: "Cor", value: "Amarelo" },
      { label: "Diâmetro", value: "90 mm" },
    ],
    rating: 4.4, reviewsCount: 37,
  }),
  make({
    id: "p7", sku: "GRD-1102", name: "Grade Frontal Honeycomb Black", brand: "RaceLine",
    category: "acessorios", subcategory: "grades", subcategoryName: "Grades",
    price: 389.9, image: grade,
    shortDescription: "Grade colmeia preta agressiva, estilo racing.",
    description: "Grade frontal padrão honeycomb em ABS preto fosco, visual esportivo e ventilação otimizada.",
    specs: [
      { label: "Material", value: "ABS" },
      { label: "Acabamento", value: "Preto Fosco" },
    ],
    rating: 4.6, reviewsCount: 64,
  }),
  make({
    id: "p8", sku: "FAR-4710", name: "Farol Angel Eyes Bi-LED", brand: "MotorTech",
    category: "iluminacao", subcategory: "farois", subcategoryName: "Faróis",
    price: 1299.9, image: farol,
    shortDescription: "Farol com olho de anjo e tecnologia Bi-LED.",
    description: "Farol completo com angel eyes integrado, projetor Bi-LED de alta performance e DRL com função seta.",
    specs: [
      { label: "Tecnologia", value: "Bi-LED" },
      { label: "Recursos", value: "Angel Eyes + DRL" },
    ],
    rating: 4.9, reviewsCount: 98,
  }),
];

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const installments = (price: number, n = 3) =>
  `${n}x de ${formatBRL(price / n)} sem juros`;

export const findCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const productsByCategory = (slug: string) => products.filter((p) => p.category === slug);
export const productsBySubcategory = (slug: string) => products.filter((p) => p.subcategory === slug);
export const findProduct = (id: string) => products.find((p) => p.id === id);
export const bestSellers = () => products.filter((p) => p.bestSeller);
