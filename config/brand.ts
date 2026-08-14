import type { BrandConfig, PaymentMethod } from "@/lib/types";

/**
 * Configuração da marca — este é o único arquivo que muda ao trocar de cliente.
 * Nenhum componente conhece "Barbearia Tech": tudo vem daqui.
 */

/** Grade padrão de horários. Cada unidade pode sobrescrever a sua. */
const SLOTS = [
  "09:00",
  "09:45",
  "10:30",
  "11:15",
  "13:00",
  "13:45",
  "14:30",
  "15:15",
  "16:00",
  "16:45",
  "17:30",
  "18:15",
];

export const brand: BrandConfig = {
  name: "Barbearia Tech",
  logoLetter: "B",
  logoImage: null,
  colors: {
    accent: "#d8a85a",
    accentHover: "#f0c884",
    accentSoft: "rgba(216,168,90,0.12)",
  },
  showPrices: true,
  contact: {
    instagram: "@barbeariatech",
    whatsapp: "5511900000000",
    email: "contato@barbeariatech.com",
  },

  /** Remova o que a barbearia não aceita — a ordem aqui é a ordem na tela. */
  payments: ["pix", "debit", "credit", "onsite"],

  services: [
    {
      id: "corte",
      name: "Corte de cabelo",
      duration: "45 min",
      durationMinutes: 45,
      price: 60,
      description:
        "Máquina, tesoura e finalização. Consulta rápida de estilo antes de começar.",
    },
    {
      id: "barba",
      name: "Barba desenhada",
      duration: "30 min",
      durationMinutes: 30,
      price: 45,
      description:
        "Toalha quente, navalha e hidratação. Contorno feito no detalhe.",
    },
    {
      id: "combo",
      name: "Combo corte + barba",
      duration: "1h 15min",
      durationMinutes: 75,
      price: 95,
      description:
        "O pacote completo, com pausa para café entre os dois serviços.",
    },
    {
      id: "kids",
      name: "Kids e Teens",
      duration: "35 min",
      durationMinutes: 35,
      price: 50,
      description:
        "Atendimento paciente para crianças e adolescentes, sem pressa.",
    },
  ],

  units: [
    {
      id: "centro",
      name: "Unidade Centro",
      address: "Rua das Palmeiras, 120 — Centro",
      hours: "Seg–Sáb · 09h às 20h",
      slots: SLOTS,
    },
    {
      id: "jardins",
      name: "Unidade Jardins",
      address: "Av. Bela Vista, 880 — Jardins",
      hours: "Seg–Sáb · 10h às 21h",
      slots: SLOTS,
    },
    {
      id: "parque-norte",
      name: "Unidade Parque Norte",
      address: "Alameda Norte, 45 — Parque Norte",
      hours: "Ter–Sáb · 09h às 19h",
      slots: SLOTS,
    },
    {
      id: "lago-sul",
      name: "Unidade Lago Sul",
      address: "Q. 12, Bloco C, Loja 4 — Lago Sul",
      hours: "Seg–Sex · 09h às 20h",
      slots: SLOTS,
    },
  ],

  /** "Sem preferência" é adicionado pela UI — aqui ficam só as pessoas. */
  barbers: [
    { id: "rafa", name: "Rafa" },
    { id: "teo", name: "Téo" },
    { id: "jonas", name: "Jonas" },
  ],

  gallery: [
    { id: "ambiente", caption: "ambiente da loja", image: null },
    { id: "corte", caption: "corte finalizado", image: null },
    { id: "navalha", caption: "detalhe navalha", image: null },
    { id: "pai-e-filho", caption: "pai e filho", image: null },
    { id: "cadeira", caption: "cadeira e espelho", image: null },
    { id: "equipe", caption: "equipe", image: null },
  ],

  testimonials: [
    {
      id: "leonardo",
      quote:
        "Ambiente descontraído e moderno. Atendimento excelente e profissionais muito qualificados.",
      author: "Leonardo A.",
    },
    {
      id: "gustavo",
      quote:
        "Corte feito com bastante cuidado, esteticamente perfeito. Marquei pelo celular em um minuto.",
      author: "Gustavo L.",
    },
    {
      id: "marcos",
      quote:
        "Levo meu filho desde os 4 anos. Paciência e capricho em todo atendimento.",
      author: "Marcos V.",
    },
  ],
};

/** Preço formatado respeitando a flag de exibição. */
export function priceLabel(price: number, fallback = "sob consulta") {
  return brand.showPrices ? `R$ ${price}` : fallback;
}

/**
 * Formas de pagamento oferecidas de fato: sem preço na tela não há valor a
 * cobrar antecipado, então sobra só o pagamento na unidade.
 */
export function availablePayments(): PaymentMethod[] {
  const methods = brand.showPrices
    ? brand.payments
    : brand.payments.filter((method) => method === "onsite");

  return methods.length > 0 ? methods : ["onsite"];
}
