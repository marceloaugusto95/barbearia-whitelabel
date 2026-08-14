export type DayOption = {
  /** YYYY-MM-DD no fuso local — chave usada na API de disponibilidade. */
  iso: string;
  /** "Hoje" no primeiro dia, senão o dia da semana abreviado. */
  weekday: string;
  /** Dia do mês com dois dígitos. */
  day: string;
  /** Data por extenso em pt-BR, ex.: "15 de agosto". */
  full: string;
};

/** ISO local (sem o deslocamento de fuso que `toISOString()` introduz). */
export function toIsoDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** "2026-08-15" → "15 de agosto". */
export function formatLongDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
  });
}

/** "2026-08-20" → "qui · 20 de agosto". */
export function formatWeekdayDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const weekday = date
    .toLocaleDateString("pt-BR", { weekday: "short" })
    .replace(".", "");
  return `${weekday} · ${formatLongDate(iso)}`;
}

/**
 * Faixa de dias a partir de hoje para a régua horizontal do passo 3.
 * Só roda no cliente (o modal só existe depois de uma interação),
 * então não há risco de divergência entre servidor e navegador.
 */
export function nextDays(count: number, todayLabel: string, from = new Date()): DayOption[] {
  const days: DayOption[] = [];
  for (let i = 0; i < count; i++) {
    const date = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
    days.push({
      iso: toIsoDate(date),
      weekday:
        i === 0
          ? todayLabel
          : date.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""),
      day: String(date.getDate()).padStart(2, "0"),
      full: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" }),
    });
  }
  return days;
}
