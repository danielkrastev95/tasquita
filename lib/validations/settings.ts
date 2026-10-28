import type { SiteSettings } from "@/lib/settings";

/**
 * Secciones de /admin/contenido. Cada una agrupa campos de `siteSettingsSchema`
 * y se guarda por separado (la action solo acepta las claves de su sección).
 */
export const SETTINGS_SECTIONS = {
  menu: {
    title: "Menú del día",
    description: "Título, precio, días, horario y los platos de primero, segundo y postre.",
    webPath: "/#menu-del-dia",
    keys: ["dailyMenu"],
  },
  cierres: {
    title: "Cierres y festivos",
    description: "Vacaciones, festivos o días sueltos sin abrir. La web dirá «Cerrado» esos días sin tocar el horario.",
    webPath: "/#contacto",
    keys: ["specialClosures"],
  },
  notas: {
    title: "Notas de la carta",
    description: "Avisos al pie de la carta: suplementos, pan, IVA incluido, alérgenos a consultar…",
    webPath: "/carta",
    keys: ["menuNotes"],
  },
  aviso: {
    title: "Aviso superior",
    description: "Una franja arriba del todo de la web para avisos puntuales: vacaciones, cierres, novedades.",
    webPath: "/",
    keys: ["announcementEnabled", "announcementText"],
  },
  portada: {
    title: "Portada",
    description: "Lo primero que ve la gente al entrar: frase principal, fotos y botón de la carta.",
    webPath: "/",
    keys: [
      "heroBadge",
      "heroTagline",
      "heroMarquee",
      "heroCtaText",
      "heroKitchenLabel",
      "heroImage1",
      "heroImage2",
      "showFeaturedEventInHero",
    ],
  },
  nosotros: {
    title: "Nosotros",
    description: "La historia del bar: textos, cita, año de apertura y tres fotos.",
    webPath: "/#nosotros",
    keys: [
      "aboutHeroTitle",
      "aboutParagraph1",
      "aboutParagraph2",
      "aboutQuote",
      "aboutQuoteAuthor",
      "yearFounded",
      "aboutImage1",
      "aboutImage2",
      "aboutImage3",
    ],
  },
  valores: {
    title: "Valores",
    description: "De uno a cuatro puntos fuertes del bar, debajo de la sección Nosotros.",
    webPath: "/#nosotros",
    keys: ["aboutValuesTitle", "values"],
  },
  contacto: {
    title: "Contacto y ubicación",
    description: "Dirección, teléfono, correo, Instagram, punto del mapa y foto de la sección Visítanos.",
    webPath: "/#contacto",
    keys: [
      "addressStreet",
      "addressPostalCode",
      "addressCity",
      "phone",
      "email",
      "instagramHandle",
      "latitude",
      "longitude",
      "contactSectionTitle",
      "contactPhoneLabel",
      "contactSocialLabel",
      "contactImage",
    ],
  },
  horario: {
    title: "Horario",
    description: "Horas de apertura de cada día. Con esto la web dice si ahora está abierto o cerrado.",
    webPath: "/#contacto",
    keys: ["openingHours", "hoursNote"],
  },
  reservas: {
    title: "Reservas por WhatsApp",
    description: "El botón de WhatsApp de la web y las reservas, que te llegan como mensaje con día, hora y personas.",
    webPath: "/#reservar",
    keys: ["whatsappEnabled", "whatsappPhone", "reservationsEnabled", "reservationsNote", "reservationMaxGuests"],
  },
  resenas: {
    title: "Reseñas de Google",
    description: "El enlace para que los clientes os dejen una reseña en Google.",
    webPath: "/",
    keys: ["googleReviewsUrl"],
  },
  domicilio: {
    title: "Pedidos a domicilio",
    description: "Enlaces a Glovo y Uber Eats que aparecen en la portada.",
    webPath: "/",
    keys: ["heroDeliveryLabel", "glovoUrl", "uberEatsUrl"],
  },
  eventos: {
    title: "Eventos",
    description: "Mostrar u ocultar la sección de eventos y el bloque «Organiza tu evento».",
    webPath: "/eventos",
    keys: ["eventsEnabled", "eventsOrgTitle", "eventsOrgDesc", "eventsOrgCta"],
  },
  pie: {
    title: "Pie de página",
    description: "La frase y la etiqueta que aparecen al final de todas las páginas.",
    webPath: "/",
    keys: ["footerTagline", "footerEstLabel"],
  },
  seo: {
    title: "Google y redes",
    description: "Nombre y descripción que salen en Google y al compartir la web por WhatsApp.",
    webPath: "/",
    keys: ["name", "seoDescription"],
  },
  legal: {
    title: "Datos legales",
    description: "Titular, NIF/CIF, domicilio y correo que aparecen en el Aviso legal y la Política de privacidad.",
    webPath: "/aviso-legal",
    keys: ["legalName", "legalTaxId", "legalAddress", "legalEmail"],
  },
} as const satisfies Record<string, { title: string; description: string; webPath: string; keys: readonly (keyof SiteSettings)[] }>;

export type SettingsSectionKey = keyof typeof SETTINGS_SECTIONS;
export const SETTINGS_SECTION_KEYS = Object.keys(SETTINGS_SECTIONS) as [SettingsSectionKey, ...SettingsSectionKey[]];

export type SectionFieldKey<S extends SettingsSectionKey> = (typeof SETTINGS_SECTIONS)[S]["keys"][number];
export type SectionValues<S extends SettingsSectionKey> = Pick<SiteSettings, SectionFieldKey<S>>;

// Comprobación en tiempo de compilación: todos los ajustes pertenecen a alguna sección.
type CoveredKey = { [S in SettingsSectionKey]: SectionFieldKey<S> }[SettingsSectionKey];
type MissingKeys = Exclude<keyof SiteSettings, CoveredKey>;
export const ALL_SETTINGS_COVERED: MissingKeys extends never ? true : MissingKeys = true;

/** Página de edición de cada sección (el menú del día tiene ruta propia, de uso diario). */
export const sectionHref = (section: SettingsSectionKey) => (section === "menu" ? "/admin/menu-del-dia" : `/admin/contenido/${section}`);

export const isSettingsSection = (value: string): value is SettingsSectionKey => value in SETTINGS_SECTIONS;

export function pickSection<S extends SettingsSectionKey>(settings: SiteSettings, section: S): SectionValues<S> {
  const out: Partial<SiteSettings> = {};
  for (const key of SETTINGS_SECTIONS[section].keys as readonly (keyof SiteSettings)[]) {
    (out as Record<string, unknown>)[key] = settings[key];
  }
  return out as SectionValues<S>;
}

/** "@latasquitadesara", "instagram.com/latasquitadesara/" → "latasquitadesara" */
export function normalizeInstagramHandle(input: string): string {
  return input
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/^@+/, "")
    .replace(/[/?#].*$/, "")
    .trim();
}
