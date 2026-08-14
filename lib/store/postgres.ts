import { ensureSchema, sql } from "@/lib/db";
import type { Appointment, AppointmentPatch } from "@/lib/types";

/** Agenda em Postgres (Neon) — o modo de produção. */

type Row = {
  id: string;
  created_at: Date | string;
  unit_id: string;
  service_id: string;
  barber_id: string | null;
  appointment_date: string;
  appointment_time: string;
  customer_name: string;
  customer_phone: string;
  payment_method: Appointment["paymentMethod"];
  payment_state: Appointment["paymentState"];
  amount: number;
  status: Appointment["status"];
  payment_intent_id: string | null;
};

function toAppointment(row: Row): Appointment {
  return {
    id: row.id,
    createdAt:
      row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
    unitId: row.unit_id,
    serviceId: row.service_id,
    barberId: row.barber_id,
    date: row.appointment_date,
    time: row.appointment_time,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    paymentMethod: row.payment_method,
    paymentState: row.payment_state,
    amount: row.amount,
    status: row.status,
    paymentIntentId: row.payment_intent_id,
  };
}

export async function listAppointments(): Promise<Appointment[]> {
  await ensureSchema();
  const rows = (await sql()`
    select * from appointments
    order by appointment_date desc, appointment_time desc
  `) as Row[];
  return rows.map(toAppointment);
}

export async function getAppointment(id: string): Promise<Appointment | null> {
  await ensureSchema();
  const rows = (await sql()`select * from appointments where id = ${id}`) as Row[];
  return rows[0] ? toAppointment(rows[0]) : null;
}

export async function createAppointment(
  data: Omit<Appointment, "id" | "createdAt">,
): Promise<Appointment> {
  await ensureSchema();
  const rows = (await sql()`
    insert into appointments (
      id, unit_id, service_id, barber_id, appointment_date, appointment_time,
      customer_name, customer_phone, payment_method, payment_state, amount,
      status, payment_intent_id
    ) values (
      ${crypto.randomUUID()}, ${data.unitId}, ${data.serviceId}, ${data.barberId},
      ${data.date}, ${data.time}, ${data.customerName}, ${data.customerPhone},
      ${data.paymentMethod}, ${data.paymentState}, ${data.amount},
      ${data.status}, ${data.paymentIntentId}
    )
    returning *
  `) as Row[];
  return toAppointment(rows[0]);
}

export async function updateAppointment(
  id: string,
  patch: AppointmentPatch,
): Promise<Appointment | null> {
  await ensureSchema();
  const rows = (await sql()`
    update appointments set
      status = coalesce(${patch.status ?? null}, status),
      payment_state = coalesce(${patch.paymentState ?? null}, payment_state),
      appointment_date = coalesce(${patch.date ?? null}, appointment_date),
      appointment_time = coalesce(${patch.time ?? null}, appointment_time),
      payment_intent_id = coalesce(${patch.paymentIntentId ?? null}, payment_intent_id)
    where id = ${id}
    returning *
  `) as Row[];
  return rows[0] ? toAppointment(rows[0]) : null;
}

/** Marca como pago o agendamento ligado a uma intenção de pagamento aprovada. */
export async function markPaidByIntent(intentId: string): Promise<Appointment | null> {
  await ensureSchema();
  const rows = (await sql()`
    update appointments set payment_state = 'paid'
    where payment_intent_id = ${intentId} and payment_state <> 'paid'
    returning *
  `) as Row[];
  return rows[0] ? toAppointment(rows[0]) : null;
}

/** Agendamentos que ocupam a agenda de um dia (cancelados liberam o horário). */
export async function activeAppointmentsOn(
  unitId: string,
  date: string,
): Promise<Appointment[]> {
  await ensureSchema();
  const rows = (await sql()`
    select * from appointments
    where unit_id = ${unitId}
      and appointment_date = ${date}
      and status <> 'cancelled'
  `) as Row[];
  return rows.map(toAppointment);
}
