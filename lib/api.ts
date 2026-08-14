import type {
  BookingConfirmation,
  BookingPayload,
  OnlinePaymentMethod,
  PaymentIntent,
  Slot,
} from "@/lib/types";

/** Horários de uma unidade + profissional em um dia. */
export async function fetchAvailability(
  params: { unitId: string; barberId: string | null; date: string },
  signal?: AbortSignal,
): Promise<Slot[]> {
  const query = new URLSearchParams({ unitId: params.unitId, date: params.date });
  if (params.barberId) query.set("barberId", params.barberId);

  const response = await fetch(`/api/availability?${query}`, { signal });
  if (!response.ok) throw new Error("availability_failed");

  const data = (await response.json()) as { slots: Slot[] };
  return data.slots;
}

/** Envia o agendamento. Lança em qualquer resposta que não seja 2xx. */
export async function createBooking(
  payload: BookingPayload,
): Promise<BookingConfirmation> {
  const response = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("booking_failed");

  return (await response.json()) as BookingConfirmation;
}

/** Abre a intenção de pagamento do agendamento recém-criado. */
export async function createPayment(params: {
  bookingId: string;
  serviceId: string;
  method: OnlinePaymentMethod;
}): Promise<PaymentIntent> {
  const response = await fetch("/api/payments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!response.ok) throw new Error("payment_failed");

  return (await response.json()) as PaymentIntent;
}

/** Consulta o status até sair de `pending`. */
export async function fetchPayment(
  id: string,
  signal?: AbortSignal,
): Promise<PaymentIntent> {
  const response = await fetch(`/api/payments/${encodeURIComponent(id)}`, { signal });
  if (!response.ok) throw new Error("payment_status_failed");

  return (await response.json()) as PaymentIntent;
}
