import { NextResponse } from "next/server";
import { readIntent } from "@/lib/payments";
import { markPaidByIntent } from "@/lib/store";

/**
 * GET /api/payments/:id — status da intenção.
 * Em produção, prefira webhook do PSP em vez do polling do cliente.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const intent = readIntent(id);

  if (!intent) {
    return NextResponse.json({ error: "Pagamento não encontrado." }, { status: 404 });
  }

  // No lugar do webhook do PSP: aprovou, o agendamento vira pago.
  if (intent.status === "approved") {
    await markPaidByIntent(intent.id);
  }

  return NextResponse.json(intent);
}
