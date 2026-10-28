import { Info } from "lucide-react";
import { ALLERGENS } from "@/lib/allergens";
import { cn } from "@/lib/utils";
import { GridFillers } from "../GridFillers";

/** Aviso de alérgenos (siempre) + leyenda de abreviaturas (si algún plato las usa). */
export function AllergenInfo({ showLegend }: { showLegend: boolean }) {
  return (
    <section aria-labelledby="alergenos-title" className="grid gap-px border border-primary bg-primary lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <div className={cn("bg-primary px-6 py-8 text-white md:px-10 md:py-10", !showLegend && "lg:col-span-2")}>
        <h2 id="alergenos-title" className="flex items-center gap-3 font-serif text-[2rem] leading-none font-extrabold uppercase italic md:text-[2.5rem]">
          <Info aria-hidden className="size-6 shrink-0 text-gold" />
          Alérgenos
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-white/90 text-pretty">
          Consulta alérgenos al personal: si tienes alguna alergia o intolerancia, avísanos antes de pedir y te informaremos encantados.
        </p>
        <p className="mt-3 text-sm text-white/75">Precios con IVA incluido.</p>
      </div>
      {showLegend && (
        <ul className="grid grid-cols-2 gap-px sm:grid-cols-3 xl:grid-cols-4">
          {ALLERGENS.map((a) => (
            <li key={a.code} className="flex items-center gap-3 bg-cream px-4 py-3 text-sm text-ink">
              <span aria-hidden className="inline-flex h-6 min-w-10 items-center justify-center border border-ink/25 px-1.5 text-xs font-bold tracking-[0.06em] text-ink-muted">
                {a.short}
              </span>
              {a.label}
            </li>
          ))}
          <GridFillers as="li" count={ALLERGENS.length} cols={{ base: 2, sm: 3, xl: 4 }} />
        </ul>
      )}
    </section>
  );
}
