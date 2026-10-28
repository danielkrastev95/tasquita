"use client";

import { closureOn, groupOpeningHours, madridNow } from "@/lib/schedule";
import { cn } from "@/lib/utils";
import { useMinute } from "./use-madrid-clock";
import type { Schedule } from "./utils";

/**
 * Horario agrupado por días iguales; resalta el grupo de HOY (calculado en el cliente).
 * Si hoy hay un cierre puntual, la fila de hoy lo indica.
 */
export function OpeningHoursList({
  schedule,
  tone = "light",
  compact = false,
  className,
}: {
  schedule: Schedule;
  tone?: "light" | "dark";
  compact?: boolean;
  className?: string;
}) {
  const minute = useMinute();
  const now = minute === null ? null : madridNow(new Date(minute * 60_000));
  const closedToday = now ? closureOn(now.date, schedule.closures) : null;
  const groups = groupOpeningHours(schedule.hours);
  const dark = tone === "dark";

  return (
    <dl className={cn("divide-y", dark ? "divide-white/10" : "divide-primary/15", className)}>
      {groups.map((g) => {
        const isToday = now !== null && g.days.includes(now.weekday);
        return (
          <div
            key={g.label}
            className={cn(
              "relative flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5",
              compact ? "py-2" : "py-3",
              isToday && (dark ? "text-white" : "text-ink"),
            )}
          >
            {isToday && (
              <span aria-hidden className={cn("absolute top-1/2 -left-3 h-[60%] w-1 -translate-y-1/2", dark ? "bg-gold" : "bg-primary")} />
            )}
            <dt
              className={cn(
                "font-bold uppercase tracking-[0.06em]",
                compact ? "text-xs" : "text-sm",
                dark ? (isToday ? "text-white" : "text-white/75") : isToday ? "text-primary" : "text-ink",
              )}
            >
              {g.label}
              {isToday && (
                <span className={cn("ml-2 text-[0.6875rem] tracking-[0.16em]", dark ? "text-gold" : "text-gold-deep")}>· Hoy</span>
              )}
            </dt>
            <dd
              className={cn(
                "tabular-nums",
                compact ? "text-xs" : "text-sm",
                g.closed ? (dark ? "text-white/50" : "text-danger") : dark ? "text-white/85" : "text-ink-muted",
                isToday && "font-semibold",
              )}
            >
              {isToday && closedToday ? (
                <span className={dark ? "text-gold" : "text-danger"}>Hoy cerrado{closedToday.note ? ` · ${closedToday.note}` : ""}</span>
              ) : (
                g.hours
              )}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
