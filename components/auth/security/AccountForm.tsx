"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { authClient } from "@/lib/auth-client";
import { NETWORK_MESSAGE, authErrorMessage } from "../errors";

/** Nombre editable y email (solo lectura). */
export function AccountForm({ name, email }: { name: string; email: string }) {
  const router = useRouter();
  const id = useId();
  const [value, setValue] = useState(name);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const trimmed = value.trim();
  const changed = trimmed !== name;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!trimmed) return setError("Escribe tu nombre.");
    if (trimmed.length > 60) return setError("Máximo 60 caracteres.");
    setPending(true);
    setError(null);
    try {
      const { error: err } = await authClient.updateUser({ name: trimmed });
      if (err) return setError(authErrorMessage(err));
      setValue(trimmed);
      toast.success("Nombre guardado");
      router.refresh();
    } catch {
      setError(NETWORK_MESSAGE);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        <Field label="Nombre" htmlFor={`${id}-name`} error={error} hint="Es el nombre con el que te saluda el panel.">
          <Input
            id={`${id}-name`}
            name="name"
            autoComplete="name"
            maxLength={60}
            value={value}
            aria-invalid={Boolean(error) || undefined}
            onChange={(event) => {
              setValue(event.target.value);
              if (error) setError(null);
            }}
          />
        </Field>
        {changed && (
          <Button type="submit" size="sm" loading={pending}>
            Guardar nombre
          </Button>
        )}
      </form>
      <Field label="Email" hint="Es tu usuario para entrar. Si necesitas cambiarlo, pide ayuda a quien gestiona la web.">
        <p className="flex h-12 items-center truncate rounded-xl bg-cream-100 px-4 text-base text-ink-muted">{email}</p>
      </Field>
    </div>
  );
}
