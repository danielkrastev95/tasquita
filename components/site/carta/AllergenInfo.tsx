import { Info } from "lucide-react";
import { ALLERGENS } from "@/lib/allergens";
import { GridFillers } from "../GridFillers";
import { MenuNotes } from "./MenuNotes";

/**
 * Pie de la carta: aviso de alérgenos (siempre), notas (IVA, suplementos, pan…) y la leyenda
 * de abreviaturas si algún plato las usa. Aviso y notas comparten fila en escritorio.
 */
export function AllergenInfo({ showLegend, notes }: { showLegend: boolean; notes: string[] }) {
  return (
    <section aria-labelledby="alergenos-title" className="grid grid-cols-1 gap-px border border-primary bg-primary lg:grid-cols-2">
      <div className="bg-primary px-6 py-8 text-white md:px-10 md:py-10">
        <h2 id="alergenos-title" className="flex items-center gap-3 font-serif text-[clamp(1.6rem,8.5vw,2rem)] leading-none font-extrabold uppercase italic md:text-[2.5rem]">
          <Info aria-hidden className="size-6 shrink-0 text-gold" />
          Alérgenos
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-white/90 text-pretty">
          Consulta alérgenos al personal: si tienes alguna alergia o intolerancia, avísanos antes de pedir y te informaremos encantados.
        </p>
      </div>
      <MenuNotes notes={notes} />
      {showLegend && (
        <ul aria-label="Leyenda de alérgenos" className="grid grid-cols-2 gap-px sm:grid-cols-3 lg:col-span-2 lg:grid-cols-5 xl:grid-cols-7">
          {ALLERGENS.map((a) => (
            <li key={a.code} className="flex items-center gap-3 bg-cream px-4 py-3 text-sm text-ink">
              <span aria-hidden className="inline-flex h-6 min-w-10 items-center justify-center border border-ink/25 px-1.5 text-xs font-bold tracking-[0.06em] text-ink-muted">
                {a.short}
              </span>
              {a.label}
            </li>
          ))}
          <GridFillers as="li" count={ALLERGENS.length} cols={{ base: 2, sm: 3, lg: 5, xl: 7 }} />
        </ul>
      )}
    </section>
  );
}
