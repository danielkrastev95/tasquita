"use server";

import { and, eq, isNotNull, like, or, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { menuCategories, menuItems } from "@/lib/db/schema";
import { todayInMadrid } from "@/lib/format";
import { requireAdmin } from "@/lib/session";
import { esErrorMap, idSchema, slugify, validationFailure, type ActionResult } from "@/lib/validations/common";
import { categoryInputSchema, menuItemInputSchema, reorderSchema } from "@/lib/validations/menu";
import { SAVE_ERROR, fail, logActionError, pgErrorCode, revalidateSite } from "./shared";

const STALE = "La carta ha cambiado en otra pestaña. Recarga la página e inténtalo de nuevo.";

/* ────────────────────────────── Categorías ────────────────────────────── */

/** Slug único a partir del nombre ("Un Poco de Mar" → "un-poco-de-mar", "…-2" si ya existe). */
async function uniqueSlug(name: string, excludeId?: string) {
  const base = slugify(name);
  const rows = await db
    .select({ id: menuCategories.id, slug: menuCategories.slug })
    .from(menuCategories)
    .where(or(eq(menuCategories.slug, base), like(menuCategories.slug, `${base}-%`)));
  const taken = new Set(rows.filter((r) => r.id !== excludeId).map((r) => r.slug));
  if (!taken.has(base)) return base;
  for (let i = 2; ; i++) if (!taken.has(`${base}-${i}`)) return `${base}-${i}`;
}

export async function createCategory(input: unknown): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = categoryInputSchema.safeParse(input, { error: esErrorMap });
  if (!parsed.success) return validationFailure(parsed.error);

  try {
    const slug = await uniqueSlug(parsed.data.name);
    const [row] = await db
      .insert(menuCategories)
      .values({
        ...parsed.data,
        slug,
        sortOrder: sql`(select coalesce(max(${menuCategories.sortOrder}), -1) + 1 from ${menuCategories})`,
      })
      .returning({ id: menuCategories.id });
    revalidateSite();
    return { ok: true, data: { id: row.id } };
  } catch (error) {
    if (pgErrorCode(error) === "23505") return fail("Ya existe una categoría con un nombre muy parecido. Prueba con otro.");
    logActionError("createCategory", error);
    return fail(SAVE_ERROR);
  }
}

export async function updateCategory(id: unknown, input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return fail("Categoría no válida");
  const parsed = categoryInputSchema.safeParse(input, { error: esErrorMap });
  if (!parsed.success) return validationFailure(parsed.error);

  try {
    const slug = await uniqueSlug(parsed.data.name, parsedId.data);
    const updated = await db
      .update(menuCategories)
      .set({ ...parsed.data, slug })
      .where(eq(menuCategories.id, parsedId.data))
      .returning({ id: menuCategories.id });
    if (updated.length === 0) return fail("Esa categoría ya no existe. Recarga la página.");
    revalidateSite();
    return { ok: true, data: null };
  } catch (error) {
    if (pgErrorCode(error) === "23505") return fail("Ya existe una categoría con un nombre muy parecido. Prueba con otro.");
    logActionError("updateCategory", error);
    return fail(SAVE_ERROR);
  }
}

export async function setCategoryActive(id: unknown, isActive: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = z.object({ id: idSchema, isActive: z.boolean() }).safeParse({ id, isActive });
  if (!parsed.success) return fail("Datos no válidos");
  try {
    const updated = await db
      .update(menuCategories)
      .set({ isActive: parsed.data.isActive })
      .where(eq(menuCategories.id, parsed.data.id))
      .returning({ id: menuCategories.id });
    if (updated.length === 0) return fail("Esa categoría ya no existe. Recarga la página.");
    revalidateSite();
    return { ok: true, data: null };
  } catch (error) {
    logActionError("setCategoryActive", error);
    return fail(SAVE_ERROR);
  }
}

export async function deleteCategory(id: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return fail("Categoría no válida");
  try {
    // Los platos de la categoría se borran en cascada (FK on delete cascade).
    const deleted = await db.delete(menuCategories).where(eq(menuCategories.id, parsedId.data)).returning({ id: menuCategories.id });
    if (deleted.length === 0) return fail("Esa categoría ya se había borrado.");
    revalidateSite();
    return { ok: true, data: null };
  } catch (error) {
    logActionError("deleteCategory", error);
    return fail("No se ha podido borrar. Inténtalo otra vez.");
  }
}

export async function reorderCategories(ids: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = reorderSchema.safeParse(ids);
  if (!parsed.success) return fail("Orden no válido");
  const order = parsed.data;
  try {
    const current = await db.select({ id: menuCategories.id }).from(menuCategories);
    if (!sameSet(order, current.map((c) => c.id))) return fail(STALE);
    const [first, ...rest] = order.map((categoryId, index) =>
      db.update(menuCategories).set({ sortOrder: index }).where(eq(menuCategories.id, categoryId)),
    );
    await db.batch([first, ...rest]);
    revalidateSite();
    return { ok: true, data: null };
  } catch (error) {
    logActionError("reorderCategories", error);
    return fail("No se ha podido guardar el nuevo orden. Inténtalo otra vez.");
  }
}

/* ──────────────────────────────── Platos ──────────────────────────────── */

const nextItemOrder = (categoryId: string) =>
  sql<number>`(select coalesce(max(${menuItems.sortOrder}), -1) + 1 from ${menuItems} where ${menuItems.categoryId} = ${categoryId})`;

export async function createMenuItem(input: unknown): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = menuItemInputSchema.safeParse(input, { error: esErrorMap });
  if (!parsed.success) return validationFailure(parsed.error);
  const { price, soldOutToday, ...data } = parsed.data;

  try {
    const [row] = await db
      .insert(menuItems)
      .values({ ...data, priceCents: price, soldOutOn: soldOutToday ? todayInMadrid() : null, sortOrder: nextItemOrder(data.categoryId) })
      .returning({ id: menuItems.id });
    revalidateSite();
    return { ok: true, data: { id: row.id } };
  } catch (error) {
    if (pgErrorCode(error) === "23503") return fail("La categoría elegida ya no existe. Elige otra.", { categoryId: ["Elige otra categoría"] });
    logActionError("createMenuItem", error);
    return fail(SAVE_ERROR);
  }
}

export async function updateMenuItem(id: unknown, input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return fail("Plato no válido");
  const parsed = menuItemInputSchema.safeParse(input, { error: esErrorMap });
  if (!parsed.success) return validationFailure(parsed.error);
  const { price, soldOutToday, ...data } = parsed.data;

  try {
    const [current] = await db.select({ categoryId: menuItems.categoryId }).from(menuItems).where(eq(menuItems.id, parsedId.data)).limit(1);
    if (!current) return fail("Este plato ya no existe. Puede que se haya borrado.");
    const movedCategory = current.categoryId !== data.categoryId;
    await db
      .update(menuItems)
      .set({
        ...data,
        priceCents: price,
        soldOutOn: soldOutToday ? todayInMadrid() : null,
        // Si cambia de categoría, pasa al final de la nueva.
        ...(movedCategory ? { sortOrder: nextItemOrder(data.categoryId) } : {}),
      })
      .where(eq(menuItems.id, parsedId.data));
    revalidateSite();
    return { ok: true, data: null };
  } catch (error) {
    if (pgErrorCode(error) === "23503") return fail("La categoría elegida ya no existe. Elige otra.", { categoryId: ["Elige otra categoría"] });
    logActionError("updateMenuItem", error);
    return fail(SAVE_ERROR);
  }
}

export async function setMenuItemActive(id: unknown, isActive: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = z.object({ id: idSchema, isActive: z.boolean() }).safeParse({ id, isActive });
  if (!parsed.success) return fail("Datos no válidos");
  try {
    const updated = await db
      .update(menuItems)
      .set({ isActive: parsed.data.isActive })
      .where(eq(menuItems.id, parsed.data.id))
      .returning({ id: menuItems.id });
    if (updated.length === 0) return fail("Este plato ya no existe. Recarga la página.");
    revalidateSite();
    return { ok: true, data: null };
  } catch (error) {
    logActionError("setMenuItemActive", error);
    return fail(SAVE_ERROR);
  }
}

/** «Agotado hoy»: guarda la fecha de hoy (Madrid). Mañana deja de contar solo, sin tocar nada. */
export async function setMenuItemSoldOut(id: unknown, soldOut: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = z.object({ id: idSchema, soldOut: z.boolean() }).safeParse({ id, soldOut });
  if (!parsed.success) return fail("Datos no válidos");
  try {
    const updated = await db
      .update(menuItems)
      .set({ soldOutOn: parsed.data.soldOut ? todayInMadrid() : null })
      .where(eq(menuItems.id, parsed.data.id))
      .returning({ id: menuItems.id });
    if (updated.length === 0) return fail("Este plato ya no existe. Recarga la página.");
    revalidateSite();
    return { ok: true, data: null };
  } catch (error) {
    logActionError("setMenuItemSoldOut", error);
    return fail(SAVE_ERROR);
  }
}

/** Vuelve a poner disponibles todos los platos agotados. Devuelve cuántos había. */
export async function reactivateSoldOut(): Promise<ActionResult<{ count: number }>> {
  await requireAdmin();
  try {
    const updated = await db.update(menuItems).set({ soldOutOn: null }).where(isNotNull(menuItems.soldOutOn)).returning({ id: menuItems.id });
    revalidateSite();
    return { ok: true, data: { count: updated.length } };
  } catch (error) {
    logActionError("reactivateSoldOut", error);
    return fail(SAVE_ERROR);
  }
}

export async function deleteMenuItem(id: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return fail("Plato no válido");
  try {
    const deleted = await db.delete(menuItems).where(eq(menuItems.id, parsedId.data)).returning({ id: menuItems.id });
    if (deleted.length === 0) return fail("Este plato ya se había borrado.");
    revalidateSite();
    return { ok: true, data: null };
  } catch (error) {
    logActionError("deleteMenuItem", error);
    return fail("No se ha podido borrar. Inténtalo otra vez.");
  }
}

export async function reorderMenuItems(categoryId: unknown, ids: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = z.object({ categoryId: idSchema, ids: reorderSchema }).safeParse({ categoryId, ids });
  if (!parsed.success) return fail("Orden no válido");
  const { categoryId: catId, ids: order } = parsed.data;
  try {
    const current = await db.select({ id: menuItems.id }).from(menuItems).where(eq(menuItems.categoryId, catId));
    if (!sameSet(order, current.map((i) => i.id))) return fail(STALE);
    const [first, ...rest] = order.map((itemId, index) =>
      db
        .update(menuItems)
        .set({ sortOrder: index })
        .where(and(eq(menuItems.id, itemId), eq(menuItems.categoryId, catId))),
    );
    await db.batch([first, ...rest]);
    revalidateSite();
    return { ok: true, data: null };
  } catch (error) {
    logActionError("reorderMenuItems", error);
    return fail("No se ha podido guardar el nuevo orden. Inténtalo otra vez.");
  }
}

function sameSet(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  const set = new Set(b);
  return new Set(a).size === a.length && a.every((id) => set.has(id));
}
