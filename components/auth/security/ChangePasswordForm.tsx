"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { NETWORK_MESSAGE, authErrorMessage } from "../errors";
import { FormAlert } from "../FormAlert";
import { MIN_PASSWORD_LENGTH, passwordStrength } from "../password-strength";
import { PasswordInput } from "../PasswordInput";

type Errors = { current?: string; next?: string; confirm?: string };

const BAR_COLORS = ["bg-danger", "bg-danger", "bg-gold", "bg-success", "bg-success"] as const;
const TEXT_COLORS = ["text-danger", "text-danger", "text-gold-deep", "text-success", "text-success"] as const;

/** Cambio de contraseña; al guardarla se cierran las sesiones del resto de dispositivos. */
export function ChangePasswordForm({ email, name }: { email: string; name: string }) {
  const router = useRouter();
  const id = useId();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const strength = passwordStrength(next, [name, email.split("@")[0] ?? ""]);

  function validate(): Errors {
    const found: Errors = {};
    if (!current) found.current = "Escribe tu contraseña actual.";
    if (next.length < MIN_PASSWORD_LENGTH) found.next = `La nueva contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
    else if (next === current) found.next = "La nueva contraseña tiene que ser distinta de la actual.";
    if (!found.next && confirm !== next) found.confirm = "Las contraseñas no coinciden.";
    return found;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    setFormError(null);
    if (Object.keys(found).length > 0) return;

    setPending(true);
    try {
      const { error } = await authClient.changePassword({ currentPassword: current, newPassword: next, revokeOtherSessions: true });
      if (error) {
        if (error.code === "INVALID_PASSWORD") setErrors({ current: "La contraseña actual no es correcta." });
        else setFormError(authErrorMessage(error));
        return;
      }
      setCurrent("");
      setNext("");
      setConfirm("");
      toast.success("Contraseña cambiada", { description: "Hemos cerrado la sesión en tus otros dispositivos." });
      router.refresh();
    } catch {
      setFormError(NETWORK_MESSAGE);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Para que el gestor de contraseñas sepa a qué cuenta pertenece la nueva */}
      <input type="email" name="username" autoComplete="username" value={email} readOnly hidden />

      <Field label="Contraseña actual" htmlFor={`${id}-current`} error={errors.current}>
        <PasswordInput
          id={`${id}-current`}
          autoComplete="current-password"
          value={current}
          aria-invalid={Boolean(errors.current) || undefined}
          onChange={(event) => setCurrent(event.target.value)}
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Field label="Nueva contraseña" htmlFor={`${id}-next`} error={errors.next}>
            <PasswordInput
              id={`${id}-next`}
              autoComplete="new-password"
              minLength={MIN_PASSWORD_LENGTH}
              maxLength={128}
              value={next}
              aria-invalid={Boolean(errors.next) || undefined}
              aria-describedby={`${id}-strength`}
              onChange={(event) => setNext(event.target.value)}
            />
          </Field>
          <div id={`${id}-strength`} aria-live="polite" className={cn("space-y-1.5", !next && "sr-only")}>
            {next && (
              <>
                <div aria-hidden className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className={cn("h-1.5 flex-1 rounded-full transition-colors", i < Math.max(1, strength.score) ? BAR_COLORS[strength.score] : "bg-cream-300")}
                    />
                  ))}
                </div>
                <p className="text-xs leading-relaxed text-ink-muted">
                  <span className={cn("font-semibold", TEXT_COLORS[strength.score])}>{strength.label}.</span>
                  {strength.hint && ` ${strength.hint}`}
                </p>
              </>
            )}
          </div>
        </div>
        <Field label="Repite la nueva contraseña" htmlFor={`${id}-confirm`} error={errors.confirm}>
          <PasswordInput
            id={`${id}-confirm`}
            autoComplete="new-password"
            value={confirm}
            aria-invalid={Boolean(errors.confirm) || undefined}
            onChange={(event) => setConfirm(event.target.value)}
          />
        </Field>
      </div>

      <FormAlert message={formError} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-ink-muted">Al cambiarla, se cerrará la sesión en el resto de dispositivos.</p>
        <Button type="submit" loading={pending} className="shrink-0">
          Cambiar contraseña
        </Button>
      </div>
    </form>
  );
}
