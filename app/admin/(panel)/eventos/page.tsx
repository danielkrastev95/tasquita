import { CalendarPlus, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { EventsView } from "@/components/admin/events/EventsView";
import { buttonClasses } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/Card";
import { getAdminEvents, getAdminSettings } from "@/lib/data/admin";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Eventos" };

export default async function EventsPage() {
  await requireAdmin();
  const [{ upcoming, past }, settings] = await Promise.all([getAdminEvents(), getAdminSettings()]);

  return (
    <>
      <PageHeader
        title="Eventos"
        description="Conciertos, catas, partidos… Toca la estrella para destacar uno en la portada."
        actions={
          <>
            <Link href="/admin/eventos/nuevo" className={buttonClasses("primary", "md", "flex-1 px-3 whitespace-nowrap sm:flex-none sm:px-5")}>
              <CalendarPlus className="size-4 max-[359px]:hidden" aria-hidden />
              Crear evento
            </Link>
            <a href="/eventos" target="_blank" rel="noopener" className={buttonClasses("secondary", "md", "flex-1 px-3 whitespace-nowrap sm:flex-none sm:px-5")}>
              <ExternalLink className="size-4 max-[359px]:hidden" aria-hidden />
              Ver en la web
            </a>
          </>
        }
      />
      <EventsView upcoming={upcoming} past={past} eventsEnabled={settings.eventsEnabled} heroEnabled={settings.showFeaturedEventInHero} />
    </>
  );
}
