import { Clock } from "lucide-react";
import type { PublicEvent } from "@/lib/data/public";
import type { EventCategory } from "@/lib/db/schema";
import { formatEventDate } from "@/lib/format";
import { formatTime } from "@/lib/schedule";
import { cn } from "@/lib/utils";
import { SmartImage } from "../SmartImage";
import { capitalize } from "../utils";
import { EventActions } from "./EventActions";

/** Etiqueta de cada categoría y color del bloque cuando el evento no tiene foto. */
export const EVENT_CATEGORY: Record<EventCategory, { label: string; className: string; panel: string }> = {
  musica: { label: "Música en vivo", className: "bg-primary text-white", panel: "bg-primary-dark" },
  gastronomia: { label: "Gastronomía", className: "bg-gold text-ink", panel: "bg-gold-deep" },
  deporte: { label: "Deporte en directo", className: "bg-cream text-sport", panel: "bg-sport" },
  especial: { label: "Especial", className: "bg-gold text-ink", panel: "bg-ink" },
};

/** Datos para las acciones de cada evento (reservar, calendario, compartir). */
export type EventActionsContext = { siteName: string; reservePhone: string | null; telHref: string };

/** Tarjeta de evento: foto (o bloque tipográfico) + fecha tipo "entrada" + texto. */
export function EventCard({
  event,
  reversed = false,
  headingLevel: Heading = "h3",
  actions,
}: {
  event: PublicEvent;
  reversed?: boolean;
  headingLevel?: "h2" | "h3";
  actions: EventActionsContext;
}) {
  const d = formatEventDate(event.date);
  const category = EVENT_CATEGORY[event.category] ?? EVENT_CATEGORY.especial;

  return (
    <article
      id={`evento-${event.id}`}
      className="grid scroll-mt-[calc(var(--header-h)+1.5rem)] gap-px bg-primary lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
    >
      <div
        className={cn(
          "relative aspect-[16/10] overflow-hidden md:aspect-[16/8] lg:aspect-auto lg:min-h-[26rem]",
          event.imageUrl ? "bg-primary-dark" : category.panel,
          reversed && "lg:order-2",
        )}
      >
        {event.imageUrl ? (
          <SmartImage
            src={event.imageUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="object-cover transition-transform duration-[1.2s] ease-out-expo hover:scale-[1.03]"
          />
        ) : (
          <div aria-hidden className="absolute inset-0 flex items-end justify-end overflow-hidden p-4">
            <span aria-hidden className="absolute inset-0 bg-grain opacity-10 mix-blend-overlay" />
            <span className="translate-x-[6%] translate-y-[18%] font-serif text-[clamp(12rem,40vw,22rem)] leading-none font-extrabold glyph-outline text-white/30 italic">
              {d.day}
            </span>
          </div>
        )}
        <span className={cn("absolute top-0 left-0 px-3 py-2 text-xs font-bold tracking-[0.16em] uppercase", category.className)}>
          {category.label}
        </span>
      </div>

      <div className="flex flex-col bg-cream p-6 md:p-10 lg:p-12">
        <p className="flex items-center gap-4">
          <span className="font-serif text-[4.25rem] leading-[0.8] font-extrabold tracking-[-0.04em] text-primary tabular-nums md:text-[5.5rem]">
            {d.day}
          </span>
          <span className="flex flex-col gap-1 border-l-2 border-gold pl-4">
            <span className="text-sm font-bold tracking-[0.18em] text-ink uppercase">
              {d.monthName} {d.year}
            </span>
            <span className="flex flex-wrap items-center gap-x-1.5 text-sm whitespace-nowrap text-ink-muted">
              {capitalize(d.weekday)}
              <span aria-hidden>·</span>
              <Clock aria-hidden className="size-3.5" />
              {formatTime(event.time)} h
            </span>
          </span>
        </p>

        <Heading className="mt-7 font-serif text-[clamp(2rem,5.5vw,3.5rem)] leading-[0.95] font-extrabold tracking-[-0.025em] text-balance text-ink uppercase italic md:mt-9">
          {event.title}
        </Heading>
        {event.description && (
          <p className="mt-4 max-w-prose text-[0.9375rem] leading-relaxed whitespace-pre-line text-ink-muted text-pretty md:text-base">
            {event.description}
          </p>
        )}
        <div className="mt-auto flex flex-col gap-5 pt-7">
          {event.isFeatured && (
            <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-gold-deep uppercase">
              <span aria-hidden className="size-1.5 bg-gold" />
              Evento destacado
            </p>
          )}
          <EventActions
            id={event.id}
            title={event.title}
            when={`${d.long} a las ${formatTime(event.time)}`}
            siteName={actions.siteName}
            reservePhone={actions.reservePhone}
            telHref={actions.telHref}
          />
        </div>
      </div>
    </article>
  );
}
