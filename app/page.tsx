import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
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

  // Get featured event only if hero event banner is enabled
  const featuredEvent =
    settings?.heroEventEnabled
      ? events.find((e) => e.isFeatured) || null
      : null;

  return (
    <main className="min-h-screen bg-white">
      <Navbar eventsEnabled={settings?.eventsEnabled ?? true} />
      <Hero featuredEvent={featuredEvent} />
      <AboutSection settings={settings} />
      <ContactSection settings={settings} />
      <Footer settings={settings} />
    </main>
  );
}
