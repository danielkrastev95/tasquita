import "server-only";
import { revalidatePath } from "next/cache";
import type { ActionFailure } from "@/lib/validations/common";

/** Regenera toda la web pública (páginas estáticas con ISR) y el propio panel. */
export function revalidateSite() {
  revalidatePath("/", "layout");
}

export const fail = (error: string, fieldErrors?: ActionFailure["fieldErrors"]): ActionFailure => ({ ok: false, error, fieldErrors });

export const SAVE_ERROR = "No se ha podido guardar. Comprueba la conexión e inténtalo otra vez.";

/** Código de error de Postgres (p. ej. "23505" = valor duplicado), venga envuelto o no por Drizzle. */
export function pgErrorCode(error: unknown): string | undefined {
  let current: unknown = error;
  for (let depth = 0; current && typeof current === "object" && depth < 4; depth++) {
    const code = (current as { code?: unknown }).code;
    if (typeof code === "string" && /^[0-9A-Z]{5}$/.test(code)) return code;
    current = (current as { cause?: unknown }).cause;
  }
  return undefined;
}

/** Registra el fallo en el servidor (logs de Vercel) sin filtrar detalles al cliente. */
export function logActionError(action: string, error: unknown) {
  console.error(`[admin:${action}]`, error);
}
