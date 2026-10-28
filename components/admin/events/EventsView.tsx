"use client";

import { CalendarDays, CalendarPlus, EyeOff, History, Repeat, Star, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useOptimistic, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { buttonClasses } from "@/components/ui/Button";
import { setEventActive, setEventFeatured } from "@/lib/actions/events";
import type { AdminEvent } from "@/lib/data/admin";
import { formatEventDate } from "@/lib/format";
import { formatTime } from "@/lib/schedule";
import { cn } from "@/lib/utils";
import { EVENT_CATEGORY_LABELS } from "@/lib/validations/events";
import { Badge } from "../Badge";
import { EmptyState } from "../EmptyState";
import { RemoteImg } from "../RemoteImg";
import { ToggleSwitch } from "../ToggleSwitch";

type Lists = { upcoming: AdminEvent[]; past: AdminEvent[] };
type ListAction = { type: "active"; id: string; value: boolean } | { type: "featured"; id: string; value: boolean };

function reducer(state: Lists, action: ListAction): Lists {
  const update = (list: AdminEvent[]) =>
    list.map((e) => {
      if (action.type === "active") return e.id === action.id ? { ...e, isActive: action.value } : e;
      // Solo un destacado: al marcar uno, los demás se desmarcan.
      if (e.id === action.id) return { ...e, isFeatured: action.value };
      return action.value ? { ...e, isFeatured: false } : e;
    });
  return { upcoming: update(state.upcoming), past: update(state.past) };
}

type Tab = "upcoming" | "past";

export function EventsView({
  upcoming,
  past,
  eventsEnabled,
  heroEnabled,
}: {
  upcoming: AdminEvent[];
  past: AdminEvent[];
  eventsEnabled: boolean;
  heroEnabled: boolean;
}) {
  const [lists, apply] = useOptimistic<Lists, ListAction>({ upcoming, past }, reducer);
  const [, startTransition] = useTransition();
  const [tab, setTab] = useState<Tab>("upcoming");
  const tabRefs = useRef<Record<Tab, HTMLButtonElement | null>>({ upcoming: null, past: null });

  const run = (action: ListAction, request: () => Promise<{ ok: boolean; error?: string }>, success: string) =>
    startTransition(async () => {
      apply(action);
      const result = await request();
      if (result.ok) toast.success(success, { duration: 2500 });
      else toast.error(result.error ?? "No se ha podido guardar");
    });

  const toggleActive = (event: AdminEvent, value: boolean) =>
    run({ type: "active", id: event.id, value }, () => setEventActive(event.id, value), value ? `«${event.title}» visible en la web` : `«${event.title}» oculto en la web`);

  const toggleFeatured = (event: AdminEvent) => {
    const value = !event.isFeatured;
    run(
      { type: "featured", id: event.id, value },
      () => setEventFeatured(event.id, value),
      value ? `«${event.title}» es ahora el evento destacado` : `«${event.title}» ya no está destacado`,
    );
  };

  const featured = lists.upcoming.find((e) => e.isFeatured);
  const current = tab === "upcoming" ? lists.upcoming : lists.past;

  const onTabKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const next: Tab = tab === "upcoming" ? "past" : "upcoming";
    setTab(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <>
      {!eventsEnabled && (
        <Notice>
          La sección de eventos está <strong>oculta en la web</strong>: lo que publiques aquí no se verá hasta que la actives.{" "}
          <Link href="/admin/contenido/eventos" className="font-semibold underline underline-offset-2">
            Activarla en Contenido
          </Link>
        </Notice>
      )}
      {eventsEnabled && featured && !heroEnabled && (
        <Notice>
          «{featured.title}» está destacado, pero el aviso de evento en la portada está desactivado.{" "}
          <Link href="/admin/contenido/portada" className="font-semibold underline underline-offset-2">
            Cambiarlo en Portada
          </Link>
        </Notice>
      )}

      <div role="tablist" aria-label="Eventos" className="mb-4 inline-flex w-full rounded-2xl bg-cream-300/70 p-1 sm:w-auto" onKeyDown={onTabKeyDown}>
        {(
          [
            ["upcoming", "Próximos", lists.upcoming.length],
            ["past", "Pasados", lists.past.length],
          ] as const
        ).map(([key, label, count]) => (
          <button
            key={key}
            ref={(node) => {
              tabRefs.current[key] = node;
            }}
            type="button"
            role="tab"
            id={`tab-${key}`}
            aria-selected={tab === key}
            aria-controls={`panel-${key}`}
            tabIndex={tab === key ? 0 : -1}
            onClick={() => setTab(key)}
            className={cn(
              "flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition sm:flex-none",
              tab === key ? "bg-white text-ink shadow-sm" : "text-ink-muted hover:text-ink",
            )}
          >
            {label}
            <span className={cn("rounded-full px-1.5 text-xs tabular-nums", tab === key ? "bg-primary-light text-primary-dark" : "bg-cream-400/60")}>{count}</span>
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {current.length === 0 ? (
          tab === "upcoming" ? (
            <EmptyState
              icon={CalendarDays}
              title="No hay eventos próximos"
              action={
                <Link href="/admin/eventos/nuevo" className={buttonClasses("primary")}>
                  <CalendarPlus className="size-4" aria-hidden /> Crear evento
                </Link>
              }
            >
              {lists.past.length > 0 ? "¿Repites alguno? En «Pasados» puedes copiar uno con fecha nueva." : "Música en directo, catas, partidos… Anúncialos aquí y aparecerán en la web."}
            </EmptyState>
          ) : (
            <EmptyState icon={History} title="Aún no hay eventos pasados">
              Cuando pase la fecha de un evento, lo encontrarás aquí para repetirlo si quieres.
            </EmptyState>
          )
        ) : (
          <ul className="space-y-3">
            {current.map((event) => (
              <EventRow
                key={event.id}
                event={event}
                past={tab === "past"}
                onToggleActive={(v) => toggleActive(event, v)}
                onToggleFeatured={() => toggleFeatured(event)}
              />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-start gap-3 rounded-2xl border border-gold/50 bg-gold/10 p-4 text-sm leading-relaxed text-ink">
      <TriangleAlert className="mt-0.5 size-4 shrink-0 text-gold-deep" aria-hidden />
      <p>{children}</p>
    </div>
  );
}

function EventRow({
  event,
  past,
  onToggleActive,
  onToggleFeatured,
}: {
  event: AdminEvent;
  past: boolean;
  onToggleActive: (value: boolean) => void;
  onToggleFeatured: () => void;
}) {
  const date = formatEventDate(event.date);
  const muted = past || !event.isActive;
  return (
    <li className={cn("flex items-stretch overflow-hidden rounded-2xl border bg-white", event.isFeatured && !past ? "border-gold/60 ring-1 ring-gold/30" : "border-cream-400/70")}>
      <Link href={`/admin/eventos/${event.id}`} className="flex min-w-0 flex-1 items-center gap-3 p-3 transition hover:bg-cream-100 sm:gap-4 sm:p-4">
        <span
          className={cn(
            "flex w-14 shrink-0 flex-col items-center rounded-xl py-2",
            muted ? "bg-cream-200 text-ink-muted" : "bg-primary-light text-primary-dark",
          )}
        >
          <span className="text-[11px] font-semibold uppercase">{date.weekday.slice(0, 3)}</span>
          <span className="text-xl leading-tight font-bold tabular-nums">{date.day}</span>
          <span className="text-[11px] font-semibold uppercase">{date.monthShort}</span>
        </span>
        {event.imageUrl && (
          <span className={cn("hidden size-16 shrink-0 overflow-hidden rounded-xl bg-cream-200 sm:block", muted && "opacity-60 grayscale")}>
            <RemoteImg src={event.imageUrl} width={128} aspectRatio="1:1" className="size-full" />
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className={cn("line-clamp-2 leading-snug font-semibold", muted ? "text-ink-muted" : "text-ink")}>{event.title}</span>
          <span className="mt-0.5 block text-sm text-ink-muted">
            {formatTime(event.time)} h · {EVENT_CATEGORY_LABELS[event.category]}
            {past && ` · ${date.year}`}
          </span>
          {(event.isFeatured || !event.isActive) && (
            <span className="mt-1.5 flex flex-wrap gap-1.5">
              {event.isFeatured && !past && (
                <Badge icon={Star} tone="gold">
                  Destacado
                </Badge>
              )}
              {!event.isActive && (
                <Badge icon={EyeOff} tone="muted">
                  Oculto
                </Badge>
              )}
            </span>
          )}
        </span>
      </Link>
      <div className="flex shrink-0 flex-col items-center justify-center gap-0.5 border-l border-cream-300 px-1">
        {past ? (
          <Link
            href={`/admin/eventos/nuevo?desde=${event.id}`}
            className="inline-flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-xl px-2 text-[11px] font-semibold text-primary transition hover:bg-primary-light"
          >
            <Repeat className="size-4" aria-hidden />
            Repetir
            <span className="sr-only"> «{event.title}» con otra fecha</span>
          </Link>
        ) : (
          <>
            <ToggleSwitch checked={event.isActive} onCheckedChange={onToggleActive} label={`Mostrar «${event.title}» en la web`} />
            <button
              type="button"
              onClick={onToggleFeatured}
              aria-pressed={event.isFeatured}
              aria-label={event.isFeatured ? `Quitar «${event.title}» como destacado` : `Destacar «${event.title}» en la portada`}
              title={event.isFeatured ? "Quitar destacado" : "Destacar en la portada"}
              className={cn(
                "inline-flex size-11 items-center justify-center rounded-full transition",
                event.isFeatured ? "text-gold-deep hover:bg-gold/15" : "text-ink-muted/60 hover:bg-cream-200 hover:text-ink",
              )}
            >
              <Star className={cn("size-5", event.isFeatured && "fill-gold")} aria-hidden />
            </button>
          </>
        )}
      </div>
    </li>
  );
}
