import { Ban, Heart, House, Sparkles, Star } from "lucide-react";
import { getAllergen } from "@/lib/allergens";
import type { PublicMenuItem } from "@/lib/data/public";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { SmartImage } from "../SmartImage";
import { pad2 } from "../utils";

const badge = "inline-flex items-center gap-1.5 px-2 py-1 text-xs leading-none font-bold tracking-[0.08em] uppercase";

/**
 * Plato de la carta. Con foto: imagen + precio en etiqueta. Sin foto: tarjeta tipográfica
 * (número, precio grande y nombre protagonista) para que no parezca un hueco vacío.
 * `poster`: en secciones con fotos, a partir de sm el plato sin foto lleva un "cartel"
 * del mismo tamaño que las fotos para que las filas de la rejilla no queden descompensadas.
 * Medidas (Tapa/Media/Ración) bajo el nombre; "Agotado hoy" atenúa la tarjeta pero la deja visible.
 */
export function MenuItemCard({
  item,
  number,
  poster = false,
  wide = false,
}: {
  item: PublicMenuItem;
  number: number;
  poster?: boolean;
  /** En una rejilla de 2 columnas en escritorio (fotos más grandes) */
  wide?: boolean;
}) {
  const price = formatPrice(item.priceCents);
  const allergens = item.allergens.map(getAllergen).filter((a) => a !== undefined);
  const showPoster = !item.imageUrl && poster;

  return (
    <article className={cn("group relative flex h-full flex-col bg-cream", !item.imageUrl && "overflow-hidden", item.soldOut && "bg-cream-100")}>
      {item.imageUrl ? (
        <div className={cn("relative aspect-[16/9] overflow-hidden bg-cream-300 sm:aspect-[4/3]", wide && "lg:aspect-[16/9]")}>
          <SmartImage
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes={wide ? "(min-width: 640px) 46vw, calc(100vw - 2.5rem)" : "(min-width: 1024px) 31vw, (min-width: 640px) 46vw, calc(100vw - 2.5rem)"}
            className={cn(
              "object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]",
              item.soldOut && "opacity-55 grayscale-[70%]",
            )}
          />
          {item.soldOut && <SoldOutStamp />}
          {price && (
            <p className="absolute right-0 bottom-0 bg-primary-dark px-3.5 py-2 text-base font-bold text-white tabular-nums">{price}</p>
          )}
        </div>
      ) : (
        <>
          {showPoster && (
            <div
              className={cn(
                "relative hidden aspect-[4/3] items-center justify-center overflow-hidden bg-primary sm:flex",
                wide && "lg:aspect-[16/9]",
                item.soldOut && "bg-primary/60",
              )}
            >
              {item.soldOut && <SoldOutStamp />}
              <span aria-hidden className="absolute inset-0 bg-grain opacity-10 mix-blend-overlay" />
              <span aria-hidden className="absolute top-4 left-5 text-xs font-bold tracking-[0.16em] text-gold">
                N.º {pad2(number)}
              </span>
              <span aria-hidden className="font-serif text-[clamp(7rem,11vw,10rem)] leading-none font-extrabold glyph-outline text-white/40 italic select-none">
                {pad2(number)}
              </span>
              {price && (
                <p className="absolute right-0 bottom-0 bg-primary-dark px-3.5 py-2 text-base font-bold text-white tabular-nums">{price}</p>
              )}
            </div>
          )}
          {/* Número decorativo de fondo */}
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute -right-2 -bottom-6 font-serif text-[8.5rem] leading-none font-extrabold glyph-outline text-primary/[0.13] italic select-none md:text-[10rem]",
              showPoster && "sm:hidden",
            )}
          >
            {pad2(number)}
          </span>
          <div className={cn("flex items-baseline justify-between gap-4 px-5 pt-5 md:px-7 md:pt-7", showPoster && "sm:hidden")}>
            <span className="text-xs font-bold tracking-[0.16em] text-gold-deep tabular-nums">N.º {pad2(number)}</span>
            {price && (
              <p className={cn("font-serif text-[1.75rem] leading-none font-bold tabular-nums italic", item.soldOut ? "text-primary/45" : "text-primary")}>{price}</p>
            )}
          </div>
        </>
      )}

      <div className={cn("relative flex flex-1 flex-col px-5 pb-6 md:px-7 md:pb-8", item.imageUrl ? "pt-5 md:pt-6" : "pt-4", showPoster && "sm:pt-5 md:pt-6")}>
        <h3
          className={cn(
            "font-serif text-[1.6rem] leading-[0.98] font-extrabold tracking-[-0.01em] text-balance uppercase md:text-[1.8rem]",
            item.soldOut ? "text-ink/55" : "text-ink",
          )}
        >
          {item.name}
        </h3>

        {item.priceVariants.length > 0 && (
          <ul aria-label="Medidas" className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
            {item.priceVariants.map((v, i) => (
              <li key={`${v.label}-${i}`} className="flex items-baseline gap-2">
                {i > 0 && (
                  <span aria-hidden className="text-gold-deep">
                    ·
                  </span>
                )}
                <span className="text-xs font-bold tracking-[0.12em] text-ink-muted uppercase">{v.label}</span>
                <span className="font-semibold text-primary tabular-nums">{formatPrice(v.priceCents)}</span>
              </li>
            ))}
          </ul>
        )}

        {(item.soldOut || item.isNew || item.award || item.isPopular || item.isHomemade) && (
          <ul className="mt-3.5 flex flex-wrap gap-1.5" aria-label="Distintivos">
            {item.soldOut && (
              <li className={cn(badge, "bg-danger text-white")}>
                <Ban aria-hidden className="size-3" />
                Agotado hoy
              </li>
            )}
            {item.isNew && (
              <li className={cn(badge, "bg-cream text-primary ring-1 ring-primary ring-inset")}>
                <Sparkles aria-hidden className="size-3" />
                Nuevo
              </li>
            )}
            {item.award && (
              <li className={cn(badge, "bg-gold text-ink")}>
                <Star aria-hidden className="size-3 fill-current" />
                {item.award}
              </li>
            )}
            {item.isPopular && (
              <li className={cn(badge, "bg-primary text-white")}>
                <Heart aria-hidden className="size-3 fill-current" />
                Más pedido
              </li>
            )}
            {item.isHomemade && (
              <li className={cn(badge, "bg-ink text-cream")}>
                <House aria-hidden className="size-3" />
                Hecho en casa
              </li>
            )}
          </ul>
        )}

        {item.description && (
          <p className={cn("mt-3.5 max-w-prose text-base leading-relaxed sm:text-[0.9375rem] whitespace-pre-line text-ink-muted text-pretty", item.soldOut && "opacity-70")}>
            {item.description}
          </p>
        )}

        {allergens.length > 0 && (
          <ul aria-label="Alérgenos" className="mt-auto flex flex-wrap gap-1 pt-5">
            {allergens.map((a) => (
              <li
                key={a.code}
                title={a.label}
                className="inline-flex h-6 items-center border border-ink/25 bg-cream px-1.5 text-xs font-bold tracking-[0.06em] text-ink-muted"
              >
                <span aria-hidden>{a.short}</span>
                <span className="sr-only">{a.label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

/** Sello "Agotado hoy" sobre la foto o el cartel. */
function SoldOutStamp() {
  return (
    <span
      aria-hidden
      className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 -rotate-6 border-[3px] border-danger bg-cream/95 px-4 py-1.5 text-sm font-extrabold tracking-[0.22em] whitespace-nowrap text-danger uppercase shadow-[0_10px_30px_-12px_rgb(28_28_24/0.5)]"
    >
      Agotado hoy
    </span>
  );
}
