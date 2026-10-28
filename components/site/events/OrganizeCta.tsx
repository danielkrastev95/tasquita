import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { SiteSettings } from "@/lib/settings";

/** "Organiza tu evento": llamada a la acción hacia contacto. */
export function OrganizeCta({ settings: s, headingLevel: Heading = "h2" }: { settings: SiteSettings; headingLevel?: "h2" | "h3" }) {
  if (!s.eventsOrgTitle) return null;
  return (
    <div className="reveal mt-16 flex flex-col gap-8 border-t-8 border-gold pt-8 md:mt-24 md:flex-row md:items-end md:justify-between md:gap-12 md:pt-12">
      <div className="max-w-3xl">
        <Heading className="font-serif text-[clamp(2.75rem,10vw,8rem)] leading-[0.86] font-extrabold tracking-[-0.035em] text-balance text-primary uppercase italic">
          {s.eventsOrgTitle}
        </Heading>
        {s.eventsOrgDesc && <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-muted text-pretty md:text-lg">{s.eventsOrgDesc}</p>}
      </div>
      <Link
        href="/#contacto"
        className="group inline-flex h-16 shrink-0 items-center justify-between gap-6 self-stretch bg-primary px-7 text-sm font-bold tracking-[0.2em] text-white uppercase transition-colors hover:bg-primary-dark md:self-end md:px-10"
      >
        {s.eventsOrgCta}
        <ArrowRight aria-hidden className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
