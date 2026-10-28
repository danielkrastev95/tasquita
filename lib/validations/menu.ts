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

/** Precio escrito como en la carta: "16,50", "16.5", "16 €". Vacío = sin precio. */
const priceSchema = z
  .string()
  .max(20)
  .nullish()
  .transform((value, ctx) => {
    const raw = value?.trim() ?? "";
    if (!raw) return null;
    const cents = /^\d{1,5}([.,]\d{1,2})?\s*€?$/.test(raw) ? parsePriceToCents(raw) : null;
    if (cents == null || cents > 1_000_000) {
      ctx.addIssue({ code: "custom", message: "Escribe el precio así: 12,50 (o déjalo vacío)" });
      return z.NEVER;
    }
    return cents;
  });

export const menuItemInputSchema = z.object({
  categoryId: z.string().min(1, "Elige una categoría").pipe(idSchema),
  name: z.string().trim().min(1, "Escribe el nombre del plato").max(120),
  description: multilineText(1000),
  price: priceSchema,
  imageUrl: imageUrlSchema,
  isPopular: z.boolean().default(false),
  isHomemade: z.boolean().default(false),
  award: optionalText(80),
  allergens: z
    .array(z.enum(ALLERGEN_CODES))
    .max(ALLERGEN_CODES.length)
    .default([])
    .transform((list) => [...new Set(list)].sort((a, b) => (ALLERGEN_ORDER.get(a) ?? 0) - (ALLERGEN_ORDER.get(b) ?? 0))),
  isActive: z.boolean().default(true),
});
export type MenuItemInput = z.input<typeof menuItemInputSchema>;

/** Nuevo orden: lista completa de ids en el orden deseado. */
export const reorderSchema = z.array(idSchema).min(1).max(500);
