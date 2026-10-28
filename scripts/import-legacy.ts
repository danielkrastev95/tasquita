/**
 * Importa los datos del panel anterior (tablas Prisma: "MenuCategory", "MenuItem",
 * "Event", "SiteSettings", "User") a las tablas nuevas. Idempotente: si las tablas
 * nuevas ya tienen datos, no hace nada. Las tablas antiguas NO se modifican.
 *
 *   npm run db:import-legacy
 */
import "./env";
import { neon } from "@neondatabase/serverless";
import { randomUUID } from "node:crypto";
import { siteSettingsSchema, WEEKDAYS, type OpeningHours, type Weekday } from "../lib/settings";
import { requireEnv } from "./env";

const sql = neon(requireEnv("DATABASE_URL"));

type Row = Record<string, unknown>;

const legacyTables = (await sql`
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public' AND table_name IN ('MenuCategory','MenuItem','Event','SiteSettings','User')
`).map((r) => r.table_name as string);

if (legacyTables.length === 0) {
  console.log("No hay tablas antiguas que importar.");
  process.exit(0);
}

const [{ count: existing }] = await sql`SELECT (SELECT count(*) FROM menu_items) + (SELECT count(*) FROM site_settings) + (SELECT count(*) FROM users) AS count`;
if (Number(existing) > 0) {
  console.log("Las tablas nuevas ya tienen datos; importación omitida.");
  process.exit(0);
}

/* ── Utilidades ─────────────────────────────────────────────────────────── */

const str = (v: unknown) => (typeof v === "string" && v.trim() !== "" ? v.trim() : undefined);

function priceToCents(price: unknown): number | null {
  const s = str(price);
  if (!s) return null;
  const n = Number(s.replace(/[^\d,.]/g, "").replace(",", "."));
  return Number.isFinite(n) ? Math.round(n * 100) : null;
}

const DAY_NAMES: Record<string, Weekday> = {
  lunes: "mon",
  martes: "tue",
  miercoles: "wed",
  jueves: "thu",
  viernes: "fri",
  sabado: "sat",
  domingo: "sun",
};
const normalize = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
const pad = (t: string) => {
  const [h, m = "00"] = t.trim().split(":");
  return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
};

/** [{day:"Martes - Miércoles", hours:"9:00 - 17:00"}] → { tue: [...], wed: [...] } */
function parseSchedule(raw: unknown): OpeningHours | undefined {
  try {
    const list = JSON.parse(String(raw)) as { day: string; hours: string }[];
    if (!Array.isArray(list) || list.length === 0) return undefined;
    const result: Partial<OpeningHours> = {};
    for (const { day, hours } of list) {
      const names = normalize(day).split(/\s*(?:-|–|y|,)\s*/).map((n) => DAY_NAMES[n]).filter(Boolean);
      let days: Weekday[] = names;
      if (names.length === 2 && /-|–/.test(day)) {
        const [a, b] = names.map((n) => WEEKDAYS.indexOf(n));
        days = WEEKDAYS.slice(a, b + 1);
      }
      const ranges = /cerrado/i.test(hours)
        ? []
        : hours
            .split(/\s*(?:,|\by\b)\s*/)
            .map((part) => part.match(/(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})/))
            .filter((m): m is RegExpMatchArray => Boolean(m))
            .map((m) => ({ open: pad(m[1]), close: pad(m[2]) }));
      for (const d of days) result[d] = ranges;
    }
    for (const d of WEEKDAYS) result[d] ??= [];
    return result as OpeningHours;
  } catch {
    return undefined;
  }
}

/** Sube a Cloudinary una imagen externa (CDN de terceros que puede caducar). */
async function mirrorToCloudinary(url: string | undefined): Promise<string | null> {
  if (!url) return null;
  if (url.includes("res.cloudinary.com")) return url;
  const alive = await fetch(url, { method: "GET" }).then((r) => r.ok).catch(() => false);
  if (!alive) {
    console.warn(`  ⚠ Imagen caducada o inaccesible, se descarta: ${url.slice(0, 80)}…`);
    return null;
  }
  const cloud = process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.CLOUDINARY_UPLOAD_PRESET ?? process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloud || !preset) return url;
  const form = new FormData();
  form.append("file", url);
  form.append("upload_preset", preset);
  form.append("folder", "tasquita");
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: "POST", body: form });
  if (!res.ok) {
    console.warn(`  ⚠ No se pudo copiar a Cloudinary (${res.status}); se mantiene la URL original`);
    return url;
  }
  const data = (await res.json()) as { secure_url: string };
  console.log(`  ✓ Imagen copiada a Cloudinary: ${data.secure_url}`);
  return data.secure_url;
}

const queries: ReturnType<typeof sql>[] = [];

/* ── Carta ──────────────────────────────────────────────────────────────── */

if (legacyTables.includes("MenuCategory")) {
  const cats = (await sql`SELECT * FROM "MenuCategory" ORDER BY "sortOrder", "createdAt"`) as Row[];
  const items = legacyTables.includes("MenuItem")
    ? ((await sql`SELECT * FROM "MenuItem" ORDER BY "categoryId", "sortOrder", "createdAt"`) as Row[])
    : [];
  const idMap = new Map<string, string>();
  cats.forEach((c, i) => {
    const id = randomUUID();
    idMap.set(c.id as string, id);
    queries.push(sql`
      INSERT INTO menu_categories (id, slug, name, sort_order, is_active, created_at)
      VALUES (${id}, ${c.slug as string}, ${c.name as string}, ${i}, ${c.isActive as boolean}, ${c.createdAt as string})`);
  });
  const perCategory = new Map<string, number>();
  for (const it of items) {
    const categoryId = idMap.get(it.categoryId as string);
    if (!categoryId) continue;
    const position = perCategory.get(categoryId) ?? 0;
    perCategory.set(categoryId, position + 1);
    queries.push(sql`
      INSERT INTO menu_items (id, category_id, name, description, price_cents, image_url, is_popular, is_homemade, award, sort_order, is_active, created_at)
      VALUES (${randomUUID()}, ${categoryId}, ${it.name as string}, ${str(it.description) ?? null}, ${priceToCents(it.price)},
              ${str(it.image) ?? null}, ${it.isPopular as boolean}, ${it.isHomemade as boolean}, ${str(it.award) ?? null},
              ${position}, ${it.isActive as boolean}, ${it.createdAt as string})`);
  }
  console.log(`· Carta: ${cats.length} categorías, ${items.length} platos`);
}

/* ── Eventos ────────────────────────────────────────────────────────────── */

if (legacyTables.includes("Event")) {
  const evs = (await sql`SELECT *, to_char("date", 'YYYY-MM-DD') AS day FROM "Event"`) as Row[];
  for (const e of evs) {
    queries.push(sql`
      INSERT INTO events (id, title, description, date, time, image_url, category, is_featured, is_active, created_at)
      VALUES (${randomUUID()}, ${e.title as string}, ${(e.description as string) ?? ""}, ${e.day as string}, ${e.time as string},
              ${str(e.image) ?? null}, ${e.category as string}, ${e.isFeatured as boolean}, ${e.isActive as boolean}, ${e.createdAt as string})`);
  }
  console.log(`· Eventos: ${evs.length}`);
}

/* ── Ajustes ────────────────────────────────────────────────────────────── */

if (legacyTables.includes("SiteSettings")) {
  const [s] = (await sql`SELECT * FROM "SiteSettings" WHERE id = 'main'`) as Row[];
  if (s) {
    const values = [1, 2, 3]
      .map((n) => ({ title: str(s[`value${n}Title`]), description: str(s[`value${n}Description`]) ?? "" }))
      .filter((v): v is { title: string; description: string } => Boolean(v.title));
    const candidate = {
      name: str(s.heroTitle),
      heroBadge: str(s.heroBadge),
      heroTagline: str(s.heroTagline),
      heroMarquee: str(s.heroMarquee),
      heroCtaText: str(s.heroCtaText),
      heroDeliveryLabel: str(s.heroDeliveryLabel),
      heroKitchenLabel: str(s.heroKitchenLabel),
      heroImage1: await mirrorToCloudinary(str(s.heroImage1)),
      heroImage2: await mirrorToCloudinary(str(s.heroImage2)),
      showFeaturedEventInHero: typeof s.heroEventEnabled === "boolean" ? s.heroEventEnabled : undefined,
      aboutHeroTitle: str(s.aboutHeroTitle),
      aboutParagraph1: str(s.aboutParagraph1),
      aboutParagraph2: str(s.aboutParagraph2),
      aboutQuote: str(s.aboutQuote),
      aboutQuoteAuthor: str(s.aboutQuoteAuthor),
      yearFounded: typeof s.yearFounded === "number" ? s.yearFounded : undefined,
      aboutImage1: str(s.aboutImage1) ?? null,
      aboutImage2: str(s.aboutImage2) ?? null,
      aboutImage3: str(s.aboutImage3) ?? null,
      aboutValuesTitle: str(s.aboutValuesTitle),
      values: values.length ? values : undefined,
      addressStreet: str(s.addressStreet),
      addressCity: str(s.addressCity),
      addressPostalCode: str(s.addressPostalCode),
      phone: str(s.phone),
      instagramHandle: str(s.instagramHandle)?.replace(/^@/, ""),
      contactSectionTitle: str(s.contactSectionTitle),
      contactPhoneLabel: str(s.contactPhoneLabel),
      contactSocialLabel: str(s.contactSocialLabel),
      contactImage: str(s.contactImage) ?? null,
      openingHours: parseSchedule(s.schedule),
      glovoUrl: str(s.glovoUrl) ?? null,
      uberEatsUrl: str(s.uberEatsUrl) ?? null,
      eventsEnabled: typeof s.eventsEnabled === "boolean" ? s.eventsEnabled : undefined,
      eventsOrgTitle: str(s.eventsOrgTitle),
      eventsOrgDesc: str(s.eventsOrgDesc),
      eventsOrgCta: str(s.eventsOrgCta),
      footerTagline: str(s.footerTagline),
      footerEstLabel: str(s.footerEstLabel),
    };
    // Elimina undefined para que apliquen los valores por defecto
    const cleaned = Object.fromEntries(Object.entries(candidate).filter(([, v]) => v !== undefined));
    const parsed = siteSettingsSchema.safeParse(cleaned);
    if (!parsed.success) {
      console.error("✗ Ajustes antiguos no válidos:", parsed.error.issues);
      process.exit(1);
    }
    queries.push(sql`INSERT INTO site_settings (id, data) VALUES ('main', ${JSON.stringify(parsed.data)}::jsonb)`);
    console.log("· Ajustes del sitio importados");
  }
}

/* ── Cuenta de administración ───────────────────────────────────────────── */

if (legacyTables.includes("User")) {
  const legacyUsers = (await sql`SELECT * FROM "User"`) as Row[];
  for (const u of legacyUsers) {
    const id = randomUUID();
    const email = String(u.email).trim().toLowerCase();
    queries.push(sql`
      INSERT INTO users (id, name, email, email_verified, two_factor_enabled, created_at)
      VALUES (${id}, ${str(u.name) ?? "Sara"}, ${email}, true, false, ${u.createdAt as string})`);
    // Mismo hash bcrypt: la contraseña actual sigue funcionando. El 2FA se configura al entrar.
    queries.push(sql`
      INSERT INTO accounts (id, account_id, provider_id, user_id, password)
      VALUES (${randomUUID()}, ${id}, 'credential', ${id}, ${u.passwordHash as string})`);
  }
  console.log(`· Usuarios: ${legacyUsers.length} (deberán activar el 2FA al iniciar sesión)`);
}

await sql.transaction(queries);
console.log("✓ Importación completada");
