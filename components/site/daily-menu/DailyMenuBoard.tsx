import { Clock } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { describeDays } from "@/lib/schedule";
import type { Closure, DailyMenu } from "@/lib/settings";
import { cn } from "@/lib/utils";
import { pad2 } from "../utils";
import { DailyMenuToday } from "./DailyMenuToday";

export const hasDailyMenu = (m: DailyMenu) => m.enabled && m.starters.length + m.mains.length + m.desserts.length > 0;

const COURSES = [
  { key: "starters", label: "Primeros" },
  { key: "mains", label: "Segundos" },
  { key: "desserts", label: "Postres" },
] as const;

const COLS: Record<number, string> = { 1: "", 2: "md:grid-cols-2", 3: "md:grid-cols-3" };

/**
 * Menú del día como "pizarra" de marca: fondo teal oscuro con grano, doble marco a tiza,
 * precio grande en oro y los platos por pases. Se usa en la portada y arriba de la carta.
 */
export function DailyMenuBoard({
  menu,
  closures,
  headingLevel: Heading = "h2",
  id,
  className,
}: {
  menu: DailyMenu;
  closures: Closure[];
  headingLevel?: "h2" | "h3";
  id?: string;
  className?: string;
}) {
  const courses = COURSES.map((c) => ({ ...c, dishes: menu[c.key] })).filter((c) => c.dishes.length > 0);
  const price = formatPrice(menu.priceCents);
  const days = describeDays(menu.days);
  const titleId = `${id ?? "menu-del-dia"}-titulo`;
  const Sub = Heading === "h2" ? "h3" : "h4";

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={cn(
        "on-dark relative isolate scroll-mt-[calc(var(--header-h)+1rem)] overflow-hidden bg-primary-dark text-cream outline outline-1 -outline-offset-8 outline-cream/15",
        className,
      )}
    >
      <div aria-hidden className="absolute inset-0 -z-10 bg-grain opacity-[0.09] mix-blend-overlay" />
      <div aria-hidden className="absolute -top-24 -right-24 -z-10 size-72 rounded-full bg-primary/40 blur-3xl" />

      <div className="px-6 py-10 md:px-12 md:py-14 lg:px-16 lg:py-16">
        {/* Cabecera de la pizarra */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <p className="flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-gold uppercase">
            <span aria-hidden className="h-px w-10 bg-gold" />
            La pizarra
          </p>
          <DailyMenuToday days={menu.days} closures={closures} />
        </div>

        <div className="mt-6 flex flex-col gap-6 md:mt-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div>
            <Heading
              id={titleId}
              className="font-serif text-[clamp(2.75rem,10vw,6.5rem)] leading-[0.86] font-extrabold tracking-[-0.035em] text-balance text-cream uppercase italic"
            >
              {menu.title}
            </Heading>
            {(days || menu.hours) && (
              <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold tracking-[0.04em] text-cream/80 md:text-base">
                <Clock aria-hidden className="size-4 text-gold" />
                {days}
                {days && menu.hours && <span aria-hidden className="text-gold">·</span>}
                {menu.hours}
              </p>
            )}
          </div>
          {price && (
            <p className="flex shrink-0 items-baseline gap-3 lg:flex-col lg:items-end lg:gap-1">
              <span className="font-serif text-[clamp(3.25rem,12vw,6rem)] leading-none font-extrabold tracking-[-0.03em] text-gold tabular-nums italic">
                {price}
              </span>
              <span className="text-xs font-bold tracking-[0.18em] text-cream/70 uppercase">por persona</span>
            </p>
          )}
        </div>

        {/* Pases */}
        {courses.length > 0 && (
          <div className={cn("mt-9 grid gap-px border-y border-cream/15 bg-cream/15 md:mt-12", COLS[courses.length])}>
            {courses.map((course, ci) => (
              <div key={course.key} className="bg-primary-dark py-6 md:px-6 md:py-8 md:first:pl-0 md:last:pr-0 lg:px-8">
                <Sub className="flex items-baseline gap-3 text-xs font-bold tracking-[0.2em] text-gold uppercase">
                  <span className="tabular-nums text-cream/50">{pad2(ci + 1)}</span>
                  {course.label}
                </Sub>
                <ul className="mt-4 space-y-2.5 md:space-y-3">
                  {course.dishes.map((dish, di) => (
                    <li
                      key={`${dish}-${di}`}
                      className="border-b border-dashed border-cream/15 pb-2.5 font-serif text-[1.2rem] leading-snug font-semibold text-pretty text-cream last:border-b-0 last:pb-0 md:pb-3 lg:text-[1.4rem]"
                    >
                      {dish}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {(menu.includes || menu.note) && (
          <div className="mt-7 flex flex-col gap-3 md:mt-9 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            {menu.includes && (
              <p className="flex flex-wrap items-center gap-3 text-[0.9375rem] text-cream/90">
                <span className="bg-cream px-2 py-1 text-xs font-bold tracking-[0.14em] text-primary-dark uppercase">Incluye</span>
                {menu.includes}
              </p>
            )}
            {menu.note && <p className="font-serif text-lg text-cream/75 italic lg:text-right">{menu.note}</p>}
          </div>
        )}
      </div>
    </section>
  );
}
