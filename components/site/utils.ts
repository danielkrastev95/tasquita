import type { Closure, OpeningHours, SiteSettings } from "@/lib/settings";
import { whatsappLink } from "@/lib/whatsapp";

/* Utilidades de la web pública (sin dependencias de servidor: se pueden usar en cliente). */

/** Horario semanal + cierres puntuales: todo lo necesario para calcular abierto/cerrado. */
export type Schedule = { hours: OpeningHours; closures: Closure[] };

export const getSchedule = (s: Pick<SiteSettings, "openingHours" | "specialClosures">): Schedule => ({
  hours: s.openingHours,
  closures: s.specialClosures,
});

/** ¿Se puede reservar por WhatsApp? */
export const canReserve = (s: Pick<SiteSettings, "whatsappEnabled" | "reservationsEnabled" | "whatsappPhone">) =>
  s.whatsappEnabled && s.reservationsEnabled && s.whatsappPhone.trim().length > 0;

/** Acciones rápidas compartidas por cabecera, menú móvil, barra fija y hero. */
export type SiteActions = {
  phone: string;
  telHref: string;
  directionsUrl: string;
  /** Sección de reserva (si las reservas por WhatsApp están activas) */
  reserveHref: string | null;
  /** Chat de WhatsApp (si está activo) */
  whatsappHref: string | null;
};

/** Datos que necesitan las acciones de cada evento. */
export const getEventActionsContext = (s: SiteSettings) => ({
  siteName: s.name,
  reservePhone: canReserve(s) ? s.whatsappPhone : null,
  telHref: telHref(s.phone),
});

export function getSiteActions(s: SiteSettings): SiteActions {
  return {
    phone: s.phone,
    telHref: telHref(s.phone),
    directionsUrl: directionsUrl(s.latitude, s.longitude),
    reserveHref: canReserve(s) ? "/#reservar" : null,
    whatsappHref: s.whatsappEnabled && s.whatsappPhone.trim() ? whatsappLink(s.whatsappPhone) : null,
  };
}

/** "624 43 45 93" → "tel:+34624434593" (respeta prefijos internacionales ya escritos). */
export function telHref(phone: string) {
  const clean = phone.replace(/[^\d+]/g, "");
  if (clean.startsWith("+")) return `tel:${clean}`;
  if (clean.startsWith("00")) return `tel:+${clean.slice(2)}`;
  return `tel:+34${clean}`;
}

/** Teléfono en formato internacional para JSON-LD: "+34624434593". */
export const phoneE164 = (phone: string) => telHref(phone).slice(4);

export const instagramUrl = (handle: string) => `https://www.instagram.com/${handle.replace(/^@/, "")}/`;

export const directionsUrl = (lat: number, lng: number) => `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

export const mapEmbedUrl = (lat: number, lng: number) => `https://www.google.com/maps?q=${lat},${lng}&hl=es&z=16&output=embed`;

export const mapsUrl = (lat: number, lng: number) => `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

/** "Valdemoro, Madrid" → { locality: "Valdemoro", region: "Madrid" } */
export function splitCity(addressCity: string) {
  const [locality, ...rest] = addressCity.split(",").map((s) => s.trim());
  return { locality: locality || addressCity, region: rest.join(", ") || null };
}

export const pad2 = (n: number) => String(n).padStart(2, "0");

/** "viernes" → "Viernes" */
export const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** Año actual (fuera de los componentes para que el render siga siendo puro). */
export const currentYear = () => new Date().getFullYear();

export type NavLink = { href: string; label: string };

export function getNavLinks(settings: Pick<SiteSettings, "eventsEnabled">): NavLink[] {
  return [
    { href: "/carta", label: "Carta" },
    { href: "/#nosotros", label: "Nosotros" },
    ...(settings.eventsEnabled ? [{ href: "/eventos", label: "Eventos" }] : []),
    { href: "/#contacto", label: "Contacto" },
  ];
}

/** Separa la última palabra para destacarla ("La Tasquita de" + "Sara"). */
export function splitLastWord(text: string) {
  const words = text.trim().split(/\s+/);
  if (words.length < 2) return { head: "", last: text };
  return { head: words.slice(0, -1).join(" "), last: words[words.length - 1] };
}
