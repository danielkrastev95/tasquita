import { z } from "zod";

export const createMenuItemSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(200),
  description: z.string().max(500).nullable().optional(),
  price: z.string().max(20).nullable().optional(),
  image: z.string().url("URL de imagen inválida").nullable().optional(),
  categoryId: z.string().min(1, "La categoría es requerida"),
  isPopular: z.boolean().optional().default(false),
  isHomemade: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.number().int().nonnegative().optional().default(0),
  award: z.string().max(500).nullable().optional(),
});

export const updateMenuItemSchema = createMenuItemSchema.partial().extend({
  categoryId: z.string().optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(200),
  slug: z.string().min(1, "El slug es requerido").max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido"),
  description: z.string().max(500).nullable().optional(),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.number().int().nonnegative().optional().default(0),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
