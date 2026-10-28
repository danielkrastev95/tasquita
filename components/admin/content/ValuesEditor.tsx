"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

type Value = { title: string; description: string };

const MIN = 1;
const MAX = 4;

/** Lista de 1 a 4 valores (título + descripción) que se pueden añadir, quitar y reordenar. */
export function ValuesEditor({
  value,
  onChange,
  errorFor,
  fieldId,
}: {
  value: Value[];
  onChange: (next: Value[]) => void;
  errorFor: (key: string) => string | undefined;
  fieldId: (key: string) => string;
}) {
  const update = (index: number, patch: Partial<Value>) => onChange(value.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  const move = (index: number, delta: number) => {
    const next = [...value];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <ol className="space-y-3">
        {value.map((item, index) => {
          const titleError = errorFor(`values.${index}.title`);
          const descriptionError = errorFor(`values.${index}.description`);
          const n = index + 1;
          return (
            <li key={index} className="rounded-2xl border border-cream-400/70 bg-white p-4 md:p-5">
              <div className="mb-3 flex items-center gap-1">
                <span className="mr-auto inline-flex size-8 items-center justify-center rounded-full bg-primary-light text-sm font-bold text-primary-dark tabular-nums">{n}</span>
                <Button variant="ghost" size="icon" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Subir el valor ${n}`}>
                  <ArrowUp className="size-4" aria-hidden />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => move(index, 1)} disabled={index === value.length - 1} aria-label={`Bajar el valor ${n}`}>
                  <ArrowDown className="size-4" aria-hidden />
                </Button>
                <Button
                  variant="danger-ghost"
                  size="icon"
                  onClick={() => onChange(value.filter((_, i) => i !== index))}
                  disabled={value.length <= MIN}
                  aria-label={`Quitar el valor ${n}`}
                >
                  <Trash2 className="size-4" aria-hidden />
                </Button>
              </div>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label htmlFor={fieldId(`values.${index}.title`)} className="text-sm font-medium">
                    Título
                  </label>
                  <Input
                    id={fieldId(`values.${index}.title`)}
                    value={item.title}
                    maxLength={80}
                    onChange={(e) => update(index, { title: e.target.value })}
                    aria-invalid={titleError ? true : undefined}
                    placeholder="Ej.: Producto de calidad"
                  />
                  {titleError && <p className="text-sm text-danger">{titleError}</p>}
                </div>
                <div className="space-y-1.5">
                  <label htmlFor={fieldId(`values.${index}.description`)} className="text-sm font-medium">
                    Descripción
                  </label>
                  <Textarea
                    id={fieldId(`values.${index}.description`)}
                    rows={2}
                    value={item.description}
                    maxLength={240}
                    onChange={(e) => update(index, { description: e.target.value })}
                    aria-invalid={descriptionError ? true : undefined}
                    placeholder="Una frase corta que lo explique."
                  />
                  {descriptionError && <p className="text-sm text-danger">{descriptionError}</p>}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      {value.length < MAX ? (
        <Button variant="secondary" onClick={() => onChange([...value, { title: "", description: "" }])} className="w-full border-dashed">
          <Plus className="size-4" aria-hidden />
          Añadir valor ({value.length}/{MAX})
        </Button>
      ) : (
        <p className="text-center text-xs text-ink-muted">Máximo {MAX} valores: así se leen bien en el móvil.</p>
      )}
    </div>
  );
}
