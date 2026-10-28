import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { PublicEvent } from "@/lib/data/public";
import type { SiteSettings } from "@/lib/settings";
import { EventCard } from "../events/EventCard";
import { OrganizeCta } from "../events/OrganizeCta";
import { pad2 } from "../utils";

const MAX_ON_HOME = 3;

/** Próximos eventos en portada (solo se renderiza si hay alguno). */
export function EventsSection({ settings, events }: { settings: SiteSettings; events: PublicEvent[] }) {
  const shown = events.slice(0, MAX_ON_HOME);

  return (
    <section id="eventos" aria-labelledby="eventos-title" className="mx-auto max-w-[100rem] px-5 py-16 md:px-10 md:py-24 lg:px-14 lg:py-32">
      <div className="mb-8 flex items-end justify-between gap-6 border-b-[3px] border-gold pb-4 md:mb-12">
        <h2
          id="eventos-title"
          className="font-serif text-[clamp(2.5rem,9vw,6rem)] leading-[0.86] font-extrabold tracking-[-0.035em] text-primary uppercase italic"
        >
          Próximos eventos
        </h2>
        <p className="shrink-0 pb-1 font-serif text-2xl font-bold text-gold-deep tabular-nums md:text-4xl">
          <span className="sr-only">Eventos programados: </span>
          {pad2(events.length)}
        </p>
      </div>

      <div className="grid gap-px border border-primary bg-primary">
        {shown.map((event, i) => (
          <EventCard key={event.id} event={event} reversed={i % 2 === 1} />
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <Link
          href="/eventos"
          className="group inline-flex h-11 items-center gap-3 text-sm font-bold tracking-[0.16em] text-primary uppercase underline decoration-gold decoration-2 underline-offset-8 hover:text-primary-dark"
        >
          {events.length > MAX_ON_HOME ? `Ver los ${events.length} eventos` : "Ver la agenda"}
          <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <OrganizeCta settings={settings} headingLevel="h3" />
    </section>
  );
}
