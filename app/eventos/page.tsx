import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import EventsSection from "@/components/EventsSection";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Eventos | La Tasquita de Sara",
  description:
    "Descubre los próximos eventos en La Tasquita de Sara: música en vivo, catas gastronómicas y noches especiales en Valdemoro.",
  openGraph: {
    title: "Eventos | La Tasquita de Sara",
    description: "Música, gastronomía y noches especiales en Valdemoro",
    locale: "es_ES",
    type: "website",
  },
};

export default async function EventosPage() {
  const [events, settings] = await Promise.all([
    prisma.event.findMany({
      where: { isActive: true },
      orderBy: { date: "asc" },
    }),
    prisma.siteSettings.findUnique({
      where: { id: "main" },
    }),
  ]);

  const eventsData = {
    enabled: true, // Always enabled on the events page itself
    events: events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date.toISOString().split("T")[0],
      time: event.time,
      category: event.category as "musica" | "gastronomia" | "especial",
      image: event.image || undefined,
      featured: event.isFeatured,
    })),
  };

  // If no events at all, show a nice empty state
  if (events.length === 0) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: "#fcf9f3" }}>
        <Navbar eventsEnabled={settings?.eventsEnabled ?? true} heroTitle={settings?.heroTitle} addressStreet={settings?.addressStreet} addressCity={settings?.addressCity} />
        <div style={{ height: "80px" }} />
        <section
          className="px-6 md:px-12 py-32 text-center"
          style={{ backgroundColor: "#fcf9f3" }}
        >
          <h1
            className="font-black uppercase tracking-tighter leading-none mb-6"
            style={{
              fontFamily: "var(--font-newsreader)",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              color: "#2f7780",
            }}
          >
            Próximamente
          </h1>
          <p
            className="text-base max-w-md mx-auto"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              color: "#58413b",
            }}
          >
            Estamos preparando eventos increíbles. Síguenos en Instagram para
            enterarte de las novedades.
          </p>
        </section>
        <Footer settings={settings} />
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#fcf9f3" }}>
      <Navbar eventsEnabled={settings?.eventsEnabled ?? true} />
      <div style={{ height: "80px" }} />
      <EventsSection eventsData={eventsData} />
      <Footer settings={settings} />
    </main>
  );
}
