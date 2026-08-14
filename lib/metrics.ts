import { brand } from "@/config/brand";
import type { Appointment } from "@/lib/types";

/**
 * Indicadores do dashboard.
 * Faturamento e "clientes atendidos" contam **só atendimentos concluídos** —
 * agendamento futuro ainda não é receita, e cancelado não conta.
 */

export type Kpis = {
  attended: { total: number; today: number; month: number };
  revenue: { total: number; today: number; month: number };
  /** Ticket médio do mês, em centavos. */
  ticket: number;
  /** Cancelamentos no mês. */
  cancelled: number;
  /** Agendamentos confirmados de hoje em diante. */
  upcoming: number;
};

export type BarberPerformance = {
  id: string;
  name: string;
  attended: number;
  revenue: number;
  ticket: number;
  /** Fatia do faturamento do período, de 0 a 1 — alimenta a barra. */
  share: number;
};

const isCompleted = (appointment: Appointment) => appointment.status === "completed";
const sum = (appointments: Appointment[]) =>
  appointments.reduce((total, appointment) => total + appointment.amount, 0);

export function computeKpis(
  appointments: Appointment[],
  today: string,
  month: string,
): Kpis {
  const completed = appointments.filter(isCompleted);
  const completedToday = completed.filter((item) => item.date === today);
  const completedMonth = completed.filter((item) => item.date.startsWith(month));

  return {
    attended: {
      total: completed.length,
      today: completedToday.length,
      month: completedMonth.length,
    },
    revenue: {
      total: sum(completed),
      today: sum(completedToday),
      month: sum(completedMonth),
    },
    ticket: completedMonth.length
      ? Math.round(sum(completedMonth) / completedMonth.length)
      : 0,
    cancelled: appointments.filter(
      (item) => item.status === "cancelled" && item.date.startsWith(month),
    ).length,
    upcoming: appointments.filter(
      (item) => item.status === "confirmed" && item.date >= today,
    ).length,
  };
}

/** Faturamento por barbeiro no conjunto recebido (já filtrado por período). */
export function performanceByBarber(appointments: Appointment[]): BarberPerformance[] {
  const completed = appointments.filter(isCompleted);
  const total = sum(completed);

  const rows = brand.barbers.map((barber) => {
    const own = completed.filter((item) => item.barberId === barber.id);
    const revenue = sum(own);
    return {
      id: barber.id,
      name: barber.name,
      attended: own.length,
      revenue,
      ticket: own.length ? Math.round(revenue / own.length) : 0,
      share: total ? revenue / total : 0,
    };
  });

  // "Sem preferência" também fatura: entra como linha própria quando existe.
  const unassigned = completed.filter((item) => item.barberId === null);
  if (unassigned.length) {
    const revenue = sum(unassigned);
    rows.push({
      id: "sem-preferencia",
      name: "Sem preferência",
      attended: unassigned.length,
      revenue,
      ticket: Math.round(revenue / unassigned.length),
      share: total ? revenue / total : 0,
    });
  }

  return rows.sort((a, b) => b.revenue - a.revenue);
}
