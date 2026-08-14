import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { seedAppointments } from "@/lib/seed";

/**
 * Conexão com o Postgres (Neon, provisionado pelo Vercel Marketplace).
 *
 * A inicialização é preguiçosa de propósito: `neon()` estoura se
 * `DATABASE_URL` não existir, e o `next build` avalia o topo dos módulos.
 */

let client: NeonQueryFunction<false, false> | null = null;

export function sql() {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        "DATABASE_URL não definida. Provisione o Postgres (vercel integration add neon) e rode `vercel env pull`.",
      );
    }
    client = neon(url);
  }
  return client;
}

/**
 * Cria a tabela na primeira consulta da instância e, se a base estiver vazia,
 * semeia o histórico de demonstração. Os ids do seed são fixos (`seed-N`), então
 * duas instâncias semeando ao mesmo tempo não duplicam nada.
 *
 * Numa operação real, prefira migrações versionadas (Drizzle/Prisma) a este
 * `create table if not exists`.
 */
let ready: Promise<void> | null = null;

export function ensureSchema() {
  if (!ready) ready = initialize();
  return ready;
}

async function initialize() {
  const db = sql();

  await db`
    create table if not exists appointments (
      id text primary key,
      created_at timestamptz not null default now(),
      unit_id text not null,
      service_id text not null,
      barber_id text,
      appointment_date text not null,
      appointment_time text not null,
      customer_name text not null,
      customer_phone text not null,
      payment_method text not null,
      payment_state text not null,
      amount integer not null,
      status text not null,
      payment_intent_id text
    )
  `;
  await db`
    create index if not exists appointments_unit_date_idx
      on appointments (unit_id, appointment_date)
  `;
  await db`
    create index if not exists appointments_intent_idx
      on appointments (payment_intent_id)
  `;

  if (process.env.SEED_DEMO_DATA === "false") return;

  const rows = (await db`select count(*)::int as total from appointments`) as {
    total: number;
  }[];
  if (rows[0]?.total > 0) return;

  const seed = seedAppointments();
  await db`
    insert into appointments (
      id, created_at, unit_id, service_id, barber_id, appointment_date,
      appointment_time, customer_name, customer_phone, payment_method,
      payment_state, amount, status, payment_intent_id
    )
    select * from unnest(
      ${seed.map((item) => item.id)}::text[],
      ${seed.map((item) => item.createdAt)}::timestamptz[],
      ${seed.map((item) => item.unitId)}::text[],
      ${seed.map((item) => item.serviceId)}::text[],
      ${seed.map((item) => item.barberId)}::text[],
      ${seed.map((item) => item.date)}::text[],
      ${seed.map((item) => item.time)}::text[],
      ${seed.map((item) => item.customerName)}::text[],
      ${seed.map((item) => item.customerPhone)}::text[],
      ${seed.map((item) => item.paymentMethod)}::text[],
      ${seed.map((item) => item.paymentState)}::text[],
      ${seed.map((item) => item.amount)}::int[],
      ${seed.map((item) => item.status)}::text[],
      ${seed.map(() => null)}::text[]
    )
    on conflict (id) do nothing
  `;
}
