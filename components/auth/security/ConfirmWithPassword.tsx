"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { NETWORK_MESSAGE } from "../errors";
import { FormAlert } from "../FormAlert";
import { PasswordInput } from "../PasswordInput";

type Props = {
  title: string;
  children: React.ReactNode;
  confirmLabel: string;
  tone?: "primary" | "danger";
  /** Devuelve un mensaje de error, o nada si ha ido bien (el panel se queda "cargando" mientras se navega). */
  onConfirm: (password: string) => Promise<string | void>;
  onCancel: () => void;
};

/** Confirmación en línea que pide la contraseña antes de una acción sensible. */
export function ConfirmWithPassword({ title, children, confirmLabel, tone = "primary", onConfirm, onCancel }: Props) {
  const id = useId();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    if (!password) {
      setError("Escribe tu contraseña para confirmar.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      const message = await onConfirm(password);
      if (message) {
        setError(message);
        setPending(false);
      }
    } catch {
      setError(NETWORK_MESSAGE);
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby={`${id}-title`}
      className={`space-y-4 rounded-2xl border p-4 sm:p-5 ${tone === "danger" ? "border-danger/25 bg-danger/[0.03]" : "border-cream-400 bg-cream-100/60"}`}
    >
      <div className="space-y-2">
        <h3 id={`${id}-title`} className="text-base font-semibold text-ink">
          {title}
        </h3>
        <div className="text-sm leading-relaxed text-ink-muted">{children}</div>
      </div>
      <Field label="Tu contraseña" htmlFor={`${id}-password`}>
        <PasswordInput
          id={`${id}-password`}
          autoComplete="current-password"
          autoFocus
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            if (error) setError(null);
          }}
        />
      </Field>
      <FormAlert message={error} />
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="ghost" onClick={onCancel} disabled={pending}>
          Cancelar
        </Button>
        <Button type="submit" variant={tone === "danger" ? "danger" : "primary"} loading={pending}>
          {confirmLabel}
        </Button>
      </div>
    </form>
  );
}
