import { z } from "zod";

/** URL that only allows http/https protocols (blocks javascript:, data:, etc.) */
const safeUrl = z
  .string()
  .url("URL inválida")
  .refine((url) => /^https?:\/\//i.test(url), "Solo se permiten URLs HTTP/HTTPS");

/** Optional nullable URL field — accepts valid URL, empty string, null, or undefined */
const optionalSafeUrl = safeUrl.optional().nullable().or(z.literal(""));

const scheduleItemSchema = z.object({
  day: z.string().min(1).max(50),
  hours: z.string().min(1).max(100),
});

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
  value1Title: z.string().min(1, "El título es requerido").max(100).optional(),
  value1Description: z.string().min(1, "La descripción es requerida").max(200).optional(),
  value2Title: z.string().min(1, "El título es requerido").max(100).optional(),
  value2Description: z.string().min(1, "La descripción es requerida").max(200).optional(),
  value3Title: z.string().min(1, "El título es requerido").max(100).optional(),
  value3Description: z.string().min(1, "La descripción es requerida").max(200).optional(),
  addressStreet: z.string().min(1, "La dirección es requerida").max(200).optional(),
  addressCity: z.string().min(1, "La ciudad es requerida").max(100).optional(),
  addressPostalCode: z.string().min(1, "El código postal es requerido").max(10).optional(),
  instagramHandle: z.string().min(1, "El usuario de Instagram es requerido").max(50).optional(),
  heroTitle: z.string().min(1, "El título es requerido").max(200).optional(),
  heroSubtitle: z.string().min(1, "El subtítulo es requerido").max(500).optional(),
  heroTagline: z.string().max(500).optional().nullable(),
  heroMarquee: z.string().max(200).optional().nullable(),
  heroImage1: optionalSafeUrl,
  heroImage2: optionalSafeUrl,
  aboutImage1: optionalSafeUrl,
  aboutImage2: optionalSafeUrl,
  aboutImage3: optionalSafeUrl,
  contactImage: optionalSafeUrl,
  glovoUrl: optionalSafeUrl,
  uberEatsUrl: optionalSafeUrl,
  phone: z.string().max(30).optional().nullable(),
  footerTagline: z.string().max(300).optional().nullable(),
  footerEstLabel: z.string().max(100).optional().nullable(),
  heroBadge: z.string().max(100).optional().nullable(),
  heroCtaText: z.string().max(50).optional().nullable(),
  heroDeliveryLabel: z.string().max(50).optional().nullable(),
  heroKitchenLabel: z.string().max(50).optional().nullable(),
  aboutHeroTitle: z.string().max(100).optional().nullable(),
  aboutValuesTitle: z.string().max(100).optional().nullable(),
  contactSectionTitle: z.string().max(100).optional().nullable(),
  contactPhoneLabel: z.string().max(50).optional().nullable(),
  contactSocialLabel: z.string().max(50).optional().nullable(),
  eventsOrgTitle: z.string().max(100).optional().nullable(),
  eventsOrgDesc: z.string().max(500).optional().nullable(),
  eventsOrgCta: z.string().max(50).optional().nullable(),
  schedule: z
    .string()
    .max(5000)
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        try {
          const parsed = JSON.parse(val);
          return (
            Array.isArray(parsed) &&
            parsed.every((item: unknown) => scheduleItemSchema.safeParse(item).success)
          );
        } catch {
          return false;
        }
      },
      "Formato de horario inválido — debe ser un array JSON de {day, hours}"
    ),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
