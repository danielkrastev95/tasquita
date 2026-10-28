"use client";

import { Megaphone } from "lucide-react";
import { useId, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { saveSettingsSection } from "@/lib/actions/settings";
import { cn } from "@/lib/utils";
import { ToggleSwitch } from "./ToggleSwitch";

const IDEAS = ["Hoy cerramos a las 18:00", "Cerrado por vacaciones del 1 al 15 de agosto", "Esta noche, música en directo", "Hoy la cocina cierra a las 16:00"];
const MAX = 160;

/** Activa/desactiva la franja de aviso de la web en un solo toque, con el texto al lado. */
export function QuickAnnouncement({ initialEnabled, initialText }: { initialEnabled: boolean; initialText: string }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [text, setText] = useState(initialText);
  const [savedText, setSavedText] = useState(initialText);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const inputId = useId();
  const trimmed = text.trim();
  const textDirty = trimmed !== savedText.trim();

  const save = (nextEnabled: boolean, successMessage: string) => {
    if (nextEnabled && !trimmed) {
      setError("Escribe primero el aviso que quieres mostrar");
      inputRef.current?.focus();
      return;
    }
    const previous = enabled;
    setEnabled(nextEnabled);
    setError(null);
    startTransition(async () => {
      const result = await saveSettingsSection("aviso", { announcementEnabled: nextEnabled, announcementText: trimmed });
      if (result.ok) {
        setSavedText(result.data.announcementText);
        setText(result.data.announcementText);
        toast.success(successMessage);
      } else {
        setEnabled(previous);
        setError(result.fieldErrors?.announcementText?.[0] ?? null);
        toast.error(result.error);
      }
    });
  };

  return (
    <section aria-labelledby={`${inputId}-title`} className="min-w-0 rounded-2xl border border-cream-400/70 bg-white p-5 shadow-[0_1px_2px_rgba(28,28,24,0.04)] md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-gold/20 text-gold-deep">
            <Megaphone className="size-5" aria-hidden />
          </span>
          <div>
            <h2 id={`${inputId}-title`} className="font-semibold text-ink">
              Aviso rápido
            </h2>
            <p className="text-sm leading-snug text-ink-muted">
              {enabled ? "Se está mostrando arriba de la web." : "Una franja arriba de la web para avisos del día."}
            </p>
          </div>
        </div>
        <ToggleSwitch
          checked={enabled}
          disabled={pending}
          onCheckedChange={(value) => save(value, value ? "Aviso publicado en la web" : "Aviso quitado de la web")}
          label="Mostrar el aviso en la web"
          className="-mt-1 -mr-1"
        />
      </div>

      <div className="mt-4 space-y-2">
        <label htmlFor={inputId} className="sr-only">
          Texto del aviso
        </label>
        <textarea
          ref={inputRef}
          id={inputId}
          value={text}
          rows={2}
          maxLength={MAX}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${inputId}-help`}
          placeholder="Ej.: Hoy cerramos a las 18:00"
          onChange={(event) => {
            setText(event.target.value.replace(/\n/g, " "));
            setError(null);
          }}
          className={cn(
            "w-full resize-none rounded-xl border border-cream-400 bg-cream-100/60 px-4 py-3 text-base leading-snug text-ink transition placeholder:text-ink-muted/50 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/15 focus:outline-none",
            error && "border-danger",
          )}
        />
        <div id={`${inputId}-help`} className="flex items-center justify-between gap-3 text-xs">
          {error ? <span className="text-danger" role="alert">{error}</span> : <span className="text-ink-muted">Corto y claro: se lee en una línea.</span>}
          <span className={cn("tabular-nums", text.length > MAX - 20 ? "text-gold-deep" : "text-ink-muted")}>
            {text.length}/{MAX}
          </span>
        </div>
      </div>

      {!trimmed && (
        <div className="scrollbar-hide -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Ideas de aviso">
          {IDEAS.map((idea) => (
            <button
              key={idea}
              type="button"
              onClick={() => {
                setText(idea);
                setError(null);
                inputRef.current?.focus();
              }}
              className="min-h-10 shrink-0 rounded-full border border-cream-400 bg-white px-3.5 text-xs font-medium whitespace-nowrap text-ink-muted transition hover:border-primary hover:text-primary"
            >
              {idea}
            </button>
          ))}
        </div>
      )}

      {textDirty && (
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" loading={pending} onClick={() => save(enabled || Boolean(trimmed), enabled ? "Aviso actualizado" : "Aviso publicado en la web")}>
            {enabled ? "Guardar cambios" : "Guardar y mostrar"}
          </Button>
          <Button size="sm" variant="ghost" disabled={pending} onClick={() => setText(savedText)}>
            Deshacer
          </Button>
        </div>
      )}
    </section>
  );
}
