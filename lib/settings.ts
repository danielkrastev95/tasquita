import { z } from "zod";

/**
 * Todos los textos y ajustes editables desde /admin/contenido.
 * Se guardan como un único documento JSON en `site_settings.data`.
 * Cada campo tiene valor por defecto: añadir un campo nuevo NO requiere migración.
 */

const HH_MM = /^([01]\d|2[0-3]):[0-5]\d$/;

export const timeRangeSchema = z.object({
  open: z.string().regex(HH_MM, "Formato HH:MM"),
  /** Si `close` <= `open`, el tramo termina al día siguiente (p. ej. 20:00 – 02:00). */
  close: z.string().regex(HH_MM, "Formato HH:MM"),
});
export type TimeRange = z.infer<typeof timeRangeSchema>;

import { WEEKDAYS } from "@/lib/weekdays";

export { WEEKDAYS, WEEKDAY_LABELS, type Weekday } from "@/lib/weekdays";

const day = z.array(timeRangeSchema).max(3);

export const openingHoursSchema = z.object({
  mon: day.default([]),
  tue: day.default([{ open: "09:00", close: "17:00" }]),
  wed: day.default([{ open: "09:00", close: "17:00" }]),
  thu: day.default([{ open: "09:00", close: "01:00" }]),
  fri: day.default([{ open: "09:00", close: "02:00" }]),
  sat: day.default([{ open: "09:00", close: "02:00" }]),
  sun: day.default([{ open: "10:00", close: "18:00" }]),
});
export type OpeningHours = z.infer<typeof openingHoursSchema>;

const optionalUrl = z
  .union([z.url({ protocol: /^https$/, error: "Debe ser una URL https://" }), z.literal("")])
  .nullable()
  .default(null)
  .transform((v) => (v ? v : null));

const text = (fallback: string, max = 300) => z.string().trim().max(max).default(fallback);

export const valueSchema = z.object({
  title: z.string().trim().min(1).max(80),
  description: z.string().trim().max(240),
});

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha no válida");

/** Cierre puntual (vacaciones, festivo…). Fechas locales de Madrid, ambas incluidas. */
export const closureSchema = z
  .object({
    from: isoDate,
    to: isoDate,
    note: z.string().trim().max(120).default(""),
  })
  .refine((c) => c.to >= c.from, { message: "La fecha final no puede ser anterior a la inicial", path: ["to"] });
export type Closure = z.infer<typeof closureSchema>;

const dish = z.string().trim().min(1).max(140);

export const dailyMenuSchema = z.object({
  enabled: z.boolean().default(false),
  title: z.string().trim().max(60).default("Menú del día"),
  priceCents: z.number().int().min(0).max(100_000).nullable().default(null),
  /** Días en que se sirve */
  days: z.array(z.enum(WEEKDAYS)).max(7).default(["tue", "wed", "thu", "fri"]),
  hours: z.string().trim().max(60).default("13:30 – 16:00"),
  starters: z.array(dish).max(8).default([]),
  mains: z.array(dish).max(8).default([]),
  desserts: z.array(dish).max(6).default([]),
  includes: z.string().trim().max(160).default("Pan, bebida y postre o café"),
  note: z.string().trim().max(200).default(""),
});
export type DailyMenu = z.infer<typeof dailyMenuSchema>;

export const siteSettingsSchema = z.object({
  /* Identidad */
  name: text("La Tasquita de Sara", 80),
  seoDescription: text(
    "Bar de tapas en Valdemoro con hamburguesas gourmet, raciones caseras y cocina de mercado. Pet-friendly, terraza y buen ambiente de barrio.",
    300,
  ),

  /* Aviso superior (vacaciones, cierres, novedades) */
  announcementEnabled: z.boolean().default(false),
  announcementText: text("", 160),

  /* Portada (hero) */
  heroBadge: text("Est. Valdemoro · Tapas", 60),
  heroTagline: text("El producto manda y el sabor no pide permiso.", 200),
  heroMarquee: text("TRADICIÓN • SABOR • BARRIO", 80),
  heroCtaText: text("Ver carta", 30),
  heroDeliveryLabel: text("Pide a domicilio", 40),
  heroKitchenLabel: text("Cocina en vivo", 40),
  heroImage1: optionalUrl,
  heroImage2: optionalUrl,
  showFeaturedEventInHero: z.boolean().default(true),

  /* Nosotros */
  aboutHeroTitle: text("Cocina de barrio", 60),
  aboutParagraph1: text(
    "Nacimos en 2025 con una idea clara: ser el bar de barrio donde todos quieren estar. Un sitio donde la cocina tradicional se encuentra con toques modernos, donde cada plato cuenta una historia y donde nuestros clientes se sienten como en casa.",
    1200,
  ),
  aboutParagraph2: text(
    "Trabajamos con productos de temporada y de la mejor calidad. Nuestra carta combina recetas de toda la vida con creaciones más atrevidas, siempre manteniendo ese sabor auténtico que nos caracteriza.",
    1200,
  ),
  aboutQuote: text("La cocina es amor hecho visible, y aquí cocinamos con el corazón", 240),
  aboutQuoteAuthor: text("El equipo de La Tasquita", 80),
  yearFounded: z.number().int().min(1900).max(2100).default(2025),
  aboutImage1: optionalUrl,
  aboutImage2: optionalUrl,
  aboutImage3: optionalUrl,
  aboutValuesTitle: text("Nuestros valores", 60),
  values: z
    .array(valueSchema)
    .min(1)
    .max(4)
    .default([
      { title: "Producto de calidad", description: "Seleccionamos los mejores ingredientes de proveedores locales." },
      { title: "Trae a tu peludito", description: "Espacio pet-friendly donde tu mascota es bienvenida." },
      { title: "Ambiente familiar", description: "Un espacio acogedor donde todos son bienvenidos." },
    ]),

  /* Contacto y ubicación */
  addressStreet: text("C. Lili Álvarez, 66", 120),
  addressCity: text("Valdemoro, Madrid", 80),
  addressPostalCode: text("28342", 10),
  latitude: z.number().min(-90).max(90).default(40.201998253991874),
  longitude: z.number().min(-180).max(180).default(-3.6892787099523385),
  phone: text("624 43 45 93", 30),
  email: z.union([z.email(), z.literal("")]).default(""),
  instagramHandle: text("latasquitadesara", 40),
  contactSectionTitle: text("Visítanos", 40),
  contactPhoneLabel: text("Llámanos", 40),
  contactSocialLabel: text("Síguenos", 40),
  contactImage: optionalUrl,

  /* Horario */
  openingHours: openingHoursSchema.default(openingHoursSchema.parse({})),
  hoursNote: text("", 160),
  /** Vacaciones, festivos y cierres puntuales: la web dice "Cerrado" esos días. */
  specialClosures: z.array(closureSchema).max(30).default([]),

  /* Menú del día */
  dailyMenu: dailyMenuSchema.default(dailyMenuSchema.parse({})),

  /* Reservas (por WhatsApp, sin formularios ni bases de datos) */
  whatsappEnabled: z.boolean().default(true),
  /** Número con WhatsApp. Se aceptan espacios; si no lleva prefijo se asume España (+34). */
  whatsappPhone: text("624 43 45 93", 30),
  reservationsEnabled: z.boolean().default(true),
  reservationsNote: text("Te confirmamos la reserva por WhatsApp lo antes posible.", 200),
  reservationMaxGuests: z.number().int().min(1).max(200).default(20),

  /* Reseñas */
  googleReviewsUrl: optionalUrl,

  /* Pedidos a domicilio */
  glovoUrl: optionalUrl.default("https://glovoapp.com/es/es/valdemoro-ciempozuelos/stores/la-tasquita-de-sara-valdemoro"),
  uberEatsUrl: optionalUrl.default("https://www.ubereats.com/es/store/la-tasquita-de-sara/tWST6whgU2iUdY71PWw9jw"),

  /* Eventos */
  eventsEnabled: z.boolean().default(true),
  eventsOrgTitle: text("Organiza tu evento", 60),
  eventsOrgDesc: text(
    "Celebra tu momento especial en nuestro espacio. Menús personalizados, música en vivo y un ambiente diseñado para crear recuerdos.",
    400,
  ),
  eventsOrgCta: text("Contáctanos", 30),

  /* Pie de página */
  footerTagline: text("Un tributo visceral a la cocina de barrio.", 160),
  footerEstLabel: text("Est. 2025 · Valdemoro, Madrid", 60),

  /* Datos legales (aviso legal y privacidad, LSSI/RGPD) */
  legalName: text("", 120),
  legalTaxId: text("", 20),
  legalAddress: text("", 200),
  legalEmail: z.union([z.email(), z.literal("")]).default(""),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;
export type SiteSettingsInput = z.input<typeof siteSettingsSchema>;

export const DEFAULT_SETTINGS: SiteSettings = siteSettingsSchema.parse({});

/**
 * Convierte el JSON guardado en ajustes válidos. Si algún campo está corrupto se
 * descarta ese campo (no todo el documento) y se usa su valor por defecto.
 */
export function parseSettings(raw: unknown): SiteSettings {
  const input = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const full = siteSettingsSchema.safeParse(input);
  if (full.success) return full.data;

  const cleaned: Record<string, unknown> = {};
  const shape = siteSettingsSchema.shape;
  for (const [key, value] of Object.entries(input)) {
    const field = shape[key as keyof typeof shape];
    if (field && field.safeParse(value).success) cleaned[key] = value;
  }
  return siteSettingsSchema.parse(cleaned);
}
