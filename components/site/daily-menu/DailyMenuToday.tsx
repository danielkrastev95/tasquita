"use client";

import { addDays, closureOn, formatShortDate, madridNow } from "@/lib/schedule";
import type { Closure } from "@/lib/settings";
import { cn } from "@/lib/utils";
import { WEEKDAYS, WEEKDAY_LABELS, type Weekday } from "@/lib/weekdays";
import { useMinute } from "../use-madrid-clock";

/** ¿Se sirve hoy el menú del día? Calculado en el cliente (hora de Madrid, con cierres puntuales). */
function describeToday(days: readonly Weekday[], closures: Closure[], date: Date) {
  const now = madridNow(date);
  const served = (iso: string, wd: Weekday) => days.includes(wd) && !closureOn(iso, closures);
  if (served(now.date, now.weekday)) return { today: true, text: "Hoy sí se sirve" };

  const idx = WEEKDAYS.indexOf(now.weekday);
  for (let i = 1; i <= 60; i++) {
    const iso = addDays(now.date, i);
    const wd = WEEKDAYS[(idx + i) % 7];
    if (!served(iso, wd)) continue;
    const when = i === 1 ? "mañana" : i <= 6 ? `el ${WEEKDAY_LABELS[wd].toLowerCase()}` : `el ${formatShortDate(iso)}`;
    return { today: false, text: `Hoy no se sirve · vuelve ${when}` };
  }
  return { today: false, text: "Hoy no se sirve" };
}

export function DailyMenuToday({ days, closures, className }: { days: Weekday[]; closures: Closure[]; className?: string }) {
  const minute = useMinute();
  const state = minute === null ? null : describeToday(days, closures, new Date(minute * 60_000));

  return (
    <span
      className={cn(
        "inline-flex min-h-9 items-center gap-2 border px-3 text-xs font-bold tracking-[0.14em] uppercase",
        className,
        !state && "border-cream/20 text-cream/60",
        state?.today && "border-gold bg-gold text-ink",
        state && !state.today && "border-cream/30 text-cream/85",
      )}
    >
      <span aria-hidden className={cn("size-1.5 shrink-0", state?.today ? "animate-pulse-dot bg-ink" : "bg-cream/50")} />
      {state?.text ?? <span className="invisible">Hoy no se sirve · vuelve mañana</span>}
    </span>
  );
}
