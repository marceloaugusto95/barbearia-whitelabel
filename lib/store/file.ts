import { promises as fs } from "node:fs";
import path from "node:path";
import { seedAppointments } from "@/lib/seed";
import type { Appointment, AppointmentPatch } from "@/lib/types";

/**
 * Agenda em arquivo JSON (`.data/appointments.json`).
 *
 * É o modo de desenvolvimento sem banco: `npm run dev` funciona sem
 * `DATABASE_URL`, sem provisionar nada. **Nunca é usado em produção** — quem
 * decide é `lib/store.ts`, que exige Postgres lá.
 */

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "appointments.json");
const SEED_ENABLED = process.env.SEED_DEMO_DATA !== "false";

/** Fila para não perder escrita concorrente no read-modify-write. */
let queue: Promise<unknown> = Promise.resolve();

function serialize<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.catch(() => undefined);
  return run;
}

async function readFile(): Promise<Appointment[]> {
  try {
    return JSON.parse(await fs.readFile(DATA_FILE, "utf8")) as Appointment[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    const initial = SEED_ENABLED ? seedAppointments() : [];
    await writeFile(initial);
    return initial;
  }
}

async function writeFile(appointments: Appointment[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(appointments, null, 2), "utf8");
}

export function listAppointments(): Promise<Appointment[]> {
  return serialize(readFile);
}

export async function getAppointment(id: string): Promise<Appointment | null> {
  const all = await listAppointments();
  return all.find((appointment) => appointment.id === id) ?? null;
}

export function createAppointment(
  data: Omit<Appointment, "id" | "createdAt">,
): Promise<Appointment> {
  return serialize(async () => {
    const all = await readFile();
    const appointment: Appointment = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    await writeFile([...all, appointment]);
    return appointment;
  });
}

export function updateAppointment(
  id: string,
  patch: AppointmentPatch,
): Promise<Appointment | null> {
  return serialize(async () => {
    const all = await readFile();
    const index = all.findIndex((appointment) => appointment.id === id);
    if (index === -1) return null;

    const updated = { ...all[index], ...patch } as Appointment;
    const next = [...all];
    next[index] = updated;
    await writeFile(next);
    return updated;
  });
}

/** Marca como pago o agendamento ligado a uma intenção de pagamento aprovada. */
export function markPaidByIntent(intentId: string): Promise<Appointment | null> {
  return serialize(async () => {
    const all = await readFile();
    const index = all.findIndex(
      (appointment) => appointment.paymentIntentId === intentId,
    );
    if (index === -1) return null;
    if (all[index].paymentState === "paid") return all[index];

    const next = [...all];
    next[index] = { ...all[index], paymentState: "paid" };
    await writeFile(next);
    return next[index];
  });
}

/** Agendamentos que ocupam a agenda de um dia (cancelados liberam o horário). */
export async function activeAppointmentsOn(
  unitId: string,
  date: string,
): Promise<Appointment[]> {
  const all = await listAppointments();
  return all.filter(
    (appointment) =>
      appointment.unitId === unitId &&
      appointment.date === date &&
      appointment.status !== "cancelled",
  );
}
