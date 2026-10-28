"use client";

import { Check } from "lucide-react";
import { ALLERGENS, type AllergenCode } from "@/lib/allergens";
import { cn } from "@/lib/utils";

/** Los 14 alérgenos como fichas que se marcan/desmarcan con un toque. */
export function AllergenPicker({ value, onChange, id }: { value: AllergenCode[]; onChange: (next: AllergenCode[]) => void; id?: string }) {
  const selected = new Set(value);
  const toggle = (code: AllergenCode) => {
    const next = new Set(selected);
    if (next.has(code)) next.delete(code);
    else next.add(code);
    onChange(ALLERGENS.map((a) => a.code).filter((c) => next.has(c)));
  };

  return (
    <div id={id} role="group" aria-label="Alérgenos" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {ALLERGENS.map((allergen) => {
        const on = selected.has(allergen.code);
        return (
          <button
            key={allergen.code}
            type="button"
            aria-pressed={on}
            onClick={() => toggle(allergen.code)}
            className={cn(
              "flex min-h-11 items-center gap-2 rounded-xl border px-3 text-left text-sm font-medium transition active:scale-[0.98]",
              on ? "border-primary bg-primary text-white shadow-sm" : "border-cream-400 bg-white text-ink hover:border-primary/50",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "inline-flex size-5 shrink-0 items-center justify-center rounded-md border transition",
                on ? "border-white/60 bg-white/20" : "border-cream-400 bg-cream-100",
              )}
            >
              {on && <Check className="size-3.5" strokeWidth={3} />}
            </span>
            <span className="leading-tight">{allergen.label}</span>
          </button>
        );
      })}
    </div>
  );
}
