import { z } from "zod";
import type { EventCategory } from "@/lib/db/schema";
import { imageUrlSchema, multilineText } from "./common";

// Solo tipos de lib/db/schema: este módulo también lo usan componentes de cliente.
export const EVENT_CATEGORY_LABELS = {
  musica: "Música en vivo",
  gastronomia: "Gastronomía",
  deporte: "Deporte",
  especial: "Especial",
} as const satisfies Record<EventCategory, string>;

export const EVENT_CATEGORY_OPTIONS = Object.keys(EVENT_CATEGORY_LABELS) as [EventCategory, ...EventCategory[]];

const HH_MM = /^([01]\d|2[0-3]):[0-5]\d$/;

export const eventInputSchema = z.object({
  title: z.string().trim().min(1, "Ponle un título al evento").max(120),
  description: multilineText(2000),
  date: z.iso.date({ error: "Elige el día del evento" }),
  time: z.string().regex(HH_MM, "Elige la hora de inicio"),
  category: z.enum(EVENT_CATEGORY_OPTIONS, { error: "Elige el tipo de evento" }),
  imageUrl: imageUrlSchema,
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});
export type EventInput = z.input<typeof eventInputSchema>;
