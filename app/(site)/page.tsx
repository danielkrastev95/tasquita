import type { Metadata, ResolvingMetadata } from "next";
import { getFeaturedEvent, getMenu, getSiteSettings, getUpcomingEvents } from "@/lib/data/public";
import { AboutSection } from "@/components/site/home/AboutSection";
import { ContactSection } from "@/components/site/home/ContactSection";
import { EventsSection } from "@/components/site/home/EventsSection";
import { Hero } from "@/components/site/home/Hero";
import { DailyMenuBoard, hasDailyMenu } from "@/components/site/daily-menu/DailyMenuBoard";
import { heroPhotos } from "@/components/site/photos";
import { ReservationSection } from "@/components/site/reservations/ReservationSection";
import { pageMetadata } from "@/components/site/seo";
import { canReserve, splitCity } from "@/components/site/utils";

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
      {hasDailyMenu(settings.dailyMenu) && (
        <div className="mx-auto max-w-[100rem] px-5 pb-16 md:px-10 md:pb-24 lg:px-14">
          <DailyMenuBoard id="menu-del-dia" menu={settings.dailyMenu} closures={settings.specialClosures} className="reveal" />
        </div>
      )}
      <AboutSection settings={settings} />
      {showEvents && <EventsSection settings={settings} events={events} />}
      {canReserve(settings) && <ReservationSection settings={settings} />}
      <ContactSection settings={settings} />
    </>
  );
}
