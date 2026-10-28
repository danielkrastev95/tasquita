import { and, desc, eq, gt } from "drizzle-orm";
import type { Metadata } from "next";
import { AccountForm } from "@/components/auth/security/AccountForm";
import { AuthenticatorSection } from "@/components/auth/security/AuthenticatorSection";
import { BackupCodesSection } from "@/components/auth/security/BackupCodesSection";
import { ChangePasswordForm } from "@/components/auth/security/ChangePasswordForm";
import { SessionsSection, type SessionItem } from "@/components/auth/security/SessionsSection";
import { SignOutButton } from "@/components/auth/security/SignOutButton";
import { describeDevice, parseUserAgent } from "@/components/auth/user-agent";
import { Card, CardTitle, PageHeader } from "@/components/ui/Card";
import { auth } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { revokeOtherSessionsAction, revokeSessionAction } from "./actions";

export const metadata: Metadata = { title: "Seguridad" };

const TIME_ZONE = "Europe/Madrid";
const dayKey = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" });
const shortDate = new Intl.DateTimeFormat("es-ES", { timeZone: TIME_ZONE, day: "numeric", month: "short", year: "numeric" });

/** Better Auth solo renueva la sesión una vez al día: la última actividad se muestra con precisión de día. */
function lastUsed(date: Date, now: Date) {
  const days = Math.round((Date.parse(dayKey.format(now)) - Date.parse(dayKey.format(date))) / 86_400_000);
  if (days <= 0) return "Último uso: hoy";
  if (days === 1) return "Último uso: ayer";
  if (days < 30) return `Último uso: hace ${days} días`;
  return `Último uso: ${shortDate.format(date)}`;
}

/** Better Auth guarda las IPv6 expandidas y recortadas a /64: se muestran en su forma corta ("2a0c:5a80::"). */
function formatIp(ip: string | null) {
  if (!ip || !ip.includes(":")) return ip;
  const groups = ip.split(":").map((group) => group.replace(/^0+(?=.)/, ""));
  if (groups.every((group) => group === "0")) return null; // sin IP real (p. ej. en local)
  // Sustituye la racha de ceros más larga por "::"
  let best = { start: -1, length: 1 };
  for (let i = 0; i < groups.length; i++) {
    let j = i;
    while (groups[j] === "0") j++;
    if (j - i > best.length) best = { start: i, length: j - i };
  }
  if (best.start === -1) return groups.join(":");
  return `${groups.slice(0, best.start).join(":")}::${groups.slice(best.start + best.length).join(":")}`;
}

export default async function SecurityPage() {
  const { session, user } = await requireAdmin();
  const now = new Date();

  const [rows, backup] = await Promise.all([
    db
      .select({
        id: schema.sessions.id,
        userAgent: schema.sessions.userAgent,
        ipAddress: schema.sessions.ipAddress,
        createdAt: schema.sessions.createdAt,
        updatedAt: schema.sessions.updatedAt,
      })
      .from(schema.sessions)
      .where(and(eq(schema.sessions.userId, user.id), gt(schema.sessions.expiresAt, now)))
      .orderBy(desc(schema.sessions.updatedAt)),
    // Solo se usa para contar cuántos quedan: los códigos nunca salen del servidor
    auth.api.viewBackupCodes({ body: { userId: user.id } }).catch(() => null),
  ]);

  const sessions: SessionItem[] = rows
    .map((row) => {
      const parsed = parseUserAgent(row.userAgent);
      const current = row.id === session.id;
      const seen = row.updatedAt > row.createdAt ? row.updatedAt : row.createdAt;
      return {
        id: row.id,
        label: describeDevice(parsed),
        device: parsed.device,
        details: [formatIp(row.ipAddress) && `IP ${formatIp(row.ipAddress)}`, current ? "Activa ahora" : lastUsed(seen, now)]
          .filter(Boolean)
          .join(" · "),
        current,
      };
    })
    .sort((a, b) => Number(b.current) - Number(a.current));

  return (
    <div className="max-w-3xl">
      <PageHeader title="Seguridad" description="Tu cuenta, tu contraseña, la verificación en dos pasos y los dispositivos con acceso al panel." />

      <div className="space-y-5">
        <Card>
          <CardTitle>Tu cuenta</CardTitle>
          <AccountForm name={user.name} email={user.email} />
        </Card>

        <Card>
          <CardTitle description="Usa al menos 10 caracteres. Una frase de varias palabras es fácil de recordar y muy segura.">
            Contraseña
          </CardTitle>
          <ChangePasswordForm email={user.email} name={user.name} />
        </Card>

        <Card>
          <CardTitle description="Al entrar desde un dispositivo nuevo te pedimos, además de la contraseña, el código de tu app de autenticación.">
            Verificación en dos pasos
          </CardTitle>
          <AuthenticatorSection />
        </Card>

        <Card>
          <CardTitle description="Sirven para entrar si no tienes el móvil a mano. Cada código vale una sola vez.">
            Códigos de respaldo
          </CardTitle>
          <BackupCodesSection remaining={backup?.backupCodes.length ?? null} email={user.email} />
        </Card>

        <Card>
          <CardTitle description="Dispositivos donde has entrado al panel y siguen con la sesión abierta.">Sesiones abiertas</CardTitle>
          <SessionsSection sessions={sessions} revokeSession={revokeSessionAction} revokeOtherSessions={revokeOtherSessionsAction} />
        </Card>

        <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">Cerrar sesión</h2>
            <p className="text-sm leading-relaxed text-ink-muted">Sal del panel en este dispositivo. Para volver tendrás que entrar de nuevo.</p>
          </div>
          <SignOutButton className="w-full shrink-0 sm:w-auto" />
        </Card>
      </div>
    </div>
  );
}
