import { ArrowUpRight, Mail, Star } from "lucide-react";
import Link from "next/link";
import type { SiteSettings } from "@/lib/settings";
import { EmailText, InstagramIcon } from "./icons";
import { LEGAL_PAGES } from "./legal/LegalPage";
import { currentYear, instagramUrl, splitLastWord, telHref, type NavLink } from "./utils";

const label = "mb-3 text-xs font-bold tracking-[0.18em] text-gold uppercase";

export function SiteFooter({ settings: s, links }: { settings: SiteSettings; links: NavLink[] }) {
  const { head, last } = splitLastWord(s.name);

  return (
    <footer className="on-dark bg-ink text-white">
      <div aria-hidden className="h-[3px] bg-gold" />
      <div className="mx-auto grid max-w-[100rem] gap-px bg-white/10 lg:grid-cols-[1.15fr_1fr]">
        {/* Marca */}
        <div className="flex flex-col justify-between gap-8 bg-ink px-5 py-12 md:px-10 lg:px-14 lg:py-16">
          <div>
            {s.footerEstLabel && <p className={label}>{s.footerEstLabel}</p>}
            <p className="font-serif text-[clamp(2.75rem,10vw,5.25rem)] leading-[0.86] font-extrabold tracking-[-0.03em] uppercase italic text-balance">
              {head && <>{head} </>}
              <span className="text-gold">{last}</span>
            </p>
          </div>
          <div className="flex flex-col gap-5">
            {s.footerTagline && <p className="max-w-sm text-[0.9375rem] leading-relaxed text-white/65 text-pretty">{s.footerTagline}</p>}
            {s.googleReviewsUrl && (
              <div>
                <p className={label}>¿Te ha gustado?</p>
                <a
                  href={s.googleReviewsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-11 w-fit items-center gap-3 border border-white/20 px-4 text-sm font-semibold text-white/85 transition-colors hover:border-gold hover:text-white"
                >
                  <span aria-hidden className="flex gap-0.5 text-gold">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className="size-3.5 fill-current" />
                    ))}
                  </span>
                  Déjanos tu reseña en Google
                  <ArrowUpRight aria-hidden className="size-4 text-gold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  <span className="sr-only">(se abre en otra pestaña)</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Datos */}
        <div className="grid grid-flow-row-dense grid-cols-2 content-start gap-x-6 gap-y-10 bg-ink px-5 py-12 md:px-10 lg:px-14 lg:py-16">
          <div>
            <p className={label}>Teléfono</p>
            <a href={telHref(s.phone)} className="font-serif text-xl font-bold whitespace-nowrap italic transition-colors hover:text-gold md:text-2xl">
              {s.phone}
            </a>
          </div>
          {s.instagramHandle && (
            <div className="col-span-2 min-w-0 sm:col-span-1">
              <p className={label}>Instagram</p>
              <a
                href={instagramUrl(s.instagramHandle)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex max-w-full items-center gap-2 font-serif text-xl font-bold italic transition-colors hover:text-gold md:text-2xl"
              >
                <InstagramIcon className="size-5 shrink-0 text-gold" />
                <span className="truncate">@{s.instagramHandle}</span>
              </a>
            </div>
          )}
          {s.email && (
            <div className="col-span-2 min-w-0">
              <p className={label}>Email</p>
              <a
                href={`mailto:${s.email}`}
                className="inline-flex max-w-full items-center gap-2 font-serif text-xl font-bold break-words italic transition-colors hover:text-gold md:text-2xl"
              >
                <Mail aria-hidden className="size-5 shrink-0 text-gold" />
                <span className="min-w-0">
                  <EmailText email={s.email} />
                </span>
              </a>
            </div>
          )}
          <div>
            <p className={label}>Dirección</p>
            <address className="text-[0.9375rem] leading-relaxed text-white/75 not-italic">
              {s.addressStreet}
              <br />
              {s.addressPostalCode} {s.addressCity}
            </address>
          </div>
          <nav aria-label="Pie de página" className="col-span-2 sm:col-span-1">
            <p className={label}>Explora</p>
            <ul className="-my-2 flex flex-wrap gap-x-6 sm:block">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-10 items-center text-sm font-bold tracking-[0.1em] text-white/75 uppercase transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-t border-white/10">
        {/* En móvil deja sitio a la barra de acciones fija */}
        <div className="mx-auto flex max-w-[100rem] flex-col gap-3 px-5 pt-5 pb-[calc(1.25rem+4rem+env(safe-area-inset-bottom))] text-xs text-white/60 md:flex-row md:items-center md:justify-between md:px-10 md:pb-5 lg:px-14">
          <p className="flex items-center gap-2">
            <span aria-hidden className="size-1.5 bg-gold" />© {currentYear()} {s.name} · {s.addressCity}
          </p>
          <nav aria-label="Información legal">
            <ul className="-mx-2 flex flex-wrap">
              {LEGAL_PAGES.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex min-h-10 items-center px-2 tracking-[0.06em] transition-colors hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
