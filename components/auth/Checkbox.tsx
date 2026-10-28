"use client";

import { Check } from "lucide-react";
import { useId } from "react";
import { cn } from "@/lib/utils";

type CheckboxProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  className?: string;
};

/** Casilla nativa con estilo de la marca y zona táctil de 44px. */
export function Checkbox({ checked, onCheckedChange, label, description, disabled, className }: CheckboxProps) {
  const id = useId();
  const descriptionId = `${id}-description`;
  return (
    <label htmlFor={id} className={cn("flex min-h-11 cursor-pointer items-start gap-3 py-2", disabled && "cursor-not-allowed opacity-60", className)}>
      <span className="relative mt-px flex size-5 shrink-0 items-center justify-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          aria-describedby={description ? descriptionId : undefined}
          onChange={(event) => onCheckedChange(event.target.checked)}
          className="peer absolute inset-0 m-0 cursor-[inherit] appearance-none rounded-md border-2 border-cream-400 bg-white transition-colors checked:border-primary checked:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        />
        <Check className="pointer-events-none relative size-3.5 text-white opacity-0 peer-checked:opacity-100" strokeWidth={3} aria-hidden />
      </span>
      <span className="space-y-0.5">
        <span className="block text-sm leading-snug font-medium text-ink">{label}</span>
        {description && (
          <span id={descriptionId} className="block text-xs leading-relaxed text-ink-muted">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}
