import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/admin/BackLink";
import { EventForm } from "@/components/admin/events/EventForm";
import { buttonClasses } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/Card";
import { getAdminEvents, getEvent } from "@/lib/data/admin";
import { todayInMadrid } from "@/lib/format";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Editar evento" };

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const [event, { upcoming }] = await Promise.all([getEvent(id), getAdminEvents()]);
  if (!event) notFound();
  const today = todayInMadrid();
  const otherFeatured = upcoming.find((e) => e.isFeatured && e.id !== event.id) ?? null;

  return (
    <>
      <BackLink href="/admin/eventos">Eventos</BackLink>
      <PageHeader
        title={event.title}
        description={event.date < today ? "Este evento ya ha pasado." : event.isActive ? "Los cambios se verán en la web en cuanto guardes." : "Este evento está oculto: no aparece en la web."}
        actions={
          <a href="/eventos" target="_blank" rel="noopener" className={buttonClasses("ghost", "sm", "text-primary")}>
            <ExternalLink className="size-4" aria-hidden />
            Ver eventos en la web
          </a>
        }
      />
      <EventForm
        key={event.id}
        mode="edit"
        eventId={event.id}
        today={today}
        otherFeatured={otherFeatured ? { id: otherFeatured.id, title: otherFeatured.title } : null}
        initial={{
          title: event.title,
          description: event.description,
          date: event.date,
          time: event.time,
          category: event.category,
          imageUrl: event.imageUrl,
          isFeatured: event.isFeatured,
          isActive: event.isActive,
        }}
      />
    </>
  );
}
