"use server";

import { createHmac, timingSafeEqual } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { refresh } from "next/cache";
import { cookies, headers } from "next/headers";
import * as z from "zod";
import { TRUSTED_DEVICE_PREFIX, auth, forgetTrustedDevices } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export type ActionResult = { ok: true } | { ok: false; error: string };

const sessionIdSchema = z.string().min(1).max(200);

/** Cierra la sesión de otro dispositivo (solo si es de la misma cuenta). */
export async function revokeSessionAction(sessionId: unknown): Promise<ActionResult> {
  const current = await requireAdmin();
  const parsed = sessionIdSchema.safeParse(sessionId);
  if (!parsed.success) return { ok: false, error: "No se ha encontrado esa sesión." };
  if (parsed.data === current.session.id) return { ok: false, error: "Para salir de este dispositivo usa «Cerrar sesión»." };

  const [target] = await db
    .select({ token: schema.sessions.token })
    .from(schema.sessions)
    .where(and(eq(schema.sessions.id, parsed.data), eq(schema.sessions.userId, current.user.id)))
    .limit(1);
  if (target) await auth.api.revokeSession({ headers: await headers(), body: { token: target.token } });

  refresh();
  return { ok: true };
}

/** Cierra todas las sesiones salvo esta y olvida los demás "dispositivos de confianza". */
export async function revokeOtherSessionsAction(): Promise<ActionResult> {
  const current = await requireAdmin();
  await auth.api.revokeOtherSessions({ headers: await headers() });
  await forgetTrustedDevices(current.user.id, await currentTrustedDeviceId());
  refresh();
  return { ok: true };
}

/**
 * Identificador del "dispositivo de confianza" de ESTE navegador, para no olvidarlo al cerrar las demás sesiones.
 * La cookie la firma Better Auth: "<hmac>!<identificador>.<firma HMAC-SHA256 en base64>".
 */
async function currentTrustedDeviceId(): Promise<string | null> {
  const secret = process.env.BETTER_AUTH_SECRET;
  const store = await cookies();
  const raw = store.get("__Secure-better-auth.trust_device")?.value ?? store.get("better-auth.trust_device")?.value;
  if (!secret || !raw) return null;

  let value = raw;
  try {
    value = decodeURIComponent(raw);
  } catch {
    return null;
  }
  const dot = value.lastIndexOf(".");
  if (dot < 1) return null;
  const payload = value.slice(0, dot);
  const signature = Buffer.from(value.slice(dot + 1), "base64");
  const expected = createHmac("sha256", secret).update(payload).digest();
  if (signature.length !== expected.length || !timingSafeEqual(signature, expected)) return null;

  const identifier = payload.split("!")[1];
  return identifier?.startsWith(TRUSTED_DEVICE_PREFIX) ? identifier : null;
}
