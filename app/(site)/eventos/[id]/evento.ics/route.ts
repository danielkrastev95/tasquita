import { getSiteSettings, getUpcomingEvents } from "@/lib/data/public";
import { buildIcs } from "@/components/site/events/ics";
import { siteUrl } from "@/components/site/seo";

/** GET /eventos/:id/evento.ics → archivo de calendario del evento (2 h por defecto, hora de Madrid). */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [settings, events] = await Promise.all([getSiteSettings(), getUpcomingEvents()]);
  const event = settings.eventsEnabled ? events.find((e) => e.id === id) : undefined;
  if (!event) return new Response("Evento no encontrado", { status: 404 });

  const ics = buildIcs({
    uid: `${event.id}@latasquitadesara`,
    title: `${event.title} · ${settings.name}`,
    description: [event.description, `${siteUrl}/eventos#evento-${event.id}`].filter(Boolean).join("\n\n"),
    date: event.date,
    time: event.time,
    location: `${settings.name}, ${settings.addressStreet}, ${settings.addressPostalCode} ${settings.addressCity}`,
    geo: { lat: settings.latitude, lng: settings.longitude },
    url: `${siteUrl}/eventos#evento-${event.id}`,
    organizer: settings.name,
  });

  const slug = event.title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug || "evento"}.ics"`,
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
