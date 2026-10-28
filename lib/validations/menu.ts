import { z } from "zod";
import { ALLERGENS, ALLERGEN_CODES } from "@/lib/allergens";
import { parsePriceToCents } from "@/lib/format";
import { idSchema, imageUrlSchema, multilineText, optionalText } from "./common";

const ALLERGEN_ORDER = new Map<string, number>(ALLERGENS.map((a, i) => [a.code, i]));

export const categoryInputSchema = z.object({
  name: z.string().trim().min(1, "Ponle un nombre a la categoría").max(60),
  description: optionalText(300),
  isActive: z.boolean().default(true),
});
export type CategoryInput = z.input<typeof categoryInputSchema>;

/** Precio escrito como en la carta: "16,50", "16.5", "16 €". */
export const PRICE_PATTERN = /^\d{1,5}([.,]\d{1,2})?\s*€?$/;
const PRICE_HELP = "Escribe el precio así: 12,50";

const toCents = (raw: string) => (PRICE_PATTERN.test(raw) ? parsePriceToCents(raw) : null);

/** Precio opcional: vacío = sin precio. */
export const optionalPriceSchema = z
  .string()
  .max(20)
  .nullish()
  .transform((value, ctx) => {
    const raw = value?.trim() ?? "";
    if (!raw) return null;
    const cents = toCents(raw);
    if (cents == null || cents > 1_000_000) {
      ctx.addIssue({ code: "custom", message: `${PRICE_HELP} (o déjalo vacío)` });
      return z.NEVER;
    }
    return cents;
  });

/** Precio obligatorio (p. ej. el de una medida). */
const requiredPriceSchema = z
  .string()
  .max(20)
  .transform((value, ctx) => {
    const raw = value.trim();
    const cents = raw ? toCents(raw) : null;
    if (cents == null || cents > 1_000_000) {
      ctx.addIssue({ code: "custom", message: raw ? PRICE_HELP : "Pon el precio de esta medida" });
      return z.NEVER;
    }
    return cents;
  });

/** Sugerencias rápidas de medidas en la ficha del plato. */
export const VARIANT_SUGGESTIONS = ["Tapa", "Media", "Ración", "Copa", "Botella"] as const;
export const MAX_VARIANTS = 6;

const priceVariantsSchema = z
  .array(
    z.object({
      label: z.string().trim().min(1, "Ponle nombre (Tapa, Media…)").max(30),
      price: requiredPriceSchema,
    }),
  )
  .max(MAX_VARIANTS, `Como máximo ${MAX_VARIANTS} medidas`)
  .default([])
  .superRefine((variants, ctx) => {
    const seen = new Map<string, number>();
    variants.forEach((v, index) => {
      const key = v.label.trim().toLocaleLowerCase("es");
      if (seen.has(key)) ctx.addIssue({ code: "custom", path: [index, "label"], message: "Esta medida ya está en la lista" });
      else seen.set(key, index);
    });
  })
  .transform((variants) => variants.map((v) => ({ label: v.label, priceCents: v.price })));

export const menuItemInputSchema = z.object({
  categoryId: z.string().min(1, "Elige una categoría").pipe(idSchema),
  name: z.string().trim().min(1, "Escribe el nombre del plato").max(120),
  description: multilineText(1000),
  price: optionalPriceSchema,
  priceVariants: priceVariantsSchema,
  imageUrl: imageUrlSchema,
  isPopular: z.boolean().default(false),
  isHomemade: z.boolean().default(false),
  isNew: z.boolean().default(false),
  award: optionalText(80),
  allergens: z
    .array(z.enum(ALLERGEN_CODES))
    .max(ALLERGEN_CODES.length)
    .default([])
    .transform((list) => [...new Set(list)].sort((a, b) => (ALLERGEN_ORDER.get(a) ?? 0) - (ALLERGEN_ORDER.get(b) ?? 0))),
  isActive: z.boolean().default(true),
  /** "Agotado hoy": se guarda la fecha de hoy (Madrid) y se reinicia solo mañana. */
  soldOutToday: z.boolean().default(false),
});
export type MenuItemInput = z.input<typeof menuItemInputSchema>;

/** Nuevo orden: lista completa de ids en el orden deseado. */
export const reorderSchema = z.array(idSchema).min(1).max(500);
