import { NextResponse } from "next/server";
import { brand } from "@/config/brand";
import { isSlotAvailable } from "@/lib/availability";
import { createAppointment } from "@/lib/store";
import type { BookingPayload } from "@/lib/types";

/**
 * POST /api/bookings — grava o agendamento na agenda (`lib/store`), de onde o
 * dashboard lê. **Não envia WhatsApp**: plugue aqui o disparo da confirmação.
 */
export async function POST(request: Request) {
  let body: Partial<BookingPayload>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }

  const {
    unitId,
    serviceId,
    barberId = null,
    date,
    time,
    name,
    phone,
    paymentMethod,
  } = body;

  if (!unitId || !serviceId || !date || !time || !name || !phone || !paymentMethod) {
    return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
  }
  if (!brand.payments.includes(paymentMethod)) {
    return NextResponse.json(
      { error: "Forma de pagamento não aceita." },
      { status: 400 },
    );
  }
  if (!brand.units.some((u) => u.id === unitId)) {
    return NextResponse.json({ error: "Unidade inexistente." }, { status: 400 });
  }
  const service = brand.services.find((s) => s.id === serviceId);
  if (!service) {
    return NextResponse.json({ error: "Serviço inexistente." }, { status: 400 });
  }
  if (barberId && !brand.barbers.some((b) => b.id === barberId)) {
    return NextResponse.json({ error: "Profissional inexistente." }, { status: 400 });
  }
  if (name.trim().length < 2 || phone.trim().length < 6) {
    return NextResponse.json({ error: "Nome ou telefone inválido." }, { status: 400 });
  }

  if (!(await isSlotAvailable({ unitId, barberId, date, time }))) {
    return NextResponse.json(
      { error: "Este horário acabou de ser ocupado." },
      { status: 409 },
    );
  }

  const appointment = await createAppointment({
    unitId,
    serviceId,
    barberId,
    date,
    time,
    customerName: name.trim(),
    customerPhone: phone.trim(),
    paymentMethod,
    paymentState: paymentMethod === "onsite" ? "onsite" : "pending",
    amount: service.price * 100,
    status: "confirmed",
    paymentIntentId: null,
  });

  return NextResponse.json({ id: appointment.id, status: "confirmed" });
}
