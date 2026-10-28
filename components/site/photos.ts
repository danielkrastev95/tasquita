import type { PublicMenuCategory } from "@/lib/data/public";

/* Selección de fotos: primero las reales (ajustes y carta); Unsplash solo como último recurso. */

export type Photo = { src: string; alt: string };

const STOCK_FOOD: Photo = {
  src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80",
  alt: "Plato de cocina casera",
};

/** Fotos reales de la carta, ordenadas por interés: premiadas, más pedidas y el resto. */
export function menuPhotos(menu: PublicMenuCategory[]): Photo[] {
  const items = menu.flatMap((c) => c.items).filter((i) => i.imageUrl);
  const score = (i: (typeof items)[number]) => (i.award ? 2 : 0) + (i.isPopular ? 1 : 0);
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => score(b.item) - score(a.item) || a.index - b.index)
    .map(({ item }) => ({ src: item.imageUrl!, alt: item.name }));
}

/** Primera foto disponible que no repita ninguna de `exclude`. */
export function pickPhoto(candidates: Photo[], exclude: (string | null | undefined)[] = []): Photo | null {
  const used = new Set(exclude.filter(Boolean));
  return candidates.find((p) => !used.has(p.src)) ?? null;
}

export function heroPhotos(settings: { heroImage1: string | null; heroImage2: string | null; name: string }, menu: PublicMenuCategory[]) {
  const fromMenu = menuPhotos(menu);
  const main: Photo = settings.heroImage1
    ? { src: settings.heroImage1, alt: `Especialidad de ${settings.name}` }
    : (pickPhoto(fromMenu) ?? STOCK_FOOD);
  const secondary: Photo | null = settings.heroImage2
    ? { src: settings.heroImage2, alt: `Cocina de ${settings.name}` }
    : pickPhoto(fromMenu, [main.src]);
  return { main, secondary };
}
