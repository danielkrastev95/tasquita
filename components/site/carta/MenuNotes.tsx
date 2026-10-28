import { cn } from "@/lib/utils";

/** Notas al pie de la carta (IVA, suplementos, pan…): discretas pero legibles. */
export function MenuNotes({ notes, className }: { notes: string[]; className?: string }) {
  const all = ["Precios con IVA incluido.", ...notes];
  return (
    <div className={cn("bg-cream px-6 py-8 md:px-10 md:py-10", className)}>
      <h3 className="text-xs font-bold tracking-[0.18em] text-primary uppercase">A tener en cuenta</h3>
      <ul className="mt-4 space-y-2.5">
        {all.map((note, i) => (
          <li key={`${i}-${note}`} className="flex items-baseline gap-3 text-base leading-relaxed md:text-[0.9375rem] text-ink-muted text-pretty">
            <span aria-hidden className="size-1.5 shrink-0 -translate-y-0.5 bg-gold-deep" />
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
}
