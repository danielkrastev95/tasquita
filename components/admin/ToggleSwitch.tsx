"use client";

import { cn } from "@/lib/utils";

type ToggleSwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** Texto accesible (no visible), p. ej. "Mostrar «Patatas bravas» en la carta". */
  label: string;
  disabled?: boolean;
  className?: string;
};

/** Interruptor compacto para listas: zona táctil de 44px aunque el control se vea pequeño. */
export function ToggleSwitch({ checked, onCheckedChange, label, disabled, className }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn("group inline-flex h-11 w-14 shrink-0 items-center justify-center rounded-full disabled:opacity-50", className)}
    >
      <span
        aria-hidden
        className={cn(
          "relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200",
          checked ? "bg-primary" : "bg-cream-400 group-hover:bg-[#d9d5ce]",
        )}
      >
        <span
          className={cn(
            "inline-block size-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out-expo",
            checked ? "translate-x-6" : "translate-x-1",
          )}
        />
      </span>
    </button>
  );
}
