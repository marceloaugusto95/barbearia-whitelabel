/**
 * Tipos do domínio white label.
 * Nada aqui é específico da "Barbearia Tech" — a marca de exemplo vive em `config/`.
 */

export type Service = {
  id: string;
  name: string;
  /** Rótulo exibido, ex.: "1h 15min". */
  duration: string;
  /** Duração real em minutos — usada pela API de disponibilidade. */
  durationMinutes: number;
  /** Preço em reais. Só é exibido quando `brand.showPrices` é true. */
  price: number;
  description: string;
};

export type Unit = {
  id: string;
  name: string;
  address: string;
  /** Horário de funcionamento, ex.: "Seg–Sáb · 09h às 20h". */
  hours: string;
  /** Grade de horários oferecida por esta unidade. */
  slots: string[];
};

export type Barber = {
  id: string;
  name: string;
};

export type GalleryItem = {
  id: string;
  /** Legenda do placeholder. Vira o `alt` quando a foto real chegar. */
  caption: string;
  /** Foto real do cliente. Enquanto for `null`, mostramos o placeholder listrado. */
  image: string | null;
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
};

export type BrandConfig = {
  name: string;
  /** Letra do logo enquanto não há arte do cliente. */
  logoLetter: string;
  /** Logo real (substitui a letra quando definido). */
  logoImage: string | null;
  colors: {
    accent: string;
    accentHover: string;
    /** Fundo da opção selecionada no modal. */
    accentSoft: string;
  };
  /** Mostrar valores nos cards e no resumo, ou "sob consulta". */
  showPrices: boolean;
  /**
   * Fuso da barbearia (IANA). O servidor roda em UTC na Vercel, então tudo que
   * é "hoje" e "já passou" precisa ser calculado aqui, não no relógio da máquina.
   */
  timezone: string;
  contact: {
    instagram: string;
    /** Número em formato internacional, só dígitos: 5511900000000. */
    whatsapp: string;
    email: string;
  };
  /** Formas de pagamento aceitas, na ordem em que aparecem no modal. */
  payments: PaymentMethod[];
  services: Service[];
  units: Unit[];
  barbers: Barber[];
  gallery: GalleryItem[];
  testimonials: Testimonial[];
};

/** `onsite` = pagar na hora, na unidade. Os demais passam pelo checkout. */
export type PaymentMethod = "pix" | "debit" | "credit" | "onsite";
export type OnlinePaymentMethod = Exclude<PaymentMethod, "onsite">;

export type PaymentStatus = "pending" | "approved";

/** Intenção de pagamento — mesmo formato que um PSP devolveria. */
export type PaymentIntent = {
  id: string;
  method: OnlinePaymentMethod;
  status: PaymentStatus;
  /** Valor em centavos. */
  amount: number;
  /** Só para Pix: código copia e cola. */
  pixCode: string | null;
  /** Quanto o protótipo demora para "aprovar" — alimenta a barra de progresso. */
  expectedDelayMs: number;
};

/** Uma opção de horário devolvida pela API de disponibilidade. */
export type Slot = {
  time: string;
  available: boolean;
};

export type BookingPayload = {
  unitId: string;
  serviceId: string;
  /** `null` = sem preferência de profissional. */
  barberId: string | null;
  /** Data ISO (YYYY-MM-DD). */
  date: string;
  time: string;
  name: string;
  phone: string;
  paymentMethod: PaymentMethod;
};

export type BookingConfirmation = {
  id: string;
  status: "confirmed";
};

/* ---------- Agenda (dashboard) ---------- */

export type AppointmentStatus = "confirmed" | "completed" | "cancelled";
export type PaymentState = "pending" | "paid" | "onsite";

export type Appointment = {
  id: string;
  /** ISO completo de quando o agendamento foi criado. */
  createdAt: string;
  unitId: string;
  serviceId: string;
  /** `null` = sem preferência de profissional. */
  barberId: string | null;
  /** Data ISO (YYYY-MM-DD). */
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  paymentMethod: PaymentMethod;
  paymentState: PaymentState;
  /** Valor do serviço em centavos, congelado no momento do agendamento. */
  amount: number;
  status: AppointmentStatus;
  paymentIntentId: string | null;
};

/** O que o painel e o checkout realmente alteram num agendamento. */
export type AppointmentPatch = Partial<
  Pick<Appointment, "status" | "paymentState" | "date" | "time" | "paymentIntentId">
>;

/* ---------- Equipe (acesso ao dashboard) ---------- */

export type StaffRole = "admin" | "barber";

export type StaffUser = {
  id: string;
  username: string;
  name: string;
  role: StaffRole;
  /** Barbeiro correspondente em `brand.barbers` — `null` para a administração. */
  barberId: string | null;
};
