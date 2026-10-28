"use server";

import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/session";
import { WEEKDAYS, WEEKDAY_LABELS, dailyMenuSchema, parseSettings, siteSettingsSchema, type Closure, type OpeningHours } from "@/lib/settings";
import { normalizeWhatsappPhone } from "@/lib/whatsapp";
import { esErrorMap, validationFailure, type ActionResult, type FieldErrors } from "@/lib/validations/common";
import { isValidSpanishTaxId, normalizeTaxId } from "@/lib/validations/legal";
import {
  SETTINGS_SECTIONS,
  SETTINGS_SECTION_KEYS,
  normalizeInstagramHandle,
  pickSection,
  type SectionValues,
  type SettingsSectionKey,
} from "@/lib/validations/settings";
import { SAVE_ERROR, fail, logActionError, revalidateSite } from "./shared";

const toMinutes = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));

/** Tramos que se pisan dentro del mismo día (un tramo que cruza la medianoche cuenta hasta el día siguiente). */
function overlappingDays(hours: OpeningHours): FieldErrors {
  const errors: FieldErrors = {};
  for (const day of WEEKDAYS) {
    const ranges = hours[day]
      .map((r) => {
        const open = toMinutes(r.open);
        const close = toMinutes(r.close);
        return { open, close: close <= open ? close + 24 * 60 : close };
      })
      .sort((a, b) => a.open - b.open);
    for (let i = 1; i < ranges.length; i++) {
      if (ranges[i].open < ranges[i - 1].close) {
        errors[`openingHours.${day}`] = [`Los tramos del ${WEEKDAY_LABELS[day].toLowerCase()} se pisan entre sí`];
        break;
      }
    }
  }
  return errors;
}

/** Cierres que se pisan entre sí (comparando por fechas, ambas incluidas). Devuelve el error en el índice original. */
function overlappingClosures(closures: Closure[]): FieldErrors {
  const order = closures.map((c, index) => ({ ...c, index })).sort((a, b) => a.from.localeCompare(b.from));
  for (let i = 1; i < order.length; i++) {
    if (order[i].from <= order[i - 1].to) {
      return { [`specialClosures.${order[i].index}.from`]: ["Este cierre se solapa con otro: júntalos en uno o cambia las fechas"] };
    }
  }
  return {};
}

/**
 * Guarda una sección de /admin/contenido. Solo acepta las claves de esa sección,
 * valida el documento completo resultante y fusiona en la BD de forma atómica.
 */
export async function saveSettingsSection<S extends SettingsSectionKey>(
  section: S,
  values: Partial<SectionValues<S>>,
): Promise<ActionResult<SectionValues<S>>> {
  await requireAdmin();
  const sectionKey = z.enum(SETTINGS_SECTION_KEYS).safeParse(section);
  if (!sectionKey.success) return fail("Sección no válida");
  if (!values || typeof values !== "object" || Array.isArray(values)) return fail("Datos no válidos");

  const incoming = values as Record<string, unknown>;
  const patch: Record<string, unknown> = {};
  for (const key of SETTINGS_SECTIONS[sectionKey.data].keys) {
    if (key in incoming) patch[key] = incoming[key];
  }
  if (typeof patch.instagramHandle === "string") patch.instagramHandle = normalizeInstagramHandle(patch.instagramHandle);
  if (typeof patch.legalTaxId === "string") patch.legalTaxId = normalizeTaxId(patch.legalTaxId);

  try {
    const [row] = await db.select({ data: siteSettings.data }).from(siteSettings).where(eq(siteSettings.id, "main")).limit(1);
    const parsed = siteSettingsSchema.safeParse({ ...parseSettings(row?.data), ...patch }, { error: esErrorMap });
    if (!parsed.success) return validationFailure(parsed.error);

    const next = parsed.data;
    const extra: FieldErrors = {};
    if (next.announcementEnabled && !next.announcementText) extra.announcementText = ["Escribe el aviso para poder mostrarlo"];
    if ("openingHours" in patch) Object.assign(extra, overlappingDays(next.openingHours));
    if ("specialClosures" in patch) Object.assign(extra, overlappingClosures(next.specialClosures));
    if ("dailyMenu" in patch && next.dailyMenu.enabled) {
      if (next.dailyMenu.starters.length + next.dailyMenu.mains.length === 0) extra["dailyMenu.starters"] = ["Añade al menos un primero o un segundo, o desactiva el menú"];
      if (next.dailyMenu.days.length === 0) extra["dailyMenu.days"] = ["Elige al menos un día, o desactiva el menú"];
    }
    if (next.legalTaxId && !isValidSpanishTaxId(next.legalTaxId)) extra.legalTaxId = ["No parece un NIF, NIE o CIF válido. Revisa números y letra (p. ej. B12345674)."];
    if ("whatsappPhone" in patch) {
      const digits = normalizeWhatsappPhone(next.whatsappPhone);
      if (next.whatsappEnabled && !next.whatsappPhone) extra.whatsappPhone = ["Escribe el número de WhatsApp o desactiva el botón"];
      else if (next.whatsappPhone && !/^\d{9,15}$/.test(digits)) extra.whatsappPhone = ["Escribe un móvil válido, p. ej. 624 43 45 93 (o con prefijo +34)"];
    }
    if (Object.keys(extra).length > 0) return fail("Revisa los campos marcados", extra);

    // Cierres siempre ordenados por fecha
    if ("specialClosures" in patch) next.specialClosures = [...next.specialClosures].sort((a, b) => a.from.localeCompare(b.from));
    const sectionValues = pickSection(next, sectionKey.data);
    // Fusión atómica en la BD (jsonb ||): dos secciones guardadas a la vez no se pisan.
    await db
      .insert(siteSettings)
      .values({ id: "main", data: next })
      .onConflictDoUpdate({
        target: siteSettings.id,
        set: { data: sql`${siteSettings.data} || ${JSON.stringify(sectionValues)}::jsonb` },
      });
    revalidateSite();
    return { ok: true, data: sectionValues as SectionValues<S> };
  } catch (error) {
    logActionError("saveSettingsSection", error);
    return fail(SAVE_ERROR);
  }
}

/**
 * Interruptor rápido del menú del día (Inicio). Solo cambia `enabled`, sin tocar platos ni precios
 * aunque la pantalla tenga datos antiguos: fusión atómica dentro del jsonb.
 */
export async function setDailyMenuEnabled(enabled: unknown): Promise<ActionResult<{ enabled: boolean }>> {
  await requireAdmin();
  const parsed = z.boolean().safeParse(enabled);
  if (!parsed.success) return fail("Datos no válidos");

  try {
    const [row] = await db.select({ data: siteSettings.data }).from(siteSettings).where(eq(siteSettings.id, "main")).limit(1);
    const current = parseSettings(row?.data).dailyMenu;
    if (parsed.data && current.starters.length + current.mains.length === 0) {
      return fail("Añade al menos un primero o un segundo antes de activar el menú del día.");
    }
    if (parsed.data && current.days.length === 0) return fail("Elige qué días se sirve el menú antes de activarlo.");

    const fallback = JSON.stringify(dailyMenuSchema.parse({ ...current, enabled: parsed.data }));
    const flag = JSON.stringify({ enabled: parsed.data });
    await db
      .insert(siteSettings)
      .values({ id: "main", data: { dailyMenu: JSON.parse(fallback) } })
      .onConflictDoUpdate({
        target: siteSettings.id,
        set: {
          data: sql`${siteSettings.data} || jsonb_build_object('dailyMenu', coalesce(${siteSettings.data} -> 'dailyMenu', ${fallback}::jsonb) || ${flag}::jsonb)`,
        },
      });
    revalidateSite();
    return { ok: true, data: { enabled: parsed.data } };
  } catch (error) {
    logActionError("setDailyMenuEnabled", error);
    return fail(SAVE_ERROR);
  }
}
