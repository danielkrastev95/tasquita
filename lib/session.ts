import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "@/lib/auth";

/** Sesión actual (o null). Deduplicada por petición. */
export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

/**
 * Exige sesión con 2FA ya activado. Úsalo al principio de TODAS las páginas del panel
 * y de TODAS las server actions / route handlers de administración.
 */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (!session.user.twoFactorEnabled) redirect("/admin/activar-2fa");
  return session;
}

/** Exige sesión pero permite que el 2FA aún no esté configurado (solo para /admin/activar-2fa). */
export async function requireSessionForSetup() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

/** Variante para route handlers: devuelve null en vez de redirigir. */
export async function getAdminOrNull() {
  const session = await getSession();
  if (!session || !session.user.twoFactorEnabled) return null;
  return session;
}
