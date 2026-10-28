import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getSiteSettings, getUpcomingEvents, type PublicEvent } from "@/lib/data/public";
import type { SiteSettings } from "@/lib/settings";
import { EventCard } from "@/components/site/events/EventCard";
import { OrganizeCta } from "@/components/site/events/OrganizeCta";
import { InstagramIcon } from "@/components/site/icons";
import { JsonLd } from "@/components/site/JsonLd";
import { pageMetadata, siteUrl } from "@/components/site/seo";
import { instagramUrl, pad2, splitCity } from "@/components/site/utils";

export const revalidate = 3600;

export async function generateMetadata(_: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  const s = await getSiteSettings();
  return pageMetadata(parent, {
    title: "Eventos",
    description: `Próximos eventos en ${s.name} (${splitCity(s.addressCity).locality}): música en directo, gastronomía y noches especiales.`,
    path: "/eventos",
    siteName: s.name,
  });
}

/** Desfase horario de Madrid en una fecha concreta ("+01:00" / "+02:00"). */
function madridOffset(date: string) {
  const name = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Madrid", timeZoneName: "longOffset" })
    .formatToParts(new Date(`${date}T12:00:00Z`))
    .find((p) => p.type === "timeZoneName")?.value;
  return name?.replace("GMT", "") || "+01:00";
}

function eventsJsonLd(s: SiteSettings, events: PublicEvent[]) {
  const { locality, region } = splitCity(s.addressCity);
  return events.map((e) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title,
    ...(e.description && { description: e.description }),
    startDate: `${e.date}T${e.time}:00${madridOffset(e.date)}`,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    ...(e.imageUrl && { image: [e.imageUrl] }),
    url: `${siteUrl}/eventos#evento-${e.id}`,
    location: {
      "@type": "Place",
      name: s.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: s.addressStreet,
        addressLocality: locality,
        ...(region && { addressRegion: region }),
        postalCode: s.addressPostalCode,
        addressCountry: "ES",
      },
    },
    organizer: { "@type": "Organization", name: s.name, url: siteUrl },
  }));
}

export default async function EventosPage() {
  const [settings, events] = await Promise.all([getSiteSettings(), getUpcomingEvents()]);
  // Desactivar eventos en el panel oculta la sección de la portada y también esta página
  if (!settings.eventsEnabled) notFound();

  return (
    <>
      <header className="mx-auto max-w-[100rem] px-5 pt-8 pb-8 md:px-10 md:pt-14 md:pb-12 lg:px-14">
        <p className="mb-4 flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-primary uppercase">
          <span aria-hidden className="h-px w-10 bg-gold" />
          Agenda
          {events.length > 0 && (
            <span className="lg:hidden">
              · {events.length} {events.length === 1 ? "próximo" : "próximos"}
            </span>
          )}
        </p>
        <div className="flex items-end justify-between gap-6 border-b-[3px] border-gold pb-4">
          <h1 className="-ml-[0.04em] font-serif text-[clamp(3.5rem,16vw,13rem)] leading-[0.8] font-extrabold tracking-[-0.045em] text-primary uppercase italic">
            Eventos
          </h1>
          {events.length > 0 && (
            <p className="hidden shrink-0 pb-1 text-right lg:block">
              <span className="block font-serif text-4xl leading-none font-bold text-gold-deep tabular-nums md:text-6xl">{pad2(events.length)}</span>
              <span className="text-xs font-bold tracking-[0.16em] text-ink-muted uppercase">{events.length === 1 ? "próximo" : "próximos"}</span>
            </p>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-[100rem] px-5 pb-16 md:px-10 md:pb-24 lg:px-14 lg:pb-32">
        {events.length > 0 ? (
          <div className="grid gap-px border border-primary bg-primary">
            {events.map((event, i) => (
              <EventCard key={event.id} event={event} reversed={i % 2 === 1} headingLevel="h2" />
            ))}
          </div>
        ) : (
          <EmptyState settings={settings} />
        )}

        <OrganizeCta settings={settings} />
      </div>

      {events.length > 0 && <JsonLd data={eventsJsonLd(settings, events)} />}
    </>
  );
}

function EmptyState({ settings: s }: { settings: SiteSettings }) {
  return (
    <section aria-labelledby="sin-eventos" className="relative isolate overflow-hidden border border-primary bg-primary text-white">
      <span
        aria-hidden
        className="pointer-events-none absolute -right-[4%] -bottom-[18%] -z-10 font-serif text-[clamp(10rem,42vw,30rem)] leading-none font-extrabold glyph-outline text-white/15 italic select-none"
      >
        Pronto
      </span>
      <div className="px-6 py-14 md:px-12 md:py-20 lg:px-16 lg:py-24">
        <p className="mb-5 flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-gold uppercase">
          <span aria-hidden className="size-1.5 animate-pulse-dot bg-gold" />
          Agenda en preparación
        </p>
        <h2 id="sin-eventos" className="max-w-3xl font-serif text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.95] font-extrabold tracking-[-0.03em] text-balance uppercase italic">
          La pizarra está en blanco… por poco tiempo
        </h2>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-white/85 text-pretty md:text-lg">
          Ahora mismo no hay eventos programados. Estamos cocinando las próximas noches de música, catas y sorpresas: síguenos y entérate antes que nadie.
        </p>
        {s.instagramHandle && (
          <a
            href={instagramUrl(s.instagramHandle)}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-9 inline-flex h-14 items-center gap-3 bg-cream px-6 text-sm font-bold tracking-[0.12em] text-ink transition-colors hover:bg-white"
          >
            <InstagramIcon className="size-5 text-primary" />@{s.instagramHandle}
          </a>
        )}
      </div>
    </section>
  );
}
