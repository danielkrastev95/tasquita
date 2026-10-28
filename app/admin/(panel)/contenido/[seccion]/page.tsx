import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { BackLink } from "@/components/admin/BackLink";
import { SectionEditor } from "@/components/admin/content/SectionEditor";
import { SECTION_ICONS, SECTION_ORDER } from "@/components/admin/content/section-meta";
import { buttonClasses } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/Card";
import { getAdminEvents, getAdminSettings } from "@/lib/data/admin";
import { madridNow } from "@/lib/schedule";
import { requireAdmin } from "@/lib/session";
import { cn } from "@/lib/utils";
import { SETTINGS_SECTIONS, isSettingsSection, pickSection, sectionHref } from "@/lib/validations/settings";

type Params = Promise<{ seccion: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { seccion } = await params;
  return { title: isSettingsSection(seccion) ? SETTINGS_SECTIONS[seccion].title : "Contenido" };
}

export default async function ContentSectionPage({ params }: { params: Params }) {
  await requireAdmin();
  const { seccion } = await params;
  if (!isSettingsSection(seccion)) notFound();
  if (seccion === "menu") redirect("/admin/menu-del-dia");

  const meta = SETTINGS_SECTIONS[seccion];
  const needsEvents = seccion === "portada" || seccion === "eventos";
  const [settings, events] = await Promise.all([getAdminSettings(), needsEvents ? getAdminEvents() : null]);
  const upcoming = events?.upcoming.filter((e) => e.isActive) ?? [];
  const now = madridNow();
  const extra = {
    featuredEventTitle: upcoming.find((e) => e.isFeatured)?.title ?? null,
    upcomingEvents: upcoming.length,
    todayDate: now.date,
    todayWeekday: now.weekday,
    businessAddress: [settings.addressStreet, [settings.addressPostalCode, settings.addressCity].filter(Boolean).join(" ")].filter(Boolean).join(", "),
  };
  // pickSection devuelve justo los campos de esta sección (no se envía al navegador nada más).
  const editorProps = { section: seccion, initial: pickSection(settings, seccion) } as Parameters<typeof SectionEditor>[0];

  return (
    <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10">
      {/* Escritorio: saltar entre secciones sin volver al índice */}
      <nav aria-label="Secciones de contenido" className="hidden lg:block">
        <ul className="sticky top-10 space-y-0.5">
          {SECTION_ORDER.map((key) => {
            const Icon = SECTION_ICONS[key];
            const active = key === seccion;
            return (
              <li key={key}>
                <Link
                  href={sectionHref(key)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-10 items-center gap-2.5 rounded-lg px-3 text-sm transition",
                    active ? "bg-white font-semibold text-primary-dark shadow-sm" : "text-ink-muted hover:bg-white/60 hover:text-ink",
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                  {SETTINGS_SECTIONS[key].title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="min-w-0">
        <BackLink href="/admin/contenido">Contenido</BackLink>
        <PageHeader
          title={meta.title}
          description={meta.description}
          actions={
            <a href={meta.webPath} target="_blank" rel="noopener" className={buttonClasses("ghost", "sm", "-ml-3 whitespace-nowrap text-primary md:ml-0")}>
              <ExternalLink className="size-4" aria-hidden />
              Ver en la web
            </a>
          }
        />
        <SectionEditor key={seccion} {...editorProps} extra={extra} />
      </div>
    </div>
  );
}
