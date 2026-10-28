/**
 * Sustituye la carta completa por la de scripts/data/carta.ts.
 * 1. Copia a Cloudinary las fotos "nordqr:<hash>" (una sola vez: se guardan en scripts/data/carta-images.json).
 * 2. En UNA transacción borra categorías y platos y crea los nuevos (la web nunca ve la carta vacía),
 *    y guarda las notas de la carta en los ajustes.
 *
 *   npm run carta:replace            → muestra qué haría
 *   npm run carta:replace -- --yes   → lo aplica
 */
import "./env";
import { neon } from "@neondatabase/serverless";
import { randomUUID } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { CARTA, MENU_NOTES } from "./data/carta";
import { requireEnv } from "./env";

const CACHE_FILE = "scripts/data/carta-images.json";
const apply = process.argv.includes("--yes");
const sql = neon(requireEnv("DATABASE_URL"));

const cache: Record<string, string> = existsSync(CACHE_FILE) ? JSON.parse(readFileSync(CACHE_FILE, "utf8")) : {};

async function resolveImage(image: string | undefined): Promise<string | null> {
  if (!image) return null;
  if (!image.startsWith("nordqr:")) return image;
  const hash = image.slice("nordqr:".length);
  if (cache[hash]) return cache[hash];

  const cloud = process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.CLOUDINARY_UPLOAD_PRESET ?? process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloud || !preset) throw new Error("Faltan las variables de Cloudinary para copiar las fotos");

  const form = new FormData();
  form.append("file", `https://go.nordqr.com/qeah2e/${hash}2c.webp`);
  form.append("upload_preset", preset);
  form.append("folder", "tasquita/carta");
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: "POST", body: form });
  if (!res.ok) throw new Error(`Cloudinary rechazó ${hash}: ${res.status} ${await res.text()}`);
  const { secure_url } = (await res.json()) as { secure_url: string };
  cache[hash] = secure_url;
  writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2) + "\n");
  console.log(`  ✓ foto ${hash} → Cloudinary`);
  return secure_url;
}

const totalItems = CARTA.reduce((n, c) => n + c.items.length, 0);
const [{ cats, items }] = await sql`SELECT (SELECT count(*) FROM menu_categories) AS cats, (SELECT count(*) FROM menu_items) AS items`;
console.log(`Carta actual: ${cats} categorías, ${items} platos → nueva: ${CARTA.length} categorías, ${totalItems} platos`);

if (!apply) {
  console.log("Modo prueba: añade -- --yes para aplicarlo.");
  process.exit(0);
}

const queries: ReturnType<typeof sql>[] = [sql`DELETE FROM menu_items`, sql`DELETE FROM menu_categories`];

for (const [catIndex, category] of CARTA.entries()) {
  const categoryId = randomUUID();
  queries.push(sql`
    INSERT INTO menu_categories (id, slug, name, description, sort_order, is_active)
    VALUES (${categoryId}, ${category.slug}, ${category.name}, ${category.description ?? null}, ${catIndex}, true)`);
  for (const [itemIndex, item] of category.items.entries()) {
    queries.push(sql`
      INSERT INTO menu_items (id, category_id, name, description, price_cents, price_variants, image_url,
                              is_popular, is_homemade, is_new, award, sort_order, is_active)
      VALUES (${randomUUID()}, ${categoryId}, ${item.name}, ${item.description ?? null}, ${item.priceCents},
              ${JSON.stringify(item.priceVariants ?? [])}::jsonb, ${await resolveImage(item.image)},
              ${item.isPopular ?? false}, ${item.isHomemade ?? false}, ${item.isNew ?? false}, ${item.award ?? null},
              ${itemIndex}, true)`);
  }
}

queries.push(sql`
  UPDATE site_settings SET data = data || jsonb_build_object('menuNotes', ${JSON.stringify(MENU_NOTES)}::jsonb), updated_at = now()
  WHERE id = 'main'`);

await sql.transaction(queries);
console.log(`✓ Carta sustituida: ${CARTA.length} categorías y ${totalItems} platos`);
