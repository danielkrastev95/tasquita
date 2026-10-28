import { ArrowRight, ArrowUpRight, Mail, MapPin } from "lucide-react";
import type { SiteSettings } from "@/lib/settings";
import { cn } from "@/lib/utils";
import { EmailText, InstagramIcon } from "../icons";
import { OpeningHoursList } from "../OpeningHoursList";
import { OpenStatus } from "../OpenStatus";
import { SmartImage } from "../SmartImage";
import { directionsUrl, instagramUrl, mapEmbedUrl, mapsUrl, telHref } from "../utils";
import { MapFacade } from "./MapFacade";

const cell = "bg-cream px-5 py-10 md:px-10 md:py-12 lg:px-14";
const number = "text-xs font-bold tracking-[0.16em] text-primary tabular-nums";
const cellTitle = "mt-5 border-t border-primary/20 pt-6 font-serif text-[1.85rem] leading-none font-extrabold text-ink uppercase italic md:text-[2.25rem]";

export function ContactSection({ settings: s }: { settings: SiteSettings }) {
  return (
    <section id="contacto" aria-labelledby="contacto-title">
      {/* Banda oscura con titular gigante */}
      <div className="relative isolate overflow-hidden bg-ink text-white">
        {s.contactImage && <SmartImage src={s.contactImage} alt="" fill sizes="100vw" className="-z-20 object-cover opacity-40" />}
        <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-ink/90 via-ink/50 to-ink/30" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-grain opacity-[0.07] mix-blend-overlay" />
        <div className="mx-auto flex min-h-[20rem] max-w-[100rem] flex-col justify-end px-5 pt-20 pb-12 md:min-h-[30rem] md:px-10 md:pb-16 lg:px-14">
          <p className="reveal mb-4 flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-gold uppercase">
            <span aria-hidden className="h-px w-10 bg-gold" />
            Encuéntranos
          </p>
          <h2
            id="contacto-title"
            className="reveal font-serif text-[clamp(3.25rem,15vw,11rem)] leading-[0.84] font-extrabold tracking-[-0.04em] uppercase italic"
          >
            {s.contactSectionTitle}
          </h2>
        </div>
      </div>

      <div className="grid gap-px border-b border-primary bg-primary lg:grid-cols-2">
        <div className="grid gap-px">
          {/* Dirección */}
          <div className={cell}>
            <p className={number}>01</p>
            <h3 className={cellTitle}>Dirección</h3>
            <address className="mt-5 text-[1.0625rem] leading-relaxed text-ink-muted not-italic">
              {s.addressStreet}
              <br />
              <span className="font-semibold text-primary">{s.addressPostalCode}</span> {s.addressCity}
            </address>
            <a
              href={directionsUrl(s.latitude, s.longitude)}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-7 inline-flex h-12 items-center gap-3 bg-primary px-6 text-xs font-bold tracking-[0.18em] text-white uppercase transition-colors hover:bg-primary-dark"
            >
              Cómo llegar
              <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              <span className="sr-only">(Google Maps, se abre en otra pestaña)</span>
            </a>
          </div>

          {/* Horario */}
          <div className={cell}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className={number}>02</p>
              <OpenStatus hours={s.openingHours} className="text-ink" />
            </div>
            <h3 className={cellTitle}>Horario</h3>
            <OpeningHoursList hours={s.openingHours} className="mt-4 pl-3" />
            {s.hoursNote && (
              <p className="mt-5 border-l-2 border-gold pl-4 text-sm leading-relaxed text-ink-muted text-pretty">{s.hoursNote}</p>
            )}
          </div>
        </div>

        {/* Mapa */}
        <div className="flex flex-col bg-cream">
          <p className="flex items-center gap-3 bg-primary px-5 py-4 text-white md:px-10 lg:px-8">
            <MapPin aria-hidden className="size-4 shrink-0 text-white/80" />
            <span className="font-serif text-lg font-bold uppercase italic">Encuéntranos aquí</span>
          </p>
          <MapFacade
            embedUrl={mapEmbedUrl(s.latitude, s.longitude)}
            openUrl={mapsUrl(s.latitude, s.longitude)}
            title={`Mapa: ${s.name}, ${s.addressStreet}, ${s.addressCity}`}
            street={s.addressStreet}
            cityLine={`${s.addressPostalCode} ${s.addressCity}`}
          />
        </div>
      </div>

      {/* Teléfono + Instagram + email: si quedan impares, el último ocupa la fila entera */}
      <div className="grid gap-px bg-primary md:grid-cols-2">
        <a
          href={telHref(s.phone)}
          className={cn(
            "group flex items-center justify-between gap-6 bg-primary px-5 py-9 text-white transition-colors hover:bg-primary-dark md:px-10 md:py-12 lg:px-14",
            !s.instagramHandle && !s.email && "md:col-span-2",
          )}
        >
          <span className="min-w-0">
            <span className="block text-xs font-bold tracking-[0.18em] text-white/75 uppercase">{s.contactPhoneLabel}</span>
            <span className="mt-2 block font-serif text-[clamp(2.25rem,9vw,3.75rem)] leading-none font-extrabold tracking-[-0.03em] whitespace-nowrap italic tabular-nums">
              {s.phone}
            </span>
          </span>
          <ArrowRight aria-hidden className="size-6 shrink-0 text-white/60 transition-transform duration-300 group-hover:translate-x-1.5" />
        </a>
        {s.instagramHandle && (
          <a
            href={instagramUrl(s.instagramHandle)}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-6 bg-cream px-5 py-9 transition-colors hover:bg-cream-100 md:px-10 md:py-12 lg:px-14"
          >
            <span className="min-w-0">
              <span className="block text-xs font-bold tracking-[0.18em] text-primary uppercase">{s.contactSocialLabel}</span>
              <span className="mt-2 block truncate font-serif text-[clamp(1.6rem,6.5vw,2.75rem)] leading-tight font-extrabold tracking-[-0.025em] text-ink italic">
                @{s.instagramHandle}
              </span>
            </span>
            <InstagramIcon className="size-7 shrink-0 text-gold-deep transition-transform duration-300 group-hover:scale-110" />
          </a>
        )}
        {s.email && (
          <a
            href={`mailto:${s.email}`}
            className={cn(
              "group flex items-center justify-between gap-6 bg-cream px-5 py-9 transition-colors hover:bg-cream-100 md:px-10 md:py-12 lg:px-14",
              s.instagramHandle && "md:col-span-2",
            )}
          >
            <span className="min-w-0">
              <span className="block text-xs font-bold tracking-[0.18em] text-primary uppercase">Escríbenos</span>
              <span className="mt-2 block font-serif text-[clamp(1.35rem,5.5vw,2.5rem)] leading-tight font-extrabold tracking-[-0.02em] break-words text-ink italic">
                <EmailText email={s.email} />
              </span>
            </span>
            <Mail aria-hidden className="size-7 shrink-0 text-gold-deep transition-transform duration-300 group-hover:scale-110" />
          </a>
        )}
      </div>
    </section>
  );
}
