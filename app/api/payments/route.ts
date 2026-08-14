import { NextResponse } from "next/server";
import { brand } from "@/config/brand";
import { createIntent } from "@/lib/payments";
import { getAppointment, updateAppointment } from "@/lib/store";
import type { OnlinePaymentMethod } from "@/lib/types";

const ONLINE_METHODS: OnlinePaymentMethod[] = ["pix", "debit", "credit"];

/**
 * POST /api/payments — abre a intenção de pagamento do agendamento.
 * O valor vem do catálogo no servidor, nunca do cliente.
 */
export async function POST(request: Request) {
  let body: { bookingId?: string; serviceId?: string; method?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }

  const { bookingId, serviceId, method } = body;

  if (!bookingId || !serviceId || !method) {
    return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
  }
  if (!ONLINE_METHODS.includes(method as OnlinePaymentMethod)) {
    return NextResponse.json({ error: "Forma de pagamento inválida." }, { status: 400 });
  }
  if (!brand.payments.includes(method as OnlinePaymentMethod)) {
    return NextResponse.json({ error: "Forma de pagamento não aceita." }, { status: 400 });
  }

  const service = brand.services.find((item) => item.id === serviceId);
  if (!service) {
    return NextResponse.json({ error: "Serviço inexistente." }, { status: 400 });
  }
  if (!brand.showPrices) {
    return NextResponse.json(
      { error: "Pagamento antecipado indisponível." },
      { status: 409 },
    );
  }

  const appointment = await getAppointment(bookingId);
  if (!appointment) {
    return NextResponse.json({ error: "Agendamento não encontrado." }, { status: 404 });
  }

  const intent = createIntent({
    method: method as OnlinePaymentMethod,
    amount: service.price * 100,
  });

  // Guarda o vínculo para o status do PSP poder liquidar o agendamento.
  await updateAppointment(appointment.id, { paymentIntentId: intent.id });

  return NextResponse.json(intent);
}
