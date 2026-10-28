"use client";

import { ShieldCheck, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "../errors";
import { ConfirmWithPassword } from "./ConfirmWithPassword";

/** Estado del 2FA y "Cambiar de móvil" (desvincula y lleva al asistente para vincular el nuevo). */
export function AuthenticatorSection() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3.5 rounded-2xl bg-success/[0.08] p-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
          <ShieldCheck className="size-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">Activada</p>
          <p className="text-xs leading-relaxed text-ink-muted">Tu app de autenticación está vinculada a esta cuenta.</p>
        </div>
      </div>

      {confirming ? (
        <ConfirmWithPassword
          title="Cambiar de móvil"
          tone="danger"
          confirmLabel="Desvincular y continuar"
          onCancel={() => setConfirming(false)}
          onConfirm={async (password) => {
            const { error } = await authClient.twoFactor.disable({ password });
            if (error) return authErrorMessage(error);
            router.replace("/admin/activar-2fa");
            router.refresh();
          }}
        >
          <ul className="list-disc space-y-1 pl-5 marker:text-ink-muted/60">
            <li>Ten delante el móvil nuevo con una app de autenticación instalada.</li>
            <li>Desvincularemos la app actual y te llevaremos a vincular la nueva. Son dos minutos.</li>
            <li>
              <strong className="font-semibold text-ink">Hasta que no termines, no podrás usar el panel.</strong>
            </li>
            <li>Sirve también para pasar el acceso a otra persona: que tenga su móvil a mano.</li>
          </ul>
        </ConfirmWithPassword>
      ) : (
        <Button variant="secondary" onClick={() => setConfirming(true)} className="w-full sm:w-auto">
          <Smartphone className="size-4" aria-hidden />
          Cambiar de móvil
        </Button>
      )}
    </div>
  );
}
