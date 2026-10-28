"use server";

import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/session";
import { WEEKDAYS, WEEKDAY_LABELS, parseSettings, siteSettingsSchema, type OpeningHours } from "@/lib/settings";
import { esErrorMap, validationFailure, type ActionResult, type FieldErrors } from "@/lib/validations/common";
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

  try {
    const [row] = await db.select({ data: siteSettings.data }).from(siteSettings).where(eq(siteSettings.id, "main")).limit(1);
    const parsed = siteSettingsSchema.safeParse({ ...parseSettings(row?.data), ...patch }, { error: esErrorMap });
    if (!parsed.success) return validationFailure(parsed.error);

    const next = parsed.data;
    const extra: FieldErrors = {};
    if (next.announcementEnabled && !next.announcementText) extra.announcementText = ["Escribe el aviso para poder mostrarlo"];
    if ("openingHours" in patch) Object.assign(extra, overlappingDays(next.openingHours));
    if (Object.keys(extra).length > 0) return fail("Revisa los campos marcados", extra);

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
