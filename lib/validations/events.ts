import { z } from "zod";

const safeUrl = z
  .string()
  .url("URL de imagen inválida")
  .refine((url) => /^https?:\/\//i.test(url), "Solo se permiten URLs HTTP/HTTPS");

export const createEventSchema = z.object({
  title: z.string().min(1, "El título es requerido").max(200),
  description: z.string().min(1, "La descripción es requerida").max(2000),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido"),
  time: z.string().min(1, "La hora es requerida").max(20),
  category: z.enum(["musica", "gastronomia", "especial"], {
    errorMap: () => ({ message: "Categoría inválida" }),
  }),
  image: safeUrl.nullable().optional(),
  isFeatured: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
});

export const updateEventSchema = createEventSchema.partial();

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
