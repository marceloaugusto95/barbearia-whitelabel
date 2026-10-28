import { brand } from "@/config/brand";
import type { Appointment } from "@/lib/types";

/** Quantos atendimentos cabem no mesmo horário de uma unidade. */
export function slotCapacity() {
  return Math.max(brand.barbers.length, 1);
}

/**
 * A regra de ocupação de um horário — a mesma na grade e na gravação:
 * - cabe enquanto houver menos atendimentos que profissionais;
 * - profissional escolhido → ele não pode já ter atendimento nesse horário.
 *
 * `sameSlot` são os agendamentos ativos daquela unidade, dia e horário.
 * O Postgres repete esta regra em SQL (`lib/store/postgres.ts`).
 */
export function hasRoom(
  sameSlot: Appointment[],
  barberId: string | null,
  capacity = slotCapacity(),
) {
  if (sameSlot.length >= capacity) return false;
  return barberId === null || !sameSlot.some((appointment) => appointment.barberId === barberId);
}

/** Agendamento que ocupa a agenda (cancelados liberam o horário). */
export function isActive(appointment: Appointment) {
  return appointment.status !== "cancelled";
}
