import * as fileStore from "@/lib/store/file";
import * as postgresStore from "@/lib/store/postgres";
import type { Appointment, AppointmentPatch } from "@/lib/types";

/**
 * Porta de entrada única da agenda. O resto do app só conhece estas funções —
 * trocar de banco é trocar a implementação escolhida aqui.
 *
 * - Com `DATABASE_URL` → Postgres (Neon). É o caminho de produção.
 * - Sem `DATABASE_URL`, fora de produção → arquivo JSON em `.data/`, para
 *   `npm run dev` funcionar sem provisionar nada.
 * - Sem `DATABASE_URL` **em produção** → erro na cara, de propósito: gravar em
 *   disco efêmero na Vercel perderia agendamento de cliente em silêncio.
 */
function backend() {
  if (process.env.DATABASE_URL) return postgresStore;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "DATABASE_URL ausente em produção. Provisione o Postgres (vercel integration add neon) — a agenda não pode viver em disco efêmero.",
    );
  }
  return fileStore;
}

export function listAppointments(): Promise<Appointment[]> {
  return backend().listAppointments();
}

export function getAppointment(id: string): Promise<Appointment | null> {
  return backend().getAppointment(id);
}

export function createAppointment(
  data: Omit<Appointment, "id" | "createdAt">,
): Promise<Appointment> {
  return backend().createAppointment(data);
}

export function updateAppointment(
  id: string,
  patch: AppointmentPatch,
): Promise<Appointment | null> {
  return backend().updateAppointment(id, patch);
}

/** Marca como pago o agendamento ligado a uma intenção de pagamento aprovada. */
export function markPaidByIntent(intentId: string): Promise<Appointment | null> {
  return backend().markPaidByIntent(intentId);
}

/** Agendamentos que ocupam a agenda de um dia (cancelados liberam o horário). */
export function activeAppointmentsOn(
  unitId: string,
  date: string,
): Promise<Appointment[]> {
  return backend().activeAppointmentsOn(unitId, date);
}
