import type { Metadata } from "next";
import { BackLink } from "@/components/admin/BackLink";
import { EventForm, type EventFormValues } from "@/components/admin/events/EventForm";
import { PageHeader } from "@/components/ui/Card";
import { getAdminEvents, getEvent } from "@/lib/data/admin";
import { todayInMadrid } from "@/lib/format";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Nuevo evento" };

/** Mismo día de la semana, una semana después (y nunca en el pasado): ideal para eventos que se repiten. */
function nextOccurrence(isoDate: string, today: string) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  do date.setUTCDate(date.getUTCDate() + 7);
  while (date.toISOString().slice(0, 10) < today);
  return date.toISOString().slice(0, 10);
}

export default async function NewEventPage({ searchParams }: { searchParams: Promise<{ desde?: string | string[] }> }) {
  await requireAdmin();
  const { desde } = await searchParams;
  const sourceId = typeof desde === "string" ? desde : undefined;
  const [source, { upcoming }] = await Promise.all([sourceId ? getEvent(sourceId) : null, getAdminEvents()]);
  const today = todayInMadrid();
  const featured = upcoming.find((e) => e.isFeatured) ?? null;

  const initial: EventFormValues = source
    ? {
        title: source.title,
        description: source.description,
        date: nextOccurrence(source.date, today),
        time: source.time,
        category: source.category,
        imageUrl: source.imageUrl,
        isFeatured: false,
        isActive: true,
      }
    : { title: "", description: "", date: "", time: "21:00", category: "musica", imageUrl: null, isFeatured: false, isActive: true };

  return (
    <>
      <BackLink href="/admin/eventos">Eventos</BackLink>
      <PageHeader title={source ? "Repetir evento" : "Nuevo evento"} description="Con título, día y hora es suficiente; lo demás es opcional." />
      <EventForm
        mode="create"
        initial={initial}
        today={today}
        otherFeatured={featured ? { id: featured.id, title: featured.title } : null}
        duplicateOf={source?.title}
      />
    </>
  );
}
