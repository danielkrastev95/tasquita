import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { SECTION_GROUPS, SECTION_ICONS } from "@/components/admin/content/section-meta";
import { PageHeader } from "@/components/ui/Card";
import { getAdminSettings } from "@/lib/data/admin";
import { describeClosure, describeDays, groupOpeningHours, upcomingClosures } from "@/lib/schedule";
import { requireAdmin } from "@/lib/session";
import type { SiteSettings } from "@/lib/settings";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { SETTINGS_SECTIONS, sectionHref, type SettingsSectionKey } from "@/lib/validations/settings";

export const metadata: Metadata = { title: "Contenido" };

/** Resumen del valor actual de cada sección, para verlo de un vistazo. */
function summary(section: SettingsSectionKey, s: SiteSettings): { text: string; tone?: "on" | "off" | "warn" } {
  switch (section) {
    case "menu": {
      const m = s.dailyMenu;
      const dishes = m.starters.length + m.mains.length + m.desserts.length;
      if (!m.enabled) return { text: dishes ? `Desactivado · ${dishes} platos guardados` : "Desactivado", tone: "off" };
      return { text: [describeDays(m.days), formatPrice(m.priceCents)].filter(Boolean).join(" · "), tone: "on" };
    }
    case "cierres": {
      const next = upcomingClosures(s.specialClosures);
      return next.length ? { text: next.map((c) => describeClosure(c) + (c.note ? ` (${c.note})` : "")).join(" · ") } : { text: "Ninguno previsto", tone: "off" };
    }
    case "reservas":
      if (!s.whatsappEnabled) return { text: "WhatsApp desactivado", tone: "off" };
      return { text: s.reservationsEnabled ? `Reservas activas · ${s.whatsappPhone}` : `Solo botón de WhatsApp · ${s.whatsappPhone}`, tone: "on" };
    case "resenas":
      return s.googleReviewsUrl ? { text: "Enlace configurado", tone: "on" } : { text: "Sin enlace", tone: "off" };
    case "legal":
      return s.legalName && s.legalTaxId ? { text: `${s.legalName} · ${s.legalTaxId}` } : { text: "Faltan datos: complétalos", tone: "warn" };
    case "aviso":
      return s.announcementEnabled ? { text: `Activo: «${s.announcementText}»`, tone: "on" } : { text: "Desactivado", tone: "off" };
    case "portada":
      return { text: s.heroTagline };
    case "nosotros":
      return { text: s.aboutHeroTitle };
    case "valores":
      return { text: s.values.map((v) => v.title).join(" · ") };
    case "contacto":
      return { text: [s.addressStreet, s.phone].filter(Boolean).join(" · ") };
    case "horario":
      return {
        text: groupOpeningHours(s.openingHours)
          .map((g) => `${g.label}: ${g.hours}`)
          .join(" · "),
      };
    case "domicilio": {
      const apps = [s.glovoUrl && "Glovo", s.uberEatsUrl && "Uber Eats"].filter(Boolean);
      return apps.length ? { text: apps.join(" y ") } : { text: "Sin enlaces", tone: "off" };
    }
    case "eventos":
      return s.eventsEnabled ? { text: "Sección visible", tone: "on" } : { text: "Sección oculta", tone: "off" };
    case "pie":
      return { text: s.footerTagline };
    case "seo":
      return { text: s.seoDescription };
  }
}

export default async function ContentIndexPage() {
  await requireAdmin();
  const settings = await getAdminSettings();

  return (
    <>
      <PageHeader title="Contenido" description="Textos, fotos, horario y datos de contacto de la web. Elige qué quieres cambiar." />
      <div className="space-y-8">
        {SECTION_GROUPS.map((group, groupIndex) => (
          <section key={group.title} aria-labelledby={`grupo-${groupIndex}`}>
            <h2 id={`grupo-${groupIndex}`} className="mb-3 text-xs font-semibold tracking-[0.14em] text-primary uppercase">
              {group.title}
            </h2>
            <ul className="divide-y divide-cream-300 overflow-hidden rounded-2xl border border-cream-400/70 bg-white md:grid md:grid-cols-2 md:gap-px md:divide-y-0 md:bg-cream-300">
              {group.sections.map((key) => {
                const meta = SETTINGS_SECTIONS[key];
                const Icon = SECTION_ICONS[key];
                const { text, tone } = summary(key, settings);
                return (
                  <li key={key} className="bg-white">
                    <Link href={sectionHref(key)} className="flex h-full items-center gap-4 p-4 transition hover:bg-cream-100 md:p-5">
                      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-ink">{meta.title}</span>
                        <span
                          className={cn(
                            "mt-0.5 line-clamp-2 text-sm leading-snug",
                            tone === "on" ? "font-medium text-success" : tone === "off" ? "text-ink-muted italic" : tone === "warn" ? "font-medium text-gold-deep" : "text-ink-muted",
                          )}
                        >
                          {text}
                        </span>
                      </span>
                      <ChevronRight className="size-5 shrink-0 text-ink-muted/60" aria-hidden />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
