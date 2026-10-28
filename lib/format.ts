import { TIME_ZONE } from "@/lib/schedule";

const euro = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** 1650 → "16,50 €" */
export const formatPrice = (cents: number | null | undefined) => (cents == null ? null : euro.format(cents / 100));

/** "16,50" | "16.5" | "16,50 €" → 1650. Devuelve null si está vacío o no es válido. */
export function parsePriceToCents(input: string | null | undefined): number | null {
  if (!input) return null;
  const normalized = input.replace(/[^\d,.]/g, "").replace(",", ".");
  if (!normalized) return null;
  const value = Number(normalized);
  return Number.isFinite(value) && value >= 0 ? Math.round(value * 100) : null;
}

/** 1650 → "16,50" (para inputs del panel) */
export const centsToInput = (cents: number | null | undefined) =>
  cents == null ? "" : (cents / 100).toFixed(2).replace(".", ",");

/** Fecha de hoy en Madrid, YYYY-MM-DD */
export function todayInMadrid(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(date);
}

/** "2026-11-14" → partes legibles en español (sin desfases de zona horaria). */
export function formatEventDate(isoDate: string) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, 12));
  const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("es-ES", { timeZone: "UTC", ...opts }).format(date);
  return {
    day: String(d).padStart(2, "0"),
    month: String(m).padStart(2, "0"),
    monthName: fmt({ month: "long" }),
    monthShort: fmt({ month: "short" }).replace(".", ""),
    weekday: fmt({ weekday: "long" }),
    year: y,
    long: fmt({ weekday: "long", day: "numeric", month: "long" }),
  };
}
