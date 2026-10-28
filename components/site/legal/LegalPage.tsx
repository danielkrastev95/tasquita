import Link from "next/link";
import type { SiteSettings } from "@/lib/settings";
import { cn } from "@/lib/utils";

export const LEGAL_PAGES = [
  { href: "/aviso-legal", label: "Aviso legal" },
  { href: "/privacidad", label: "Privacidad" },
  { href: "/cookies", label: "Cookies" },
] as const;

export const LEGAL_UPDATED = "28 de octubre de 2026";

/** Datos del titular con sus alternativas: nunca se muestran líneas vacías. */
export function legalData(s: SiteSettings) {
  return {
    holder: s.legalName || null,
    taxId: s.legalTaxId || null,
    tradeName: s.name,
    address: s.legalAddress || `${s.addressStreet}, ${s.addressPostalCode} ${s.addressCity}`,
    email: s.legalEmail || s.email || null,
    phone: s.phone || null,
  };
}

/** Ficha "Titular / NIF / Domicilio / Email…" (solo las filas con dato). */
export function HolderList({ settings }: { settings: SiteSettings }) {
  const d = legalData(settings);
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Titular", value: d.holder },
    { label: "NIF", value: d.taxId },
    { label: "Nombre comercial", value: d.tradeName },
    { label: "Domicilio", value: d.address },
    { label: "Email", value: d.email && <a href={`mailto:${d.email}`}>{d.email}</a> },
    { label: "Teléfono", value: d.phone },
  ].filter((r) => r.value);
  return (
    <dl className="mt-5 grid gap-px border border-primary/25 bg-primary/25 sm:grid-cols-[12rem_1fr]">
      {rows.map((r) => (
        <div key={r.label} className="bg-cream px-4 py-3 sm:contents">
          <dt className="text-xs font-bold tracking-[0.14em] text-primary uppercase sm:bg-cream-100 sm:px-4 sm:py-3.5">{r.label}</dt>
          <dd className="mt-1 text-[0.9375rem] break-words text-ink sm:mt-0 sm:bg-cream sm:px-4 sm:py-3">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Plantilla común de las páginas legales. */
export function LegalPage({ title, path, children }: { title: string; path: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[100rem] px-5 pt-8 pb-20 md:px-10 md:pt-14 md:pb-28 lg:px-14">
      <header className="border-b-[3px] border-gold pb-5">
        <p className="mb-4 flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-primary uppercase">
          <span aria-hidden className="h-px w-10 bg-gold" />
          Información legal
        </p>
        <h1 className="font-serif text-[clamp(2.75rem,11vw,7rem)] leading-[0.86] font-extrabold tracking-[-0.035em] text-balance text-primary uppercase italic">
          {title}
        </h1>
      </header>

      <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
        <nav aria-label="Páginas legales" className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
          <ul className="grid grid-cols-3 gap-px border border-primary/25 bg-primary/25 lg:flex lg:flex-col lg:gap-0 lg:border-0 lg:border-l lg:border-primary/20 lg:bg-transparent">
            {LEGAL_PAGES.map((p) => {
              const active = p.href === path;
              return (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 items-center justify-center px-2 text-center text-xs font-bold tracking-[0.12em] uppercase transition-colors lg:-ml-px lg:justify-start lg:border-l-2 lg:px-4 lg:text-left",
                      active
                        ? "bg-primary text-white lg:border-primary lg:bg-transparent lg:text-primary"
                        : "bg-cream text-ink hover:text-primary lg:border-transparent lg:bg-transparent lg:hover:border-primary/40",
                    )}
                  >
                    {p.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <article className="prose-legal max-w-3xl">
          {children}
          <p className="mt-12! border-t border-primary/15 pt-5 text-sm!">Última actualización: {LEGAL_UPDATED}.</p>
        </article>
      </div>
    </div>
  );
}
