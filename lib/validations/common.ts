import { z } from "zod";

/* Piezas compartidas por las validaciones y las server actions del panel. */

export type FieldErrors = Record<string, string[]>;

export type ActionFailure = { ok: false; error: string; fieldErrors?: FieldErrors };

/** Resultado tipado de todas las server actions del panel. */
export type ActionResult<T = null> = { ok: true; data: T } | ActionFailure;

/** Mensajes de error claros y en español para los fallos genéricos de zod. */
export const esErrorMap: z.core.$ZodErrorMap = (issue) => {
  switch (issue.code) {
    case "too_small":
      if (issue.origin === "string") return Number(issue.minimum) <= 1 ? "Este campo es obligatorio" : `Escribe al menos ${issue.minimum} caracteres`;
      if (issue.origin === "array" || issue.origin === "set") return `Añade al menos ${issue.minimum}`;
      return `Debe ser ${issue.minimum} o más`;
    case "too_big":
      if (issue.origin === "string") return `Como máximo ${issue.maximum} caracteres`;
      if (issue.origin === "array" || issue.origin === "set") return `Como máximo ${issue.maximum}`;
      return `Debe ser ${issue.maximum} o menos`;
    case "invalid_format":
      if (issue.format === "email") return "Escribe un correo válido (ejemplo@dominio.com)";
      if (issue.format === "url") return "Escribe un enlace completo que empiece por https://";
      if (issue.format === "date") return "Elige una fecha válida";
      return "El formato no es válido";
    case "invalid_type":
      if (issue.input === undefined || issue.input === null) return "Este campo es obligatorio";
      if (issue.expected === "number") return "Escribe un número";
      return "Valor no válido";
    case "invalid_value":
      return "Elige una opción válida";
    default:
      return undefined;
  }
};

/** Convierte un ZodError en { "campo": ["mensaje"], "lista.0.titulo": [...] }. */
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.map(String).join(".") || "_";
    (out[key] ??= []).push(issue.message);
  }
  return out;
}

export function validationFailure(error: z.ZodError, message = "Revisa los campos marcados"): ActionFailure {
  return { ok: false, error: message, fieldErrors: toFieldErrors(error) };
}

/** Identificador de fila (uuid de Postgres). `guid` acepta cualquier uuid bien formado. */
export const idSchema = z.guid({ error: "Identificador no válido" });

/** Texto opcional: recorta espacios y guarda `null` si queda vacío. */
export const optionalText = (max: number) =>
  z
    .string()
    .max(max)
    .nullish()
    .transform((v) => {
      const trimmed = v?.trim() ?? "";
      return trimmed ? trimmed : null;
    });

/** Texto largo: respeta saltos de línea, normaliza finales de línea y quita espacios sobrantes. */
export const multilineText = (max: number) =>
  z
    .string()
    .max(max)
    .nullish()
    .transform((v) =>
      (v ?? "")
        .replace(/\r\n?/g, "\n")
        .split("\n")
        .map((line) => line.trimEnd())
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim(),
    );

/** URL de imagen opcional (solo https). Vacío → null. */
export const imageUrlSchema = z
  .union([z.url({ protocol: /^https$/, error: "La imagen debe ser un enlace https://" }), z.literal("")])
  .nullish()
  .transform((v) => (v ? v : null));

/** Quita acentos y deja solo [a-z0-9-]: "Un Poco de Mar" → "un-poco-de-mar". */
export function slugify(input: string): string {
  return (
    input
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/ñ/g, "n")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60)
      .replace(/-+$/g, "") || "categoria"
  );
}
