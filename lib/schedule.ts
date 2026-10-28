import { WEEKDAYS, WEEKDAY_LABELS, type OpeningHours, type TimeRange, type Weekday } from "@/lib/settings";

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

/** Hora local de Madrid (día de la semana + minutos desde medianoche). */
export function madridNow(date = new Date()): { weekday: Weekday; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const weekday = get("weekday").toLowerCase().slice(0, 3) as Weekday;
  return { weekday, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

export type OpenStatus =
  | { open: true; closesAt: string }
  | { open: false; opensAt: string | null; opensDay: Weekday | null };

/** ¿Está abierto ahora? Tiene en cuenta tramos que cruzan la medianoche. */
export function getOpenStatus(hours: OpeningHours, date = new Date()): OpenStatus {
  const { weekday, minutes } = madridNow(date);
  const idx = WEEKDAYS.indexOf(weekday);
  const prev = WEEKDAYS[(idx + 6) % 7];

  // Tramos de ayer que terminan hoy de madrugada
  for (const r of hours[prev]) {
    const open = toMinutes(r.open);
    const close = toMinutes(r.close);
    if (close <= open && minutes < close) return { open: true, closesAt: r.close };
  }
  for (const r of hours[weekday]) {
    const open = toMinutes(r.open);
    const close = toMinutes(r.close);
    if (close > open ? minutes >= open && minutes < close : minutes >= open) {
      return { open: true, closesAt: r.close };
    }
  }

  // Próxima apertura (hoy más tarde o en los próximos 7 días)
  const laterToday = hours[weekday].map((r) => r.open).filter((o) => toMinutes(o) > minutes).sort()[0];
  if (laterToday) return { open: false, opensAt: laterToday, opensDay: weekday };
  for (let i = 1; i <= 7; i++) {
    const d = WEEKDAYS[(idx + i) % 7];
    const first = hours[d].map((r) => r.open).sort()[0];
    if (first) return { open: false, opensAt: first, opensDay: d };
  }
  return { open: false, opensAt: null, opensDay: null };
}

/** Texto corto de estado: "Abierto · cierra a las 17:00" / "Cerrado · abre el jueves a las 9:00". */
export function describeOpenStatus(status: OpenStatus, date = new Date()): string {
  if (status.open) return `Abierto · cierra a las ${formatTime(status.closesAt)}`;
  if (!status.opensAt || !status.opensDay) return "Cerrado";
  const today = madridNow(date).weekday;
  const tomorrow = WEEKDAYS[(WEEKDAYS.indexOf(today) + 1) % 7];
  const when =
    status.opensDay === today ? "hoy" : status.opensDay === tomorrow ? "mañana" : `el ${WEEKDAY_LABELS[status.opensDay].toLowerCase()}`;
  return `Cerrado · abre ${when} a las ${formatTime(status.opensAt)}`;
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
