/* Generador de .ics (RFC 5545) para "Añadir al calendario". Hora local de Madrid con su VTIMEZONE. */

const CRLF = "\r\n";

/** Escapa texto según RFC 5545 (\\, ;, , y saltos de línea). */
const escapeText = (text: string) => text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/** Pliega líneas a 75 octetos sin partir caracteres UTF-8. */
function fold(line: string) {
  const encoder = new TextEncoder();
  const out: string[] = [];
  let current = "";
  let bytes = 0;
  for (const ch of line) {
    const size = encoder.encode(ch).length;
    const limit = out.length === 0 ? 75 : 74; // las continuaciones empiezan con un espacio
    if (bytes + size > limit) {
      out.push(current);
      current = "";
      bytes = 0;
    }
    current += ch;
    bytes += size;
  }
  out.push(current);
  return out.join(`${CRLF} `);
}

/** "2026-11-06" + "21:00" (+ minutos) → "20261106T210000" en hora local (aritmética de calendario). */
function localStamp(date: string, time: string, addMinutes = 0) {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d, hh, mm + addMinutes));
  const p = (n: number) => String(n).padStart(2, "0");
  return `${t.getUTCFullYear()}${p(t.getUTCMonth() + 1)}${p(t.getUTCDate())}T${p(t.getUTCHours())}${p(t.getUTCMinutes())}00`;
}

const utcStamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

const MADRID_VTIMEZONE = [
  "BEGIN:VTIMEZONE",
  "TZID:Europe/Madrid",
  "X-LIC-LOCATION:Europe/Madrid",
  "BEGIN:DAYLIGHT",
  "TZOFFSETFROM:+0100",
  "TZOFFSETTO:+0200",
  "TZNAME:CEST",
  "DTSTART:19700329T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU",
  "END:DAYLIGHT",
  "BEGIN:STANDARD",
  "TZOFFSETFROM:+0200",
  "TZOFFSETTO:+0100",
  "TZNAME:CET",
  "DTSTART:19701025T030000",
  "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU",
  "END:STANDARD",
  "END:VTIMEZONE",
];

export type IcsEvent = {
  uid: string;
  title: string;
  description: string;
  date: string;
  time: string;
  durationMinutes?: number;
  location: string;
  geo?: { lat: number; lng: number };
  url: string;
  organizer: string;
};

export function buildIcs(e: IcsEvent, now = new Date()) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${escapeText(e.organizer)}//Eventos//ES`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...MADRID_VTIMEZONE,
    "BEGIN:VEVENT",
    `UID:${e.uid}`,
    `DTSTAMP:${utcStamp(now)}`,
    `DTSTART;TZID=Europe/Madrid:${localStamp(e.date, e.time)}`,
    `DTEND;TZID=Europe/Madrid:${localStamp(e.date, e.time, e.durationMinutes ?? 120)}`,
    `SUMMARY:${escapeText(e.title)}`,
    ...(e.description ? [`DESCRIPTION:${escapeText(e.description)}`] : []),
    `LOCATION:${escapeText(e.location)}`,
    ...(e.geo ? [`GEO:${e.geo.lat};${e.geo.lng}`] : []),
    `URL:${e.url}`,
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeText(e.title)}`,
    "TRIGGER:-PT2H",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join(CRLF) + CRLF;
}
