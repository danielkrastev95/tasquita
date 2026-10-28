import { cn } from "@/lib/utils";

type Breakpoint = "base" | "sm" | "md" | "lg" | "xl";

// Clases literales para que Tailwind las genere: [oculto, visible]
const VISIBILITY: Record<Breakpoint, [string, string]> = {
  base: ["hidden", "block"],
  sm: ["sm:hidden", "sm:block"],
  md: ["md:hidden", "md:block"],
  lg: ["lg:hidden", "lg:block"],
  xl: ["xl:hidden", "xl:block"],
};
const ORDER: Breakpoint[] = ["base", "sm", "md", "lg", "xl"];

/**
 * Celdas de relleno que cierran la última fila de una rejilla con líneas (gap-px sobre fondo
 * de color): sin ellas el hueco se vería como un bloque de color. `cols` = columnas por breakpoint.
 */
export function GridFillers({
  count,
  cols,
  as: Tag = "div",
  className,
}: {
  count: number;
  cols: Partial<Record<Breakpoint, number>>;
  as?: "div" | "li";
  className?: string;
}) {
  const perBp: Partial<Record<Breakpoint, number>> = { base: 1, ...cols };
  const needed = ORDER.filter((bp) => perBp[bp]).map((bp) => {
    const n = perBp[bp]!;
    return { bp, missing: (n - (count % n)) % n };
  });
  const total = Math.max(0, ...needed.map((x) => x.missing));

  return Array.from({ length: total }, (_, i) => (
    <Tag key={i} aria-hidden className={cn("bg-hatch", className, ...needed.map(({ bp, missing }) => VISIBILITY[bp][i < missing ? 1 : 0]))} />
  ));
}
