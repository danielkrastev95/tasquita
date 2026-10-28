import type { Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { getSiteSettings, getUpcomingEvents } from "@/lib/data/public";
import { toSchemaOrgClosures, toSchemaOrgHours, upcomingClosures } from "@/lib/schedule";
import type { SiteSettings } from "@/lib/settings";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { JsonLd } from "@/components/site/JsonLd";
import { MotionProvider } from "@/components/site/MotionProvider";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { siteUrl } from "@/components/site/seo";
import { canReserve, directionsUrl, getNavLinks, getSchedule, getSiteActions, instagramUrl, phoneE164, splitCity } from "@/components/site/utils";

/* Estructura común de la web pública: aviso, cabecera, contenido, pie y datos estructurados. */

/* viewport-fit=cover: la barra inferior fija puede respetar la zona del indicador de inicio
 * (env(safe-area-inset-*)); en horizontal, el contenedor añade el margen del notch. */
export const viewport: Viewport = {
  themeColor: "#fcf9f3",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

function restaurantJsonLd(s: SiteSettings) {
  const { locality, region } = splitCity(s.addressCity);
  const images = [s.heroImage1, s.aboutImage1, s.aboutImage2, s.aboutImage3].filter((v): v is string => Boolean(v));
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${siteUrl}/#restaurante`,
    name: s.name,
    description: s.seoDescription,
    url: siteUrl,
    ...(images.length > 0 && { image: images }),
    telephone: phoneE164(s.phone),
    ...(s.email && { email: s.email }),
    address: {
      "@type": "PostalAddress",
      streetAddress: s.addressStreet,
      addressLocality: locality,
      ...(region && { addressRegion: region }),
      postalCode: s.addressPostalCode,
      addressCountry: "ES",
    },
    geo: { "@type": "GeoCoordinates", latitude: s.latitude, longitude: s.longitude },
    hasMap: directionsUrl(s.latitude, s.longitude),
    servesCuisine: ["Tapas", "Hamburguesas", "Cocina española"],
    priceRange: "€€",
    openingHoursSpecification: toSchemaOrgHours(s.openingHours),
    ...(upcomingClosures(s.specialClosures).length > 0 && {
      specialOpeningHoursSpecification: toSchemaOrgClosures(upcomingClosures(s.specialClosures)),
    }),
    acceptsReservations: canReserve(s),
    hasMenu: `${siteUrl}/carta`,
    ...(s.instagramHandle && { sameAs: [instagramUrl(s.instagramHandle)] }),
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, events] = await Promise.all([getSiteSettings(), getUpcomingEvents()]);
  const links = getNavLinks(settings);

  return (
    <MotionProvider>
      <div data-site className="flex min-h-dvh flex-col pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]">
        <a
          href="#contenido"
          className="sr-only z-[70] bg-primary px-5 py-3 text-sm font-bold tracking-[0.12em] text-white uppercase focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Saltar al contenido
        </a>
        {settings.announcementEnabled && settings.announcementText && <AnnouncementBar text={settings.announcementText} />}
        <SiteHeader
          name={settings.name}
          links={links}
          hasUpcomingEvents={settings.eventsEnabled && events.length > 0}
          schedule={getSchedule(settings)}
          actions={getSiteActions(settings)}
          contact={{
            addressStreet: settings.addressStreet,
            addressCity: settings.addressCity,
            glovoUrl: settings.glovoUrl,
            uberEatsUrl: settings.uberEatsUrl,
            deliveryLabel: settings.heroDeliveryLabel,
          }}
        />
        <main id="contenido" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter settings={settings} links={links} />
      </div>
      <JsonLd data={restaurantJsonLd(settings)} />
      <Analytics />
    </MotionProvider>
  );
}
