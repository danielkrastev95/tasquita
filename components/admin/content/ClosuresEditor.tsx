"use client";

import { CalendarOff, CalendarPlus, Eraser, Trash2 } from "lucide-react";
import { useId } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { addDays, describeClosure } from "@/lib/schedule";
import { cn } from "@/lib/utils";
import { Badge } from "../Badge";

export type ClosureDraft = { from: string; to: string; note: string };

const MAX = 30;
const ISO = /^\d{4}-\d{2}-\d{2}$/;

type Props = {
  value: ClosureDraft[];
  onChange: (next: ClosureDraft[]) => void;
  /** Hoy en Madrid (YYYY-MM-DD) */
  today: string;
  errorFor: (key: string) => string | undefined;
  fieldId: (key: string) => string;
};

/** Lista de cierres puntuales (vacaciones, festivos) con atajos y limpieza de los ya pasados. */
export function ClosuresEditor({ value, onChange, today, errorFor, fieldId }: Props) {
  const baseId = useId();
  const tomorrow = addDays(today, 1);
  const pastCount = value.filter((c) => ISO.test(c.to) && c.to < today).length;
  const covers = (date: string) => value.some((c) => c.from <= date && date <= c.to);

  const update = (index: number, patch: Partial<ClosureDraft>) =>
    onChange(
      value.map((c, i) => {
        if (i !== index) return c;
        const next = { ...c, ...patch };
        // Si la fecha final queda antes que la inicial (o vacía), la igualamos.
        if (patch.from && (!next.to || next.to < next.from)) next.to = next.from;
        return next;
      }),
    );

  const add = (closure: ClosureDraft) => {
    onChange([...value, closure]);
    requestAnimationFrame(() => document.getElementById(fieldId(`specialClosures.${value.length}.from`))?.focus());
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        <Button variant="secondary" size="sm" disabled={covers(today) || value.length >= MAX} onClick={() => add({ from: today, to: today, note: "" })}>
          <CalendarOff className="size-4" aria-hidden />
          Cerrar hoy
        </Button>
        <Button variant="secondary" size="sm" disabled={covers(tomorrow) || value.length >= MAX} onClick={() => add({ from: tomorrow, to: tomorrow, note: "" })}>
          <CalendarOff className="size-4" aria-hidden />
          Cerrar mañana
        </Button>
        <Button variant="secondary" size="sm" className="col-span-2" disabled={value.length >= MAX} onClick={() => add({ from: tomorrow, to: addDays(tomorrow, 6), note: "Vacaciones" })}>
          <CalendarPlus className="size-4" aria-hidden />
          Otras fechas
        </Button>
      </div>

      {value.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-cream-400 bg-white/60 px-5 py-8 text-center text-sm text-ink-muted">
          No hay cierres previstos. Usa los botones de arriba para añadir vacaciones, un festivo o un día suelto.
        </div>
      ) : (
        <ol className="space-y-3">
          {value.map((closure, index) => {
            const valid = ISO.test(closure.from) && ISO.test(closure.to);
            const past = valid && closure.to < today;
            const isToday = valid && closure.from <= today && today <= closure.to;
            const fromError = errorFor(`specialClosures.${index}.from`);
            const toError = errorFor(`specialClosures.${index}.to`);
            const noteError = errorFor(`specialClosures.${index}.note`);
            return (
              <li key={index} className={cn("rounded-2xl border bg-white p-4 transition md:p-5", past ? "border-cream-300 opacity-60" : "border-cream-400/70")}>
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-ink">{valid ? describeClosure({ ...closure, note: closure.note }) : "Elige las fechas"}</p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {isToday && <Badge tone="danger">Hoy cerrado</Badge>}
                      {past && <Badge tone="muted">Ya pasó</Badge>}
                    </div>
                  </div>
                  <Button
                    variant="danger-ghost"
                    size="icon"
                    onClick={() => onChange(value.filter((_, i) => i !== index))}
                    aria-label={`Quitar el cierre ${valid ? describeClosure({ ...closure, note: closure.note }).toLowerCase() : index + 1}`}
                    className="-mt-2 -mr-2"
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor={fieldId(`specialClosures.${index}.from`)} className="text-sm font-medium">
                      Desde
                    </label>
                    <Input
                      id={fieldId(`specialClosures.${index}.from`)}
                      type="date"
                      value={closure.from}
                      onChange={(e) => update(index, { from: e.target.value })}
                      aria-invalid={fromError ? true : undefined}
                      className="min-w-0 appearance-none px-3 text-left [&::-webkit-date-and-time-value]:text-left"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor={fieldId(`specialClosures.${index}.to`)} className="text-sm font-medium">
                      Hasta (incluido)
                    </label>
                    <Input
                      id={fieldId(`specialClosures.${index}.to`)}
                      type="date"
                      value={closure.to}
                      min={closure.from || undefined}
                      onChange={(e) => update(index, { to: e.target.value })}
                      aria-invalid={toError ? true : undefined}
                      className="min-w-0 appearance-none px-3 text-left [&::-webkit-date-and-time-value]:text-left"
                    />
                  </div>
                </div>
                {(fromError || toError) && (
                  <p role="alert" className="mt-2 text-sm text-danger">
                    {fromError ?? toError}
                  </p>
                )}
                <div className="mt-3 space-y-1.5">
                  <label htmlFor={`${baseId}-note-${index}`} className="flex justify-between text-sm font-medium">
                    Motivo <span className="text-xs font-normal text-ink-muted">Opcional</span>
                  </label>
                  <Input
                    id={`${baseId}-note-${index}`}
                    value={closure.note}
                    maxLength={120}
                    onChange={(e) => update(index, { note: e.target.value })}
                    placeholder="Ej.: Vacaciones de verano"
                    aria-invalid={noteError ? true : undefined}
                  />
                  {noteError && <p className="text-sm text-danger">{noteError}</p>}
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {pastCount > 0 && (
        <Button variant="ghost" size="sm" onClick={() => onChange(value.filter((c) => !(ISO.test(c.to) && c.to < today)))} className="text-ink-muted">
          <Eraser className="size-4" aria-hidden />
          Limpiar los ya pasados ({pastCount})
        </Button>
      )}
    </div>
  );
}
