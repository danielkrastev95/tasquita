"use client";

import { Fragment, useState, type Ref } from "react";
import { cn } from "@/lib/utils";

type OtpInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  /** Se llama al completar todas las cifras (al escribir o al pegar). */
  onComplete?: (value: string) => void;
  length?: number;
  invalid?: boolean;
  /** Bloquea la edición sin perder el foco (mientras se comprueba el código). */
  busy?: boolean;
  autoFocus?: boolean;
  describedBy?: string;
  ref?: Ref<HTMLInputElement>;
};

/**
 * Código de un solo uso: un único <input> real (autocompletado del SMS/llavero, pegar, lectores de
 * pantalla) superpuesto a unas casillas puramente visuales.
 */
export function OtpInput({ id, value, onChange, onComplete, length = 6, invalid, busy, autoFocus, describedBy, ref }: OtpInputProps) {
  const [focused, setFocused] = useState(false);
  const activeIndex = Math.min(value.length, length - 1);
  const half = Math.floor(length / 2);

  return (
    <div className="relative">
      <input
        ref={ref}
        id={id}
        name="code"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern={`[0-9]{${length}}`}
        enterKeyHint="done"
        autoFocus={autoFocus}
        readOnly={busy}
        value={value}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        spellCheck={false}
        autoCorrect="off"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(event) => {
          // Acepta "123 456", "123-456"… y se queda solo con las cifras
          const digits = event.target.value.replace(/\D/g, "").slice(0, length);
          if (digits === value) return;
          onChange(digits);
          if (digits.length === length) onComplete?.(digits);
        }}
        className="absolute inset-0 z-10 h-full w-full cursor-text appearance-none border-0 bg-transparent text-base text-transparent caret-transparent outline-none selection:bg-transparent"
      />
      <div aria-hidden className="flex items-center gap-1.5 sm:gap-2">
        {Array.from({ length }, (_, i) => {
          const active = focused && !busy && i === activeIndex;
          return (
            <Fragment key={i}>
              {i === half && <span className="h-0.5 w-2.5 shrink-0 rounded-full bg-cream-400" />}
              <div
                className={cn(
                  "relative flex h-14 min-w-0 flex-1 items-center justify-center rounded-xl border-2 bg-white text-2xl font-semibold text-ink tabular-nums transition-[border-color,box-shadow,background-color] duration-150",
                  invalid ? "border-danger/60 bg-danger/[0.03]" : value[i] ? "border-cream-400" : "border-cream-300",
                  active && (invalid ? "border-danger ring-4 ring-danger/15" : "border-primary ring-4 ring-primary/15"),
                  busy && "bg-cream-100 text-ink-muted",
                )}
              >
                {value[i] ?? ""}
                {active && value.length < length && <span className="h-7 w-0.5 animate-pulse rounded-full bg-primary" />}
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
