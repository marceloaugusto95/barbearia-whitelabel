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

/*
 * Proteção contra horário duplicado, em duas camadas:
 *
 * 1. Cada gravação roda numa transação que primeiro pega um advisory lock do
 *    horário (unidade + dia + horário). Quem chega junto espera o outro
 *    terminar; em READ COMMITTED a instrução seguinte já enxerga o que ele
 *    gravou. Daí o insert/update só acontece se a regra de `hasRoom`
 *    (`lib/occupancy.ts`), repetida aqui em SQL, ainda for verdadeira — é isso
 *    que cobre o "sem preferência" (limite = nº de profissionais).
 * 2. O índice único `appointments_barber_slot_uq` (`lib/db.ts`) impede, no
 *    próprio banco, o mesmo profissional duas vezes no mesmo horário, mesmo
 *    que algum caminho futuro esqueça o lock.
 */

/** Mesma chave nos dois caminhos, senão um não espera o outro. */
function slotLock(unitId: string, date: string, time: string) {
  return `${unitId}|${date}|${time}`;
}

/** Violação de unicidade (23505) = a vaga foi ocupada. */
function isSlotConflict(error: unknown) {
  return (error as { code?: string } | null)?.code === "23505";
}

export async function createAppointment(
  data: Omit<Appointment, "id" | "createdAt">,
  capacity: number,
): Promise<Appointment | null> {
  await ensureSchema();
  const db = sql();
  try {
    const [, rows] = (await db.transaction(
      [
        db`select pg_advisory_xact_lock(hashtextextended(${slotLock(data.unitId, data.date, data.time)}, 0))`,
        db`
          insert into appointments (
            id, unit_id, service_id, barber_id, appointment_date, appointment_time,
            customer_name, customer_phone, payment_method, payment_state, amount,
            status, payment_intent_id
          )
          select
            ${crypto.randomUUID()}, ${data.unitId}, ${data.serviceId}, ${data.barberId}::text,
            ${data.date}, ${data.time}, ${data.customerName}, ${data.customerPhone},
            ${data.paymentMethod}, ${data.paymentState}, ${data.amount}::int,
            ${data.status}, ${data.paymentIntentId}::text
          where (
            select count(*) from appointments
            where unit_id = ${data.unitId}
              and appointment_date = ${data.date}
              and appointment_time = ${data.time}
              and status <> 'cancelled'
          ) < ${capacity}::int
          and (
            ${data.barberId}::text is null or not exists (
              select 1 from appointments
              where unit_id = ${data.unitId}
                and appointment_date = ${data.date}
                and appointment_time = ${data.time}
                and status <> 'cancelled'
                and barber_id = ${data.barberId}::text
            )
          )
          returning *
        `,
      ],
      { isolationLevel: "ReadCommitted" },
    )) as [unknown, Row[]];
    return rows[0] ? toAppointment(rows[0]) : null;
  } catch (error) {
    if (isSlotConflict(error)) return null;
    throw error;
  }
}

export async function rescheduleAppointment(
  id: string,
  date: string,
  time: string,
  capacity: number,
): Promise<Appointment | null> {
  await ensureSchema();
  const db = sql();
  try {
    const [, rows] = (await db.transaction(
      [
        // A unidade vem da própria linha; a chave fica igual à do createAppointment.
        db`
          select pg_advisory_xact_lock(
            hashtextextended(unit_id || '|' || ${date} || '|' || ${time}, 0)
          )
          from appointments where id = ${id}
        `,
        db`
          update appointments as target set
            appointment_date = ${date},
            appointment_time = ${time},
            status = 'confirmed'
          where target.id = ${id}
            and (
              select count(*) from appointments other
              where other.id <> target.id
                and other.unit_id = target.unit_id
                and other.appointment_date = ${date}
                and other.appointment_time = ${time}
                and other.status <> 'cancelled'
            ) < ${capacity}::int
            and (
              target.barber_id is null or not exists (
                select 1 from appointments other
                where other.id <> target.id
                  and other.unit_id = target.unit_id
                  and other.appointment_date = ${date}
                  and other.appointment_time = ${time}
                  and other.status <> 'cancelled'
                  and other.barber_id = target.barber_id
              )
            )
          returning *
        `,
      ],
      { isolationLevel: "ReadCommitted" },
    )) as [unknown, Row[]];
    return rows[0] ? toAppointment(rows[0]) : null;
  } catch (error) {
    if (isSlotConflict(error)) return null;
    throw error;
  }
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
