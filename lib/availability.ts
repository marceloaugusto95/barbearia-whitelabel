import { brand } from "@/config/brand";
import { minutesNow, todayIso } from "@/lib/clock";
import { activeAppointmentsOn } from "@/lib/store";
import type { Slot } from "@/lib/types";

/**
 * Disponibilidade real: a grade da unidade menos o que já está agendado.
 *
 * Regras:
 * - profissional escolhido → o horário some se ele já tem atendimento;
 * - "sem preferência" → só some quando todos os profissionais estão ocupados;
 * - horário que já passou hoje não aparece como livre.
 */
export async function getAvailability(params: {
  unitId: string;
  barberId: string | null;
  date: string;
}): Promise<Slot[]> {
  const unit = brand.units.find((item) => item.id === params.unitId);
  if (!unit) return [];

  const booked = await activeAppointmentsOn(params.unitId, params.date);
  const capacity = Math.max(brand.barbers.length, 1);
  const isToday = params.date === todayIso();
  const now = minutesNow();

  return unit.slots.map((time) => {
    const atThisTime = booked.filter((appointment) => appointment.time === time);
    const full = atThisTime.length >= capacity;
    const barberBusy =
      params.barberId !== null &&
      atThisTime.some((appointment) => appointment.barberId === params.barberId);
    const past = isToday && toMinutes(time) <= now;

    return { time, available: !full && !barberBusy && !past };
  });
}

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/** Um horário específico ainda está livre? Usado ao agendar e ao reagendar. */
export async function isSlotAvailable(params: {
  unitId: string;
  barberId: string | null;
  date: string;
  time: string;
  /** Ignora o próprio agendamento ao reagendar. */
  ignoreAppointmentId?: string;
}): Promise<boolean> {
  const unit = brand.units.find((item) => item.id === params.unitId);
  if (!unit || !unit.slots.includes(params.time)) return false;

  const booked = (await activeAppointmentsOn(params.unitId, params.date)).filter(
    (appointment) =>
      appointment.id !== params.ignoreAppointmentId && appointment.time === params.time,
  );

  const capacity = Math.max(brand.barbers.length, 1);
  if (booked.length >= capacity) return false;

  return !(
    params.barberId !== null &&
    booked.some((appointment) => appointment.barberId === params.barberId)
  );
}
