import type { Metadata, ResolvingMetadata } from "next";
import { Phone } from "lucide-react";
import { getMenu, getSiteSettings, type PublicMenuCategory } from "@/lib/data/public";
import { AllergenInfo } from "@/components/site/carta/AllergenInfo";
import { CategoryNav } from "@/components/site/carta/CategoryNav";
import { MenuItemCard } from "@/components/site/carta/MenuItemCard";
import { DeliveryInline, DeliveryLinks, hasDelivery } from "@/components/site/DeliveryLinks";
import { GridFillers } from "@/components/site/GridFillers";
import { JsonLd } from "@/components/site/JsonLd";
import { pageMetadata, siteUrl } from "@/components/site/seo";
import { pad2, splitCity, telHref } from "@/components/site/utils";

export const revalidate = 3600;

export async function generateMetadata(_: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  const [s, menu] = await Promise.all([getSiteSettings(), getMenu()]);
  const sections = menu.map((c) => c.name).join(", ");
  return pageMetadata(parent, {
    title: "Carta",
    description: `Carta de ${s.name} en ${splitCity(s.addressCity).locality}${sections ? `: ${sections}` : ""}. Precios, alérgenos y pedidos a domicilio.`,
    path: "/carta",
    siteName: s.name,
  });
}

function menuJsonLd(name: string, menu: PublicMenuCategory[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `Carta de ${name}`,
    url: `${siteUrl}/carta`,
    inLanguage: "es",
    hasMenuSection: menu.map((c) => ({
      "@type": "MenuSection",
      name: c.name,
      hasMenuItem: c.items.map((i) => ({
        "@type": "MenuItem",
        name: i.name,
        ...(i.description && { description: i.description }),
        ...(i.imageUrl && { image: i.imageUrl }),
        ...(i.priceCents != null && {
          offers: { "@type": "Offer", price: (i.priceCents / 100).toFixed(2), priceCurrency: "EUR" },
        }),
      })),
    })),
  };
}

export default async function CartaPage() {
  const [settings, menu] = await Promise.all([getSiteSettings(), getMenu()]);
  const total = menu.reduce((n, c) => n + c.items.length, 0);
  const anyAllergens = menu.some((c) => c.items.some((i) => i.allergens.length > 0));
  // Numeración corrida de platos (N.º 01…): editorial, como una carta impresa
  const firstNumber = menu.reduce<number[]>((acc, c, i) => [...acc, i === 0 ? 1 : acc[i - 1] + menu[i - 1].items.length], []);

  return (
    <>
      {/* Cabecera de página */}
      <header className="mx-auto max-w-[100rem] px-5 pt-8 pb-8 md:px-10 md:pt-14 md:pb-12 lg:px-14">
        <p className="mb-4 flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-primary uppercase">
          <span aria-hidden className="h-px w-10 bg-gold" />
          {settings.aboutHeroTitle} · {splitCity(settings.addressCity).locality}
        </p>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <h1 className="-ml-[0.04em] font-serif text-[clamp(5rem,25vw,13rem)] leading-[0.78] font-extrabold tracking-[-0.045em] text-primary uppercase italic">
            Carta
          </h1>
          <div className="max-w-md lg:pb-2 lg:text-right">
            {settings.heroTagline && <p className="text-lg leading-snug text-ink-muted text-pretty">{settings.heroTagline}</p>}
            {total > 0 && (
              <p className="mt-2 text-xs font-bold tracking-[0.16em] text-gold-deep uppercase">
                {total} platos · {menu.length} secciones
              </p>
            )}
          </div>
        </div>
        {hasDelivery(settings) && (
          <DeliveryInline
            lead="¿Mejor en casa? Pide en"
            glovoUrl={settings.glovoUrl}
            uberEatsUrl={settings.uberEatsUrl}
            className="mt-6 border-t border-primary/20 pt-3 md:mt-8 lg:justify-end"
          />
        )}
      </header>

      {menu.length > 0 ? (
        <>
          <CategoryNav categories={menu.map((c) => ({ slug: c.slug, name: c.name }))} />

          <div className="mx-auto max-w-[100rem] px-5 pb-16 md:px-10 md:pb-24 lg:px-14">
            {menu.map((category, ci) => (
              <section
                key={category.id}
                id={category.slug}
                tabIndex={-1}
                aria-labelledby={`seccion-${category.slug}`}
                className="scroll-mt-[calc(var(--chips-h)+1.25rem)] pt-12 outline-none md:pt-20"
              >
                <header className="mb-6 flex flex-col border-t-[6px] border-gold pt-3 md:mb-10 md:flex-row md:items-start md:justify-between md:gap-8 md:border-t-8 md:pt-5">
                  <div className="min-w-0">
                    <h2
                      id={`seccion-${category.slug}`}
                      className="font-serif text-[clamp(1.9rem,9.6vw,5.5rem)] leading-[0.92] font-extrabold tracking-[-0.035em] break-words text-balance text-primary uppercase"
                    >
                      {category.name}
                    </h2>
                    {category.description && (
                      <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted text-pretty">{category.description}</p>
                    )}
                  </div>
                  <p
                    aria-hidden
                    className="order-first mb-2 text-sm font-bold tracking-[0.08em] text-gold-deep tabular-nums md:order-last md:mb-0 md:shrink-0 md:pt-3 md:text-2xl md:tracking-normal"
                  >
                    {pad2(ci + 1)}/{pad2(menu.length)}
                  </p>
                </header>

                <div className="grid gap-px border border-primary bg-primary sm:grid-cols-2 lg:grid-cols-3">
                  {category.items.map((item, ii) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      number={firstNumber[ci] + ii}
                      poster={category.items.some((i) => i.imageUrl)}
                    />
                  ))}
                  <GridFillers count={category.items.length} cols={{ sm: 2, lg: 3 }} />
                </div>
              </section>
            ))}

            <div className="mt-16 grid gap-6 md:mt-24">
              <AllergenInfo showLegend={anyAllergens} />
              {hasDelivery(settings) && (
                <div className="flex flex-col gap-4 border border-primary px-6 py-6 sm:flex-row sm:items-center sm:justify-between md:px-10">
                  <p className="font-serif text-[1.75rem] leading-none font-extrabold text-primary uppercase italic md:text-[2.25rem]">
                    {settings.heroDeliveryLabel}
                  </p>
                  <DeliveryLinks glovoUrl={settings.glovoUrl} uberEatsUrl={settings.uberEatsUrl} />
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="mx-auto max-w-[100rem] px-5 pb-24 md:px-10 lg:px-14">
          <div className="border-t-8 border-gold pt-8">
            <p className="max-w-xl font-serif text-[clamp(2rem,6vw,3.5rem)] leading-[1] font-bold text-balance text-ink italic">
              Estamos actualizando la carta. Vuelve en un rato o pregúntanos directamente.
            </p>
            <a
              href={telHref(settings.phone)}
              className="mt-8 inline-flex h-14 items-center gap-3 bg-primary px-7 text-sm font-bold tracking-[0.18em] text-white uppercase transition-colors hover:bg-primary-dark"
            >
              <Phone aria-hidden className="size-4" />
              {settings.phone}
            </a>
          </div>
        </div>
      )}

      {menu.length > 0 && <JsonLd data={menuJsonLd(settings.name, menu)} />}
    </>
  );
}
