import { z } from "zod";

export const updateSettingsSchema = z.object({
  eventsEnabled: z.boolean().optional(),
  heroEventEnabled: z.boolean().optional(),
  aboutTitle: z.string().min(1, "El título es requerido").max(200).optional(),
  aboutSubtitle: z.string().min(1, "El subtítulo es requerido").max(500).optional(),
  aboutParagraph1: z.string().min(1, "Este campo es requerido").max(2000).optional(),
  aboutParagraph2: z.string().min(1, "Este campo es requerido").max(2000).optional(),
  aboutQuote: z.string().min(1, "La cita es requerida").max(500).optional(),
  aboutQuoteAuthor: z.string().min(1, "El autor es requerido").max(100).optional(),
  yearFounded: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  addressStreet: z.string().min(1, "La dirección es requerida").max(200).optional(),
  addressCity: z.string().min(1, "La ciudad es requerida").max(100).optional(),
  addressPostalCode: z.string().min(1, "El código postal es requerido").max(10).optional(),
  instagramHandle: z.string().min(1, "El usuario de Instagram es requerido").max(50).optional(),
  heroTitle: z.string().min(1, "El título es requerido").max(200).optional(),
  heroSubtitle: z.string().min(1, "El subtítulo es requerido").max(500).optional(),
  schedule: z.string().optional(),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
