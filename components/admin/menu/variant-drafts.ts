import { centsToInput } from "@/lib/format";

/* Compartido por el servidor (carga de la ficha) y el editor de medidas (cliente). */

export type VariantDraft = { key: string; label: string; price: string };

/** Claves deterministas al cargar (sin desajustes entre servidor y navegador). */
export const toVariantDrafts = (variants: { label: string; priceCents: number }[]): VariantDraft[] =>
  variants.map((v, i) => ({ key: `v${i}`, label: v.label, price: centsToInput(v.priceCents) }));
