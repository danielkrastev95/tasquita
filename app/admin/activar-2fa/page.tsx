import { and, eq } from "drizzle-orm";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { TwoFactorSetup } from "@/components/auth/TwoFactorSetup";
import { parseUserAgent } from "@/components/auth/user-agent";
import { db, schema } from "@/lib/db";
import { requireSessionForSetup } from "@/lib/session";

export const metadata: Metadata = { title: "Activar la verificación en dos pasos" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function ActivateTwoFactorPage({ searchParams }: Props) {
  const session = await requireSessionForSetup();
  const [{ paso }, requestHeaders] = await Promise.all([searchParams, headers()]);
  // En el móvil se prioriza el botón "Abrir en mi app" (no puedes escanear tu propia pantalla)
  const { platform } = parseUserAgent(requestHeaders.get("user-agent"));

  if (session.user.twoFactorEnabled) {
    // Ya activada: solo se vuelve aquí al recargar la pantalla de los códigos de respaldo
    if (paso !== "codigos") redirect("/admin");
    return (
      <AuthShell size="md">
        <TwoFactorSetup mode="codes" email={session.user.email} platform={platform} hasPendingSetup={false} />
      </AuthShell>
    );
  }

  // ¿Se empezó (se generó la clave) pero no se llegó a verificar el código? → se reanuda con la misma clave
  const [pendingSetup] = await db
    .select({ id: schema.twoFactors.id })
    .from(schema.twoFactors)
    .where(and(eq(schema.twoFactors.userId, session.user.id), eq(schema.twoFactors.verified, false)))
    .limit(1);

  return (
    <AuthShell size="md">
      <TwoFactorSetup email={session.user.email} platform={platform} hasPendingSetup={Boolean(pendingSetup)} />
    </AuthShell>
  );
}
