import { Phone } from "lucide-react";
import type { SiteSettings } from "@/lib/settings";
import { WhatsAppIcon } from "../icons";
import { telHref } from "../utils";
import { ReservationForm } from "./ReservationForm";

/** "Reserva tu mesa": explicación + formulario que prepara el mensaje de WhatsApp. */
export function ReservationSection({ settings: s }: { settings: SiteSettings }) {
  return (
    <section id="reservar" aria-labelledby="reservar-title" className="border-t border-primary/15 bg-cream-100">
      <div className="mx-auto grid max-w-[100rem] gap-8 px-5 py-12 md:gap-10 md:px-10 md:py-24 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 lg:px-14 lg:py-32">
        <div className="reveal lg:pt-2">
          <p className="mb-5 flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-primary uppercase">
            <span aria-hidden className="h-px w-10 bg-gold" />
            Reservas
          </p>
          <h2
            id="reservar-title"
            className="font-serif text-[clamp(2.75rem,11vw,7rem)] leading-[0.86] font-extrabold tracking-[-0.035em] text-balance text-primary uppercase italic"
          >
            Reserva tu mesa
          </h2>
          <p className="mt-6 max-w-md text-[1.0625rem] leading-relaxed text-ink-muted text-pretty md:text-lg">
            Elige día, hora y cuántos sois: te abrimos WhatsApp con el mensaje listo. Solo tienes que enviarlo.
          </p>
          {s.reservationsNote && (
            <p className="mt-5 flex max-w-md items-start gap-3 border-l-2 border-gold pl-4 text-base leading-relaxed text-ink">
              <WhatsAppIcon className="mt-0.5 size-4 shrink-0 text-[#1fa855]" />
              {s.reservationsNote}
            </p>
          )}
          <a
            href={telHref(s.phone)}
            className="group mt-8 inline-flex min-h-11 items-center gap-3 text-sm font-bold tracking-[0.12em] text-ink uppercase transition-colors hover:text-primary"
          >
            <span className="flex size-11 items-center justify-center border border-primary/30 text-primary transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-white">
              <Phone aria-hidden className="size-4" />
            </span>
            <span>
              <span className="block text-[0.6875rem] tracking-[0.16em] text-ink-muted">¿Prefieres llamar?</span>
              <span className="tabular-nums">{s.phone}</span>
            </span>
          </a>
        </div>

        <div className="reveal border border-primary bg-cream p-5 shadow-[0_30px_60px_-40px_rgb(28_28_24/0.45)] sm:p-8 lg:p-10">
          <ReservationForm
            siteName={s.name}
            whatsappPhone={s.whatsappPhone}
            phone={s.phone}
            telHref={telHref(s.phone)}
            maxGuests={s.reservationMaxGuests}
            hours={s.openingHours}
            closures={s.specialClosures}
          />
        </div>
      </div>
    </section>
  );
}
