import "server-only";
import { and, asc, eq, gte } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/lib/db";
import { events, menuCategories, menuItems, siteSettings, type EventCategory } from "@/lib/db/schema";
import { todayInMadrid } from "@/lib/format";
import { DEFAULT_SETTINGS, parseSettings, type SiteSettings } from "@/lib/settings";

/* Lecturas para la web pública. Las páginas son estáticas y se regeneran
 * cuando el panel llama a revalidatePath() tras guardar cambios. */

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const [row] = await db.select({ data: siteSettings.data }).from(siteSettings).where(eq(siteSettings.id, "main")).limit(1);
    return parseSettings(row?.data);
  } catch (error) {
    console.error("[getSiteSettings]", error);
    return DEFAULT_SETTINGS;
  }
});

export type PublicMenuItem = {
  id: string;
  name: string;
  description: string | null;
  priceCents: number | null;
  imageUrl: string | null;
  isPopular: boolean;
  isHomemade: boolean;
  award: string | null;
  allergens: string[];
};

export type PublicMenuCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  items: PublicMenuItem[];
};

export const getMenu = cache(async (): Promise<PublicMenuCategory[]> => {
  try {
    const rows = await db
      .select({
        category: {
          id: menuCategories.id,
          slug: menuCategories.slug,
          name: menuCategories.name,
          description: menuCategories.description,
        },
        item: {
          id: menuItems.id,
          name: menuItems.name,
          description: menuItems.description,
          priceCents: menuItems.priceCents,
          imageUrl: menuItems.imageUrl,
          isPopular: menuItems.isPopular,
          isHomemade: menuItems.isHomemade,
          award: menuItems.award,
          allergens: menuItems.allergens,
        },
      })
      .from(menuCategories)
      .innerJoin(menuItems, and(eq(menuItems.categoryId, menuCategories.id), eq(menuItems.isActive, true)))
      .where(eq(menuCategories.isActive, true))
      .orderBy(asc(menuCategories.sortOrder), asc(menuCategories.name), asc(menuItems.sortOrder), asc(menuItems.name));

    const categories = new Map<string, PublicMenuCategory>();
    for (const { category, item } of rows) {
      let entry = categories.get(category.id);
      if (!entry) {
        entry = { ...category, items: [] };
        categories.set(category.id, entry);
      }
      entry.items.push(item);
    }
    return [...categories.values()];
  } catch (error) {
    console.error("[getMenu]", error);
    return [];
  }
});

export type PublicEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  imageUrl: string | null;
  category: EventCategory;
  isFeatured: boolean;
};

/** Eventos activos de hoy en adelante (hora de Madrid), por fecha. */
export const getUpcomingEvents = cache(async (): Promise<PublicEvent[]> => {
  try {
    return await db
      .select({
        id: events.id,
        title: events.title,
        description: events.description,
        date: events.date,
        time: events.time,
        imageUrl: events.imageUrl,
        category: events.category,
        isFeatured: events.isFeatured,
      })
      .from(events)
      .where(and(eq(events.isActive, true), gte(events.date, todayInMadrid())))
      .orderBy(asc(events.date), asc(events.time));
  } catch (error) {
    console.error("[getUpcomingEvents]", error);
    return [];
  }
});

/** Evento destacado para la portada: el marcado como destacado o, si no hay, ninguno. */
export const getFeaturedEvent = cache(async (): Promise<PublicEvent | null> => {
  const upcoming = await getUpcomingEvents();
  return upcoming.find((e) => e.isFeatured) ?? null;
});
