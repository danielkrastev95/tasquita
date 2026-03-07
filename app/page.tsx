import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MenuSection from "@/components/MenuSection";
import AboutSection from "@/components/AboutSection";
import EventsSection from "@/components/EventsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch all data from database
  const [menuCategories, events, settings] = await Promise.all([
    prisma.menuCategory.findMany({
      where: { isActive: true },
      include: {
        items: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.event.findMany({
      where: { isActive: true },
      orderBy: { date: "asc" },
    }),
    prisma.siteSettings.findUnique({
      where: { id: "main" },
    }),
  ]);

  // Get featured event only if hero event banner is enabled
  const featuredEvent =
    settings?.heroEventEnabled
      ? events.find((e) => e.isFeatured) || null
      : null;

  // Transform menu data to match component interface
  const menuData = menuCategories.map((category) => ({
    id: category.slug,
    name: category.name,
    items: category.items.map((item) => ({
      name: item.name,
      description: item.description || undefined,
      price: item.price || undefined,
      image: item.image || undefined,
      popular: item.isPopular,
      homemade: item.isHomemade,
      award: item.award || undefined,
    })),
  }));

  // Transform events data
  const eventsData = {
    enabled: settings?.eventsEnabled ?? true,
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

  return (
    <main className="min-h-screen bg-white">
      <Navbar eventsEnabled={settings?.eventsEnabled ?? true} />
      <Hero featuredEvent={featuredEvent} />
      <MenuSection menuData={menuData} />
      <AboutSection settings={settings} />
      <EventsSection eventsData={eventsData} />
      <ContactSection settings={settings} />
      <Footer settings={settings} />
    </main>
  );
}
