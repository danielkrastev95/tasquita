import type { Closure, OpeningHours, TimeRange } from "@/lib/settings";
import { WEEKDAYS, WEEKDAY_LABELS, type Weekday } from "@/lib/weekdays";

export const TIME_ZONE = "Europe/Madrid";

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** "09:00" → "9:00" */
export const formatTime = (hhmm: string) => hhmm.replace(/^0(\d)/, "$1");

export const formatRange = (r: TimeRange) => `${formatTime(r.open)} – ${formatTime(r.close)}`;

export const formatDayHours = (ranges: TimeRange[]) =>
  ranges.length === 0 ? "Cerrado" : ranges.map(formatRange).join(" · ");

/** Hora local de Madrid: día de la semana, minutos desde medianoche y fecha YYYY-MM-DD. */
export function madridNow(date = new Date()): { weekday: Weekday; minutes: number; date: string } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const weekday = get("weekday").toLowerCase().slice(0, 3) as Weekday;
  return {
    weekday,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
    date: `${get("year")}-${get("month")}-${get("day")}`,
  };
}

/** Suma días a una fecha YYYY-MM-DD (aritmética de calendario, sin zonas horarias). */
export function addDays(isoDate: string, days: number) {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

/** Cierre puntual que cubre esa fecha, si lo hay. */
export const closureOn = (isoDate: string, closures: Closure[]) =>
  closures.find((c) => c.from <= isoDate && isoDate <= c.to) ?? null;

export type OpenStatus =
  | { open: true; closesAt: string }
  | {
      open: false;
      opensAt: string | null;
      opensDay: Weekday | null;
      /** Fecha de la próxima apertura (YYYY-MM-DD) */
      opensDate: string | null;
      /** Si hoy está cerrado por vacaciones/festivo */
      closure: Closure | null;
    };

/** ¿Está abierto ahora? Tiene en cuenta tramos que cruzan la medianoche y los cierres puntuales. */
export function getOpenStatus(hours: OpeningHours, date = new Date(), closures: Closure[] = []): OpenStatus {
  const { weekday, minutes, date: today } = madridNow(date);
  const idx = WEEKDAYS.indexOf(weekday);
  const prev = WEEKDAYS[(idx + 6) % 7];
  const closedToday = closureOn(today, closures);

  // Tramos de ayer que terminan hoy de madrugada (cuentan como servicio de ayer)
  if (!closureOn(addDays(today, -1), closures)) {
    for (const r of hours[prev]) {
      const open = toMinutes(r.open);
      const close = toMinutes(r.close);
      if (close <= open && minutes < close) return { open: true, closesAt: r.close };
    }
  }
  if (!closedToday) {
    for (const r of hours[weekday]) {
      const open = toMinutes(r.open);
      const close = toMinutes(r.close);
      if (close > open ? minutes >= open && minutes < close : minutes >= open) {
        return { open: true, closesAt: r.close };
      }
    }
  }

  // Próxima apertura (hasta 60 días vista, saltando cierres puntuales)
  for (let i = 0; i <= 60; i++) {
    const day = addDays(today, i);
    if (closureOn(day, closures)) continue;
    const wd = WEEKDAYS[(idx + i) % 7];
    const opens = hours[wd]
      .map((r) => r.open)
      .filter((o) => i > 0 || toMinutes(o) > minutes)
      .sort()[0];
    if (opens) return { open: false, opensAt: opens, opensDay: wd, opensDate: day, closure: closedToday };
  }
  return { open: false, opensAt: null, opensDay: null, opensDate: null, closure: closedToday };
}

/** Texto corto de estado: "Abierto · cierra a las 17:00" / "Cerrado · abre mañana a las 9:00". */
export function describeOpenStatus(status: OpenStatus, date = new Date()): string {
  if (status.open) return `Abierto · cierra a las ${formatTime(status.closesAt)}`;
  const prefix = status.closure?.note ? `Cerrado (${status.closure.note})` : "Cerrado";
  if (!status.opensAt || !status.opensDay || !status.opensDate) return prefix;

  const today = madridNow(date).date;
  const when =
    status.opensDate === today
      ? "hoy"
      : status.opensDate === addDays(today, 1)
        ? "mañana"
        : status.opensDate <= addDays(today, 6)
          ? `el ${WEEKDAY_LABELS[status.opensDay].toLowerCase()}`
          : `el ${formatShortDate(status.opensDate)}`;
  return `${prefix} · abre ${when} a las ${formatTime(status.opensAt)}`;
}

/** "2026-08-16" → "16 de agosto" */
export function formatShortDate(isoDate: string) {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("es-ES", { timeZone: "UTC", day: "numeric", month: "long" }).format(new Date(Date.UTC(y, m - 1, d, 12)));
}

/** Cierres puntuales vigentes o futuros (para mostrarlos en la web), ordenados. */
export const upcomingClosures = (closures: Closure[], date = new Date()) => {
  const today = madridNow(date).date;
  return closures.filter((c) => c.to >= today).sort((a, b) => a.from.localeCompare(b.from));
};

/** "Del 1 al 15 de agosto" / "El 12 de octubre" */
export function describeClosure(c: Closure) {
  if (c.from === c.to) return `El ${formatShortDate(c.from)}`;
  const [fy, fm] = c.from.split("-");
  const [ty, tm] = c.to.split("-");
  const fromDay = Number(c.from.slice(8));
  return fy === ty && fm === tm ? `Del ${fromDay} al ${formatShortDate(c.to)}` : `Del ${formatShortDate(c.from)} al ${formatShortDate(c.to)}`;
}

/** Agrupa días consecutivos con el mismo horario: [{ label: "Martes – Miércoles", hours: "9:00 – 17:00" }, …] */
export function groupOpeningHours(hours: OpeningHours): { label: string; hours: string; closed: boolean; days: Weekday[] }[] {
  const groups: { days: Weekday[]; key: string }[] = [];
  for (const d of WEEKDAYS) {
    const key = JSON.stringify(hours[d]);
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.days.push(d);
    else groups.push({ days: [d], key });
  }
  return groups.map(({ days }) => {
    const first = WEEKDAY_LABELS[days[0]];
    const lastLabel = WEEKDAY_LABELS[days[days.length - 1]];
    const label = days.length === 1 ? first : days.length === 2 ? `${first} y ${lastLabel}` : `${first} – ${lastLabel}`;
    return { label, hours: formatDayHours(hours[days[0]]), closed: hours[days[0]].length === 0, days };
  });
}

/** "Martes a viernes" / "Martes, jueves y sábado" a partir de una lista de días. */
export function describeDays(days: readonly Weekday[]) {
  const sorted = WEEKDAYS.filter((d) => days.includes(d));
  if (sorted.length === 0) return "";
  if (sorted.length === 7) return "Todos los días";
  const idx = sorted.map((d) => WEEKDAYS.indexOf(d));
  const consecutive = idx.every((v, i) => i === 0 || v === idx[i - 1] + 1);
  const label = (d: Weekday) => WEEKDAY_LABELS[d].toLowerCase();
  const text =
    consecutive && sorted.length > 2
      ? `${label(sorted[0])} a ${label(sorted[sorted.length - 1])}`
      : sorted.length === 1
        ? label(sorted[0])
        : `${sorted.slice(0, -1).map(label).join(", ")} y ${label(sorted[sorted.length - 1])}`;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const SCHEMA_DAY: Record<Weekday, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

/** openingHoursSpecification para JSON-LD (schema.org/Restaurant). */
export function toSchemaOrgHours(hours: OpeningHours) {
  return WEEKDAYS.flatMap((d) =>
    hours[d].map((r) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${SCHEMA_DAY[d]}`,
      opens: r.open,
      closes: r.close,
    })),
  );
}

/** Cierres puntuales para JSON-LD (specialOpeningHoursSpecification: cerrado = opens/closes 00:00). */
export function toSchemaOrgClosures(closures: Closure[]) {
  return closures.map((c) => ({
    "@type": "OpeningHoursSpecification",
    validFrom: c.from,
    validThrough: c.to,
    opens: "00:00",
    closes: "00:00",
  }));
}
