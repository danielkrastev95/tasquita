import "server-only";
import { asc, desc, eq, gte, lt, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { events, menuCategories, menuItems, siteSettings, type EventCategory } from "@/lib/db/schema";
import { todayInMadrid } from "@/lib/format";
import { parseSettings, type SiteSettings } from "@/lib/settings";
import { idSchema } from "@/lib/validations/common";

/*
 * Lecturas del panel. Sin caché: siempre datos frescos de la BD.
 * (Las páginas del panel son dinámicas porque requireAdmin() lee las cabeceras.)
 */

export type AdminMenuItem = {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  priceCents: number | null;
  imageUrl: string | null;
  isPopular: boolean;
  isHomemade: boolean;
  award: string | null;
  allergens: string[];
  sortOrder: number;
  isActive: boolean;
};

export type AdminMenuCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  items: AdminMenuItem[];
};

export type CategoryOption = { id: string; name: string; isActive: boolean };

const itemColumns = {
  id: menuItems.id,
  categoryId: menuItems.categoryId,
  name: menuItems.name,
  description: menuItems.description,
  priceCents: menuItems.priceCents,
  imageUrl: menuItems.imageUrl,
  isPopular: menuItems.isPopular,
  isHomemade: menuItems.isHomemade,
  award: menuItems.award,
  allergens: menuItems.allergens,
  sortOrder: menuItems.sortOrder,
  isActive: menuItems.isActive,
};

const categoryColumns = {
  id: menuCategories.id,
  slug: menuCategories.slug,
  name: menuCategories.name,
  description: menuCategories.description,
  sortOrder: menuCategories.sortOrder,
  isActive: menuCategories.isActive,
};

/** Toda la carta (también lo oculto), en el orden en que se ve en la web. */
export async function getAdminMenu(): Promise<AdminMenuCategory[]> {
  const [categories, items] = await Promise.all([
    db.select(categoryColumns).from(menuCategories).orderBy(asc(menuCategories.sortOrder), asc(menuCategories.name)),
    db.select(itemColumns).from(menuItems).orderBy(asc(menuItems.sortOrder), asc(menuItems.name)),
  ]);
  const byCategory = new Map<string, AdminMenuItem[]>();
  for (const item of items) {
    const list = byCategory.get(item.categoryId);
    if (list) list.push(item);
    else byCategory.set(item.categoryId, [item]);
  }
  return categories.map((c) => ({ ...c, items: byCategory.get(c.id) ?? [] }));
}

export async function getCategoryOptions(): Promise<CategoryOption[]> {
  return db
    .select({ id: menuCategories.id, name: menuCategories.name, isActive: menuCategories.isActive })
    .from(menuCategories)
    .orderBy(asc(menuCategories.sortOrder), asc(menuCategories.name));
}

export async function getMenuItem(id: string): Promise<AdminMenuItem | null> {
  if (!idSchema.safeParse(id).success) return null;
  const [item] = await db.select(itemColumns).from(menuItems).where(eq(menuItems.id, id)).limit(1);
  return item ?? null;
}

export type AdminEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  imageUrl: string | null;
  category: EventCategory;
  isFeatured: boolean;
  isActive: boolean;
};

const eventColumns = {
  id: events.id,
  title: events.title,
  description: events.description,
  date: events.date,
  time: events.time,
  imageUrl: events.imageUrl,
  category: events.category,
  isFeatured: events.isFeatured,
  isActive: events.isActive,
};

/** Próximos (de hoy en adelante, hora de Madrid) y pasados (los más recientes primero). */
export async function getAdminEvents(): Promise<{ upcoming: AdminEvent[]; past: AdminEvent[]; today: string }> {
  const today = todayInMadrid();
  const [upcoming, past] = await Promise.all([
    db.select(eventColumns).from(events).where(gte(events.date, today)).orderBy(asc(events.date), asc(events.time)),
    db.select(eventColumns).from(events).where(lt(events.date, today)).orderBy(desc(events.date), desc(events.time)),
  ]);
  return { upcoming, past, today };
}

export async function getEvent(id: string): Promise<AdminEvent | null> {
  if (!idSchema.safeParse(id).success) return null;
  const [event] = await db.select(eventColumns).from(events).where(eq(events.id, id)).limit(1);
  return event ?? null;
}

export async function getAdminSettings(): Promise<SiteSettings> {
  const [row] = await db.select({ data: siteSettings.data }).from(siteSettings).where(eq(siteSettings.id, "main")).limit(1);
  return parseSettings(row?.data);
}

export type DashboardData = {
  settings: SiteSettings;
  stats: { visibleItems: number; hiddenItems: number; categories: number; hiddenCategories: number; upcomingEvents: number };
  nextEvents: AdminEvent[];
};

export async function getDashboardData(): Promise<DashboardData> {
  const today = todayInMadrid();
  const [settings, items, categories, upcoming] = await Promise.all([
    getAdminSettings(),
    db.select({ isActive: menuItems.isActive, categoryActive: menuCategories.isActive }).from(menuItems).innerJoin(menuCategories, eq(menuItems.categoryId, menuCategories.id)),
    db.select({ isActive: menuCategories.isActive }).from(menuCategories),
    db
      .select(eventColumns)
      .from(events)
      .where(and(gte(events.date, today), eq(events.isActive, true)))
      .orderBy(asc(events.date), asc(events.time)),
  ]);
  // Un plato solo se ve si él y su categoría están visibles.
  const visibleItems = items.filter((i) => i.isActive && i.categoryActive).length;
  return {
    settings,
    stats: {
      visibleItems,
      hiddenItems: items.length - visibleItems,
      categories: categories.length,
      hiddenCategories: categories.filter((c) => !c.isActive).length,
      upcomingEvents: upcoming.length,
    },
    nextEvents: upcoming.slice(0, 3),
  };
}
