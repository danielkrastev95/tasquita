import { ArrowRight, CalendarCheck, Phone } from "lucide-react";
import Link from "next/link";
import type { PublicEvent } from "@/lib/data/public";
import { formatEventDate, formatPrice } from "@/lib/format";
import { describeDays, formatTime } from "@/lib/schedule";
import type { SiteSettings } from "@/lib/settings";
import { DeliveryLinks, hasDelivery } from "../DeliveryLinks";
import type { Photo } from "../photos";
import { SmartImage } from "../SmartImage";
import { hasDailyMenu } from "../daily-menu/DailyMenuBoard";
import { OpenStatus } from "../OpenStatus";
import { canReserve, capitalize, getSchedule, splitCity, telHref } from "../utils";
import { HeroGrid } from "./HeroGrid";

/**
 * Portada. Móvil: titular → foto → acciones, todo en la primera pantalla.
 * Escritorio: dos columnas con la composición de fotos a la derecha.
 * El titular no depende de ninguna animación para verse.
 */
export function Hero({
  settings: s,
  photos,
  featuredEvent,
}: {
  settings: SiteSettings;
  photos: { main: Photo; secondary: Photo | null };
  featuredEvent: PublicEvent | null;
}) {
  const marquee = s.heroMarquee.trim();
  const reserveHref = canReserve(s) ? "#reservar" : null;
  const dailyMenuPrice = hasDailyMenu(s.dailyMenu) ? formatPrice(s.dailyMenu.priceCents) : null;

  return (
    <section data-hero aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {/* Fondo: rejilla, celdas interactivas y marquesina */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_80%_70%_at_30%_45%,black_25%,transparent_80%)]"
      />
      <HeroGrid />
      {marquee && (
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[4.5rem] -z-10 overflow-hidden select-none lg:top-[32%]">
          <div className="flex w-max animate-marquee">
            {[0, 1].map((i) => (
              <span
                key={i}
                className="shrink-0 pr-[0.35em] font-serif text-[clamp(6.5rem,26vw,17rem)] leading-none font-bold tracking-[-0.02em] whitespace-nowrap text-primary/[0.06] uppercase"
              >
                {marquee} <span className="text-gold/50">•</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-[100rem] px-5 pt-5 pb-14 md:px-10 md:pt-10 md:pb-20 lg:min-h-[min(calc(100svh-var(--header-h)),62rem)] lg:grid-cols-[1.05fr_1fr] lg:grid-rows-[1fr_auto_auto_1fr] lg:gap-x-[clamp(3rem,6vw,7rem)] lg:px-14 lg:py-14">
        {/* Titular */}
        <div className="lg:col-start-1 lg:row-start-2">
          {s.heroBadge && (
            <p className="mb-4 inline-flex animate-rise items-center gap-2.5 bg-primary px-3 py-1.5 text-xs font-bold tracking-[0.16em] text-white uppercase md:mb-6">
              <span aria-hidden className="size-1.5 bg-gold" />
              {s.heroBadge}
            </p>
          )}
          <h1
            id="hero-title"
            className="font-serif text-[clamp(2.75rem,min(14.2vw,13svh),6.5rem)] leading-[0.84] font-extrabold tracking-[-0.035em] text-balance text-primary uppercase lg:text-[clamp(4.5rem,7.2vw,8.5rem)]"
          >
            {s.name}
          </h1>
          {s.heroTagline && (
            <p className="mt-4 max-w-[26rem] text-[1.0625rem] leading-snug text-ink-muted text-pretty md:mt-6 md:text-lg">{s.heroTagline}</p>
          )}
        </div>

        {/* Fotos */}
        <div className="relative mt-7 mb-12 md:mt-10 lg:col-start-2 lg:row-span-4 lg:row-start-1 lg:my-0 lg:self-center">
          <div className="relative mr-[12%] md:mr-[18%] lg:mr-0 lg:ml-[10%]">
            <div className="relative aspect-[16/11] overflow-hidden border-[5px] border-primary bg-ink md:aspect-[16/10] lg:aspect-[4/5] lg:border-[6px]">
              <SmartImage
                src={photos.main.src}
                alt={photos.main.alt}
                fill
                priority
                sizes="(min-width: 1024px) 42vw, (min-width: 768px) 66vw, 80vw"
                className="animate-settle object-cover"
              />
            </div>

            {photos.secondary && (
              <figure className="absolute -right-[13.5%] -bottom-9 w-[50%] animate-rise border-4 border-primary bg-primary [animation-delay:250ms] md:-right-[21%] md:w-[38%] lg:right-auto lg:-bottom-14 lg:-left-[16%] lg:w-[46%] lg:border-[5px]">
                <div className="relative aspect-[4/3] overflow-hidden bg-cream-300">
                  <SmartImage
                    src={photos.secondary.src}
                    alt={photos.secondary.alt}
                    fill
                    sizes="(min-width: 1024px) 20vw, 44vw"
                    className="object-cover"
                  />
                </div>
                {s.heroKitchenLabel && (
                  <figcaption className="truncate px-2.5 pt-2 pb-1.5 text-[0.6875rem] leading-tight font-bold tracking-[0.12em] text-white uppercase md:text-xs md:tracking-[0.16em]">
                    {s.heroKitchenLabel}
                  </figcaption>
                )}
              </figure>
            )}

            {featuredEvent && <HeroEventTag event={featuredEvent} />}
          </div>
        </div>

        {/* Acciones */}
        <div className="lg:col-start-1 lg:row-start-3 lg:mt-10">
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
            <Link
              href="/carta"
              className="group inline-flex h-14 items-center justify-between gap-3 bg-primary px-4 text-sm font-bold tracking-[0.14em] text-white uppercase transition-colors hover:bg-primary-dark active:translate-y-px sm:justify-start sm:gap-6 sm:px-8 sm:tracking-[0.2em]"
            >
              {s.heroCtaText}
              <ArrowRight aria-hidden className="size-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            {reserveHref ? (
              <Link
                href={reserveHref}
                className="inline-flex h-14 items-center justify-center gap-2.5 border-2 border-primary px-4 text-sm font-bold tracking-[0.14em] text-primary uppercase transition-colors hover:bg-primary hover:text-white active:translate-y-px sm:px-7 sm:tracking-[0.2em]"
              >
                <CalendarCheck aria-hidden className="size-4 shrink-0" />
                Reservar
              </Link>
            ) : (
              <a
                href={telHref(s.phone)}
                className="inline-flex h-14 items-center justify-center gap-2.5 border-2 border-primary px-4 text-sm font-bold tracking-[0.14em] text-primary uppercase transition-colors hover:bg-primary hover:text-white active:translate-y-px sm:px-7 sm:tracking-[0.2em]"
              >
                <Phone aria-hidden className="size-4 shrink-0" />
                Llamar
              </a>
            )}
          </div>
          {hasDelivery(s) && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 sm:justify-start">
              <p className="text-xs font-bold tracking-[0.18em] text-ink-muted uppercase">{s.heroDeliveryLabel}</p>
              <DeliveryLinks glovoUrl={s.glovoUrl} uberEatsUrl={s.uberEatsUrl} />
            </div>
          )}

          {/* Ficha rápida (escritorio): rellena el pie de la columna con datos útiles */}
          <dl className="mt-12 hidden grid-cols-3 gap-px border-y border-primary/20 bg-primary/20 lg:grid">
            <div className="bg-cream py-4 pr-5">
              <dt className="text-[0.6875rem] font-bold tracking-[0.18em] text-gold-deep uppercase">Hoy</dt>
              <dd className="mt-1.5">
                <OpenStatus schedule={getSchedule(s)} className="text-[0.8125rem] leading-snug text-ink" />
              </dd>
            </div>
            <div className="bg-cream px-5 py-4">
              <dt className="text-[0.6875rem] font-bold tracking-[0.18em] text-gold-deep uppercase">Dónde</dt>
              <dd className="mt-1.5 text-[0.8125rem] leading-snug font-semibold text-ink">
                {s.addressStreet}
                <span className="block font-normal text-ink-muted">{splitCity(s.addressCity).locality}</span>
              </dd>
            </div>
            <div className="bg-cream py-4 pl-5">
              {dailyMenuPrice ? (
                <>
                  <dt className="text-[0.6875rem] font-bold tracking-[0.18em] text-gold-deep uppercase">{s.dailyMenu.title}</dt>
                  <dd className="mt-1.5 text-[0.8125rem] leading-snug font-semibold text-ink">
                    <Link href="/#menu-del-dia" className="underline decoration-primary/30 underline-offset-4 hover:text-primary hover:decoration-primary">
                      {dailyMenuPrice}
                    </Link>
                    <span className="block font-normal text-ink-muted">{describeDays(s.dailyMenu.days)}</span>
                  </dd>
                </>
              ) : (
                <>
                  <dt className="text-[0.6875rem] font-bold tracking-[0.18em] text-gold-deep uppercase">Teléfono</dt>
                  <dd className="mt-1.5 text-[0.8125rem] leading-snug font-semibold text-ink">
                    <a href={telHref(s.phone)} className="tabular-nums hover:text-primary">
                      {s.phone}
                    </a>
                    <span className="block font-normal text-ink-muted">{reserveHref ? "Reservas por WhatsApp" : "Llámanos"}</span>
                  </dd>
                </>
              )}
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

function HeroEventTag({ event }: { event: PublicEvent }) {
  const d = formatEventDate(event.date);
  return (
    <Link
      href={`/eventos#evento-${event.id}`}
      className="group absolute -top-3 left-3 z-10 block max-w-[78%] animate-rise bg-primary px-3.5 py-2.5 text-white shadow-[0_18px_40px_-18px_rgb(28_28_24/0.6)] transition-colors [animation-delay:450ms] hover:bg-primary-dark lg:top-10 lg:-right-8 lg:left-auto lg:max-w-[17rem] lg:px-5 lg:py-4"
    >
      <span className="flex items-center gap-2 text-[0.6875rem] font-bold tracking-[0.16em] uppercase lg:text-xs">
        <span aria-hidden className="size-1.5 shrink-0 animate-pulse-dot bg-gold" />
        <span className="hidden lg:inline">Próximo evento</span>
        <span className="lg:hidden">
          Evento · {d.weekday.slice(0, 3)} {Number(d.day)} {d.monthShort}
        </span>
      </span>
      <span className="mt-1 flex items-center gap-2 font-serif text-[1.05rem] leading-[1.1] font-bold lg:mt-1.5 lg:block lg:text-xl lg:text-balance">
        <span className="line-clamp-2 lg:line-clamp-none">{event.title}</span>
        <ArrowRight aria-hidden className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 lg:hidden" />
      </span>
      <span className="mt-1.5 hidden items-center gap-1.5 text-sm font-semibold text-white/85 lg:flex">
        {capitalize(d.weekday)} {Number(d.day)} {d.monthShort} · {formatTime(event.time)} h
        <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
