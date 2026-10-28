import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";
import { safeNextPath } from "@/components/auth/safe-next";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Entrar" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function LoginPage({ searchParams }: Props) {
  const [{ next }, session] = await Promise.all([searchParams, getSession()]);
  const destination = safeNextPath(next);

  // Con sesión ya abierta no tiene sentido volver a entrar
  if (session) redirect(session.user.twoFactorEnabled ? (destination ?? "/admin") : "/admin/activar-2fa");

  return (
    <AuthShell>
      <LoginForm next={destination} />
    </AuthShell>
  );
}
