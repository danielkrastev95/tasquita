"use client";

import { Pencil, Soup } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { buttonClasses } from "@/components/ui/Button";
import { setDailyMenuEnabled } from "@/lib/actions/settings";
import { formatPrice } from "@/lib/format";
import { describeDays } from "@/lib/schedule";
import type { DailyMenu } from "@/lib/settings";
import { cn } from "@/lib/utils";
import type { Weekday } from "@/lib/weekdays";
import { ToggleSwitch } from "./ToggleSwitch";

const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** Menú del día en el Inicio: activarlo/desactivarlo de un toque y saltar a editarlo. */
export function DailyMenuCard({ menu, today }: { menu: DailyMenu; today: Weekday }) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(menu.enabled);
  const [pending, startTransition] = useTransition();
  const dishes = menu.starters.length + menu.mains.length + menu.desserts.length;
  const servedToday = menu.days.includes(today);
  const price = formatPrice(menu.priceCents);

  const toggle = (next: boolean) => {
    setEnabled(next);
    startTransition(async () => {
      const result = await setDailyMenuEnabled(next);
      if (result.ok) toast.success(next ? "Menú del día visible en la web" : "Menú del día quitado de la web");
      else {
        setEnabled(!next);
        toast.error(result.error, { action: { label: "Editar menú", onClick: () => router.push("/admin/menu-del-dia") } });
      }
    });
  };

  const status = !enabled
    ? "No se muestra en la web."
    : servedToday
      ? "Hoy se sirve."
      : `Hoy no toca: ${describeDays(menu.days).toLowerCase() || "sin días marcados"}.`;

  return (
    <section aria-labelledby="menu-dia-titulo" className="min-w-0 rounded-2xl border border-cream-400/70 bg-white p-5 shadow-[0_1px_2px_rgba(28,28,24,0.04)] md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className={cn("mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-xl", enabled ? "bg-primary text-white" : "bg-primary-light text-primary")}>
            <Soup className="size-5" aria-hidden />
          </span>
          <div>
            <h2 id="menu-dia-titulo" className="font-semibold text-ink">
              Menú del día
            </h2>
            <p className={cn("text-sm leading-snug", enabled && servedToday ? "font-medium text-success" : "text-ink-muted")}>{status}</p>
          </div>
        </div>
        <ToggleSwitch checked={enabled} disabled={pending} onCheckedChange={toggle} label="Mostrar el menú del día en la web" className="-mt-1 -mr-1" />
      </div>

      <div className="mt-4 rounded-xl bg-cream-100 px-4 py-3">
        {dishes === 0 ? (
          <p className="text-sm text-ink-muted">Todavía no tiene platos.</p>
        ) : (
          <>
            <p className="flex items-baseline justify-between gap-3">
              <span className="truncate font-serif text-lg font-bold italic">{menu.title}</span>
              {price && <span className="shrink-0 font-semibold tabular-nums">{price}</span>}
            </p>
            <p className="mt-0.5 text-xs text-ink-muted">
              {[count(menu.starters.length, "primero", "primeros"), count(menu.mains.length, "segundo", "segundos"), count(menu.desserts.length, "postre", "postres")].join(" · ")}
              {menu.hours && ` · ${menu.hours}`}
            </p>
          </>
        )}
      </div>

      <Link href="/admin/menu-del-dia" className={buttonClasses("secondary", "md", "mt-4 w-full")}>
        <Pencil className="size-4" aria-hidden />
        {dishes === 0 ? "Preparar el menú" : "Editar menú"}
      </Link>
    </section>
  );
}
