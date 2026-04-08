import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import EventsSection from "@/components/EventsSection";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [events, settings] = await Promise.all([
    prisma.event.findMany({
      where: { isActive: true },
      orderBy: { date: "asc" },
    }),
    prisma.siteSettings.findUnique({
      where: { id: "main" },
    }),
  ]);

  const featuredEvent =
    settings?.heroEventEnabled
      ? events.find((e) => e.isFeatured) || null
      : null;

  const activeEvents = events.map((e) => ({
    id: e.id,
    title: e.title,
    description: e.description,
    date: e.date.toISOString().split("T")[0],
    time: e.time,
    category: e.category as "musica" | "gastronomia" | "especial",
    image: e.image || undefined,
    featured: e.isFeatured,
  }));

  return (
    <main className="min-h-screen bg-white">
      <Navbar
        eventsEnabled={settings?.eventsEnabled ?? true}
        addressStreet={settings?.addressStreet}
        addressCity={settings?.addressCity}
        heroTitle={settings?.heroTitle}
      />
      <Hero featuredEvent={featuredEvent} settings={settings} />
      <AboutSection settings={settings} />
      {(settings?.eventsEnabled ?? true) && activeEvents.length > 0 && (
        <EventsSection
          eventsData={{ enabled: true, events: activeEvents }}
          settings={settings}
        />
      )}
      <ContactSection settings={settings} />
      <Footer settings={settings} />
    </main>
  );
}
