import { NextResponse } from "next/server";
import { getAvailability } from "@/lib/availability";

/**
 * GET /api/availability?unitId=…&date=YYYY-MM-DD&barberId=…
 * Ponto de troca para a agenda real do cliente.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const unitId = params.get("unitId");
  const date = params.get("date");
  const barberId = params.get("barberId");

  if (!unitId || !date) {
    return NextResponse.json(
      { error: "Informe unitId e date." },
      { status: 400 },
    );
  }

  const slots = await getAvailability({ unitId, date, barberId });
  return NextResponse.json({ slots });
}
