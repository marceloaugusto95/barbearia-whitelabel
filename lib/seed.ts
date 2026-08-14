import { brand } from "@/config/brand";
import { toIsoDate } from "@/lib/dates";
import type { Appointment, PaymentMethod, PaymentState } from "@/lib/types";

/**
 * Histórico de demonstração para o dashboard não abrir vazio.
 * Gerado uma única vez, na primeira leitura da base, e determinístico.
 *
 * **Apague `.data/appointments.json` e desligue com `SEED_DEMO_DATA=false`
 * quando ligar a base real do cliente.**
 */

const FIRST_NAMES = [
  "Lucas", "Pedro", "Rafael", "Bruno", "Thiago", "Gustavo", "Felipe", "André",
  "Marcelo", "Vinícius", "Diego", "Caio", "Eduardo", "Henrique", "Leonardo",
  "Matheus", "Rodrigo", "Fábio", "Igor", "Danilo",
];

const LAST_NAMES = [
  "Almeida", "Barbosa", "Carvalho", "Duarte", "Esteves", "Ferreira", "Gomes",
  "Henriques", "Lima", "Martins", "Nogueira", "Oliveira", "Pereira", "Queiroz",
  "Ribeiro", "Santos", "Teixeira", "Vieira",
];

/** Gerador linear congruente — mesmo resultado em toda execução. */
function random(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
}

export function seedAppointments(today = new Date()): Appointment[] {
  const next = random(20260814);
  const pick = <T,>(list: readonly T[]): T =>
    list[Math.floor(next() * list.length)] as T;
  const between = (min: number, max: number) =>
    min + Math.floor(next() * (max - min + 1));

  const appointments: Appointment[] = [];
  const used = new Set<string>();

  const add = (params: {
    date: string;
    daysFromToday: number;
    status: Appointment["status"];
  }) => {
    const unit = pick(brand.units);
    const barber = pick(brand.barbers);
    const service = pick(brand.services);
    const time = pick(unit.slots);

    const key = `${unit.id}|${params.date}|${time}|${barber.id}`;
    if (used.has(key)) return;
    used.add(key);

    const paymentMethod = pick(brand.payments) as PaymentMethod;
    const paymentState: PaymentState =
      paymentMethod === "onsite"
        ? params.status === "completed"
          ? "paid"
          : "onsite"
        : "paid";

    const createdAt = new Date(today);
    createdAt.setDate(createdAt.getDate() + params.daysFromToday - between(1, 6));

    appointments.push({
      id: `seed-${appointments.length + 1}`,
      createdAt: createdAt.toISOString(),
      unitId: unit.id,
      serviceId: service.id,
      barberId: barber.id,
      date: params.date,
      time,
      customerName: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
      customerPhone: `(11) 9${between(1000, 9999)}-${between(1000, 9999)}`,
      paymentMethod,
      paymentState,
      amount: service.price * 100,
      status: params.status,
      paymentIntentId: null,
    });
  };

  // 60 dias de histórico atendido (domingo fechado).
  for (let offset = -60; offset < 0; offset++) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
    if (date.getDay() === 0) continue;

    const total = between(2, 6);
    for (let i = 0; i < total; i++) {
      // Um cancelamento a cada ~12 atendimentos.
      const status = next() < 0.08 ? "cancelled" : "completed";
      add({ date: toIsoDate(date), daysFromToday: offset, status });
    }
  }

  // Hoje e os próximos 7 dias, ainda por atender.
  for (let offset = 0; offset <= 7; offset++) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
    if (date.getDay() === 0) continue;

    const total = between(1, 4);
    for (let i = 0; i < total; i++) {
      add({ date: toIsoDate(date), daysFromToday: offset, status: "confirmed" });
    }
  }

  return appointments;
}
