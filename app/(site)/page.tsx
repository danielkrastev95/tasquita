import type { Metadata, ResolvingMetadata } from "next";
import { getFeaturedEvent, getMenu, getSiteSettings, getUpcomingEvents } from "@/lib/data/public";
import { AboutSection } from "@/components/site/home/AboutSection";
import { ContactSection } from "@/components/site/home/ContactSection";
import { EventsSection } from "@/components/site/home/EventsSection";
import { Hero } from "@/components/site/home/Hero";
import { heroPhotos } from "@/components/site/photos";
import { pageMetadata } from "@/components/site/seo";
import { splitCity } from "@/components/site/utils";

export const revalidate = 3600;

export async function generateMetadata(_: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  const s = await getSiteSettings();
  return pageMetadata(parent, {
    title: `${s.name} · Bar de tapas en ${splitCity(s.addressCity).locality}`,
    absoluteTitle: true,
    description: s.seoDescription,
    path: "/",
    siteName: s.name,
  });
}

export default async function HomePage() {
  const [settings, menu, events, featured] = await Promise.all([getSiteSettings(), getMenu(), getUpcomingEvents(), getFeaturedEvent()]);
  const showEvents = settings.eventsEnabled && events.length > 0;

  return (
    <>
      <Hero
        settings={settings}
        photos={heroPhotos(settings, menu)}
        featuredEvent={settings.eventsEnabled && settings.showFeaturedEventInHero ? featured : null}
      />
      <AboutSection settings={settings} />
      {showEvents && <EventsSection settings={settings} events={events} />}
      <ContactSection settings={settings} />
    </>
  );
}
