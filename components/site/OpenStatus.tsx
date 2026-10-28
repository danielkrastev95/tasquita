"use client";

import { describeOpenStatus, getOpenStatus } from "@/lib/schedule";
import type { OpeningHours } from "@/lib/settings";
import { cn } from "@/lib/utils";
import { useMinute } from "./use-madrid-clock";

type Tone = "light" | "dark";

/** "● Abierto · cierra a las 17:00". Se calcula en el cliente (hora de Madrid) y se refresca cada minuto. */
export function OpenStatus({ hours, tone = "light", className }: { hours: OpeningHours; tone?: Tone; className?: string }) {
  const minute = useMinute();
  const now = minute === null ? null : new Date(minute * 60_000);
  const status = now ? getOpenStatus(hours, now) : null;
  const text = status && now ? describeOpenStatus(status, now) : null;

  return (
    <span className={cn("inline-flex min-h-6 items-center gap-2 text-sm font-semibold", className)}>
      <span
        aria-hidden
        className={cn(
          "size-2 shrink-0",
          !status && (tone === "dark" ? "bg-white/30" : "bg-ink/20"),
          status?.open && (tone === "dark" ? "animate-pulse-dot bg-[#5fd39a]" : "animate-pulse-dot bg-success"),
          status && !status.open && (tone === "dark" ? "bg-gold" : "bg-danger"),
        )}
      />
      {/* Antes de montar se reserva el hueco para no mover el diseño */}
      {text ?? <span className="invisible">Abierto · cierra a las 00:00</span>}
    </span>
  );
}
