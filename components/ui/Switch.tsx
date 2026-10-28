"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

type SwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
  /** Si se indica, se añade un <input type="hidden"> para formularios nativos ("on" / ""). */
  name?: string;
  className?: string;
};

export function Switch({ checked, onCheckedChange, label, description, disabled, name, className }: SwitchProps) {
  const id = useId();
  return (
    <div className={cn("flex min-h-12 items-center justify-between gap-4", disabled && "opacity-60", className)}>
      <label htmlFor={id} className={cn("space-y-0.5", disabled ? "cursor-not-allowed" : "cursor-pointer")}>
        <span className="block text-sm font-medium text-ink">{label}</span>
        {description && <span className="block text-xs leading-relaxed text-ink-muted">{description}</span>}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn("relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors", checked ? "bg-primary" : "bg-cream-400")}
      >
        <span className={cn("inline-block size-5 rounded-full bg-white shadow transition-transform", checked ? "translate-x-6" : "translate-x-1")} />
      </button>
      {name && <input type="hidden" name={name} value={checked ? "on" : ""} />}
    </div>
  );
}
