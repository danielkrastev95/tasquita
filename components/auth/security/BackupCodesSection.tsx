"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { BackupCodes } from "../BackupCodes";
import { Checkbox } from "../Checkbox";
import { authErrorMessage } from "../errors";
import { FormAlert } from "../FormAlert";
import { ConfirmWithPassword } from "./ConfirmWithPassword";

/** Códigos de respaldo: cuántos quedan y regenerarlos (invalida los anteriores). */
export function BackupCodesSection({ remaining, email }: { remaining: number | null; email: string }) {
  const router = useRouter();
  const [view, setView] = useState<"idle" | "confirm" | "codes">("idle");
  const [codes, setCodes] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const low = remaining !== null && remaining <= 3;

  if (view === "codes") {
    return (
      <div className="space-y-4">
        <FormAlert tone="info" message="Estos son tus códigos nuevos. Los anteriores ya no funcionan." />
        <BackupCodes codes={codes} email={email} />
        <Checkbox checked={saved} onCheckedChange={setSaved} label="Los he guardado en un sitio seguro" />
        <Button
          disabled={!saved}
          className="w-full sm:w-auto"
          onClick={() => {
            setView("idle");
            setCodes([]);
            setSaved(false);
            router.refresh();
          }}
        >
          Hecho
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {remaining !== null && (
        <p className={cn("text-sm", low ? "text-danger" : "text-ink")}>
          {remaining === 0 ? (
            <strong className="font-semibold">No te queda ningún código sin usar.</strong>
          ) : (
            <>
              Te quedan <strong className="font-semibold">{remaining}</strong> {remaining === 1 ? "código" : "códigos"} sin usar.
            </>
          )}
          {low && " Genera unos nuevos y guárdalos."}
        </p>
      )}

      {view === "confirm" ? (
        <ConfirmWithPassword
          title="Generar códigos nuevos"
          confirmLabel="Generar códigos"
          onCancel={() => setView("idle")}
          onConfirm={async (password) => {
            const { data, error } = await authClient.twoFactor.generateBackupCodes({ password });
            if (error || !data) return authErrorMessage(error);
            setCodes(data.backupCodes);
            setSaved(false);
            setView("codes");
          }}
        >
          Los códigos que tienes ahora dejarán de funcionar al momento. Tendrás que guardar los nuevos.
        </ConfirmWithPassword>
      ) : (
        <Button variant="secondary" onClick={() => setView("confirm")} className="w-full sm:w-auto">
          <RefreshCw className="size-4" aria-hidden />
          Generar códigos nuevos
        </Button>
      )}
    </div>
  );
}
