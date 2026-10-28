const DUMMY_ORIGIN = "https://panel.invalid";

/**
 * Devuelve `next` solo si es una ruta interna del panel (empieza por /admin); si no, null.
 * Evita redirecciones abiertas (`//evil.com`, `/\evil.com`, `https://…`) y bucles hacia el login.
 */
export function safeNextPath(value: unknown): string | null {
  if (typeof value !== "string" || value.length === 0 || value.length > 512) return null;
  if (!value.startsWith("/admin") || value.startsWith("//") || value.includes("\\")) return null;
  try {
    const url = new URL(value, DUMMY_ORIGIN);
    if (url.origin !== DUMMY_ORIGIN) return null;
    const { pathname } = url;
    if (pathname !== "/admin" && !pathname.startsWith("/admin/")) return null;
    if (pathname.startsWith("/admin/login") || pathname.startsWith("/admin/activar-2fa")) return null;
    return `${pathname}${url.search}`;
  } catch {
    return null;
  }
}
