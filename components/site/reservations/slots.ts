import { addDays, closureOn, formatShortDate, madridNow } from "@/lib/schedule";
import type { Closure, OpeningHours, TimeRange } from "@/lib/settings";
import { WEEKDAYS, WEEKDAY_LABELS, type Weekday } from "@/lib/weekdays";

/* Cálculo de días y franjas reservables (puro, sin React). */

const STEP = 30; // minutos entre franjas
const LAST_BEFORE_CLOSE = 60; // la última franja, una hora antes de cerrar
const MIN_NOTICE = 30; // para hoy, con al menos media hora de margen

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** 1290 → "21:30"; 1470 → "00:30" (madrugada del día siguiente). */
export const minutesToLabel = (total: number) => {
  const m = ((total % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};

export const weekdayOf = (isoDate: string): Weekday => {
  const [y, mo, d] = isoDate.split("-").map(Number);
  // getUTCDay: 0 = domingo
  return WEEKDAYS[(new Date(Date.UTC(y, mo - 1, d)).getUTCDay() + 6) % 7];
};

/** Franjas de 30 min dentro de los tramos del día. Los tramos que cruzan medianoche siguen pasadas las 24:00. */
export function slotsForRanges(ranges: TimeRange[], minMinutes = 0) {
  const slots: number[] = [];
  for (const r of ranges) {
    const open = toMinutes(r.open);
    let close = toMinutes(r.close);
    if (close <= open) close += 1440;
    const first = Math.ceil(open / STEP) * STEP;
    for (let t = first; t <= close - LAST_BEFORE_CLOSE; t += STEP) if (t >= minMinutes) slots.push(t);
  }
  return [...new Set(slots)].sort((a, b) => a - b);
}

export type DayOption = {
  date: string;
  weekday: Weekday;
  closed: boolean;
  /** Motivo si está cerrado ("Cerrado", nota del cierre puntual…) */
  reason: string | null;
  /** Etiqueta corta para el selector de días */
  short: string | null;
  slots: number[];
};

/** Estado reservable de una fecha concreta. */
export function dayOption(date: string, hours: OpeningHours, closures: Closure[], now = new Date()): DayOption {
  const weekday = weekdayOf(date);
  const current = madridNow(now);
  const closure = closureOn(date, closures);
  if (date < current.date) return { date, weekday, closed: true, reason: "Esa fecha ya ha pasado", short: "pasado", slots: [] };
  if (closure) return { date, weekday, closed: true, reason: closure.note ? `Cerrado: ${closure.note}` : "Cerrado ese día", short: "cerrado", slots: [] };
  const ranges = hours[weekday];
  if (ranges.length === 0) {
    const plural = WEEKDAY_LABELS[weekday].toLowerCase().replace(/(sábado|domingo)$/, "$1s");
    return { date, weekday, closed: true, reason: `Los ${plural} cerramos`, short: "cerrado", slots: [] };
  }
  const slots = slotsForRanges(ranges, date === current.date ? current.minutes + MIN_NOTICE : 0);
  if (slots.length === 0) return { date, weekday, closed: true, reason: "Para hoy ya no quedan horas: elige otro día", short: "sin horas", slots: [] };
  return { date, weekday, closed: false, reason: null, short: null, slots };
}

/** Próximos `count` días a partir de hoy (Madrid). */
export function upcomingDays(count: number, hours: OpeningHours, closures: Closure[], now = new Date()) {
  const today = madridNow(now).date;
  return Array.from({ length: count }, (_, i) => dayOption(addDays(today, i), hours, closures, now));
}

/** "jueves 14 de noviembre" */
export const longDate = (isoDate: string) => `${WEEKDAY_LABELS[weekdayOf(isoDate)].toLowerCase()} ${formatShortDate(isoDate)}`;
