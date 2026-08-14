import { brand } from "@/config/brand";

/**
 * Relógio da barbearia.
 *
 * O servidor da Vercel roda em UTC: usar `new Date().getDate()` lá faria a
 * agenda virar o dia às 21h e esconder horário que ainda não passou. Tudo que
 * é "hoje" e "agora" no servidor sai daqui, no fuso de `brand.timezone`.
 */

const formatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: brand.timezone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function parts(instant: Date) {
  const found = Object.fromEntries(
    formatter.formatToParts(instant).map((part) => [part.type, part.value]),
  );
  return {
    date: `${found.year}-${found.month}-${found.day}`,
    minutes: Number(found.hour) * 60 + Number(found.minute),
  };
}

/** Data de hoje na barbearia, em ISO (YYYY-MM-DD). */
export function todayIso(instant = new Date()) {
  return parts(instant).date;
}

/** Minutos desde a meia-noite na barbearia — compara com "09:45". */
export function minutesNow(instant = new Date()) {
  return parts(instant).minutes;
}

/** Mês corrente na barbearia, em ISO (YYYY-MM). */
export function currentMonth(instant = new Date()) {
  return todayIso(instant).slice(0, 7);
}
