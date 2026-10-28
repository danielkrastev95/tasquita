"use client";

import { Monitor, Smartphone, Tablet } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import type { DeviceKind } from "../user-agent";

export type SessionItem = {
  id: string;
  label: string;
  device: DeviceKind;
  details: string;
  current: boolean;
};

const ICONS = { mobile: Smartphone, tablet: Tablet, desktop: Monitor } as const;

type ActionResult = { ok: true } | { ok: false; error: string };

type Props = {
  sessions: SessionItem[];
  /** Server actions (las pasa la página) */
  revokeSession: (sessionId: string) => Promise<ActionResult>;
  revokeOtherSessions: () => Promise<ActionResult>;
};

/** Dispositivos con la sesión abierta; permite cerrar uno o todos los demás. */
export function SessionsSection({ sessions, revokeSession, revokeOtherSessions }: Props) {
  const [pending, startTransition] = useTransition();
  const others = sessions.filter((s) => !s.current).length;

  function act(action: () => Promise<ActionResult>, success: string) {
    startTransition(async () => {
      try {
        const result = await action();
        if (result.ok) toast.success(success);
        else toast.error(result.error);
      } catch {
        toast.error("No se ha podido completar. Inténtalo de nuevo.");
      }
    });
  }

  return (
    <div className="space-y-4">
      <ul className="divide-y divide-cream-300" aria-busy={pending || undefined}>
        {sessions.map((session) => {
          const Icon = ICONS[session.device];
          return (
            <li key={session.id} className="flex items-center gap-3.5 py-3.5 first:pt-0">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-cream-100 text-ink-muted">
                <Icon className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-ink">
                  {session.label}
                  {session.current && (
                    <span className="rounded-full bg-primary-light px-2 py-0.5 text-[0.7rem] font-semibold text-primary-dark">
                      Este dispositivo
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">{session.details}</p>
              </div>
              {!session.current && (
                <Button
                  variant="danger-ghost"
                  size="sm"
                  className="h-11 shrink-0 px-3"
                  disabled={pending}
                  aria-label={`Cerrar la sesión de ${session.label}`}
                  onClick={() => act(() => revokeSession(session.id), "Sesión cerrada en ese dispositivo")}
                >
                  Cerrar
                </Button>
              )}
            </li>
          );
        })}
      </ul>

      {others > 0 ? (
        <div className="flex flex-col gap-3 border-t border-cream-300 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-relaxed text-ink-muted">
            Si no reconoces algún dispositivo, ciérralos todos y cambia tu contraseña. También volverán a pedir el código.
          </p>
          <Button
            variant="secondary"
            className="shrink-0"
            loading={pending}
            onClick={() => act(revokeOtherSessions, "Hemos cerrado la sesión en los demás dispositivos")}
          >
            Cerrar todas las demás
          </Button>
        </div>
      ) : (
        <p className="text-xs leading-relaxed text-ink-muted">Solo tienes la sesión abierta en este dispositivo.</p>
      )}
    </div>
  );
}
