"use server";

import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/session";
import { esErrorMap, idSchema, validationFailure, type ActionResult } from "@/lib/validations/common";
import { eventInputSchema } from "@/lib/validations/events";
import { SAVE_ERROR, fail, logActionError, revalidateSite } from "./shared";

/** Solo puede haber un evento destacado: al marcar uno se desmarcan los demás (en el mismo batch). */
const unfeatureOthers = (id: string) =>
  db.update(events).set({ isFeatured: false }).where(and(eq(events.isFeatured, true), ne(events.id, id)));

export async function createEvent(input: unknown): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = eventInputSchema.safeParse(input, { error: esErrorMap });
  if (!parsed.success) return validationFailure(parsed.error);

  // El id se genera aquí para poder desmarcar los demás destacados en el mismo batch.
  const id = crypto.randomUUID();
  try {
    const insert = db.insert(events).values({ ...parsed.data, id });
    if (parsed.data.isFeatured) await db.batch([unfeatureOthers(id), insert]);
    else await insert;
    revalidateSite();
    return { ok: true, data: { id } };
  } catch (error) {
    logActionError("createEvent", error);
    return fail(SAVE_ERROR);
  }
}

export async function updateEvent(id: unknown, input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return fail("Evento no válido");
  const parsed = eventInputSchema.safeParse(input, { error: esErrorMap });
  if (!parsed.success) return validationFailure(parsed.error);

  try {
    const update = db.update(events).set(parsed.data).where(eq(events.id, parsedId.data)).returning({ id: events.id });
    const updated = parsed.data.isFeatured ? (await db.batch([unfeatureOthers(parsedId.data), update]))[1] : await update;
    if (updated.length === 0) return fail("Este evento ya no existe. Puede que se haya borrado.");
    revalidateSite();
    return { ok: true, data: null };
  } catch (error) {
    logActionError("updateEvent", error);
    return fail(SAVE_ERROR);
  }
}

const toggleSchema = z.object({ id: idSchema, value: z.boolean() });

export async function setEventActive(id: unknown, isActive: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = toggleSchema.safeParse({ id, value: isActive });
  if (!parsed.success) return fail("Datos no válidos");
  try {
    const updated = await db.update(events).set({ isActive: parsed.data.value }).where(eq(events.id, parsed.data.id)).returning({ id: events.id });
    if (updated.length === 0) return fail("Este evento ya no existe. Recarga la página.");
    revalidateSite();
    return { ok: true, data: null };
  } catch (error) {
    logActionError("setEventActive", error);
    return fail(SAVE_ERROR);
  }
}

export async function setEventFeatured(id: unknown, isFeatured: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = toggleSchema.safeParse({ id, value: isFeatured });
  if (!parsed.success) return fail("Datos no válidos");
  const { id: eventId, value } = parsed.data;
  try {
    const update = db.update(events).set({ isFeatured: value }).where(eq(events.id, eventId)).returning({ id: events.id });
    const updated = value ? (await db.batch([unfeatureOthers(eventId), update]))[1] : await update;
    if (updated.length === 0) return fail("Este evento ya no existe. Recarga la página.");
    revalidateSite();
    return { ok: true, data: null };
  } catch (error) {
    logActionError("setEventFeatured", error);
    return fail(SAVE_ERROR);
  }
}

export async function deleteEvent(id: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return fail("Evento no válido");
  try {
    const deleted = await db.delete(events).where(eq(events.id, parsedId.data)).returning({ id: events.id });
    if (deleted.length === 0) return fail("Este evento ya se había borrado.");
    revalidateSite();
    return { ok: true, data: null };
  } catch (error) {
    logActionError("deleteEvent", error);
    return fail("No se ha podido borrar. Inténtalo otra vez.");
  }
}
