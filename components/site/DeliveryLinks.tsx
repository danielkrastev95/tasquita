import { ArrowUpRight } from "lucide-react";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

/* Botones de Glovo / Uber Eats con los colores de cada marca (texto oscuro: contraste AA). */

const APPS = [
  { key: "glovo", label: "Glovo", className: "bg-[#ffc244] hover:bg-[#ffb31a]", dot: "bg-[#ffc244]" },
  { key: "uber", label: "Uber Eats", className: "bg-[#06c167] hover:bg-[#05a95a]", dot: "bg-[#06c167]" },
] as const;

export function DeliveryLinks({
  glovoUrl,
  uberEatsUrl,
  size = "md",
  className,
}: {
  glovoUrl: string | null;
  uberEatsUrl: string | null;
  size?: "md" | "lg";
  className?: string;
}) {
  const urls = { glovo: glovoUrl, uber: uberEatsUrl };
  const apps = APPS.filter((a) => urls[a.key]);
  if (apps.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {apps.map((app) => (
        <li key={app.key}>
          <a
            href={urls[app.key]!}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group inline-flex items-center gap-1.5 font-bold uppercase tracking-[0.12em] text-ink transition-[background-color,transform] duration-200 hover:-translate-y-0.5",
              size === "lg" ? "h-13 px-6 text-sm" : "h-11 px-4 text-xs",
              app.className,
            )}
          >
            {app.label}
            <ArrowUpRight aria-hidden className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            <span className="sr-only">(se abre en otra pestaña)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Versión discreta en línea: "¿Mejor en casa? Pide en ■ Glovo · ■ Uber Eats". */
export function DeliveryInline({
  lead,
  glovoUrl,
  uberEatsUrl,
  className,
}: {
  lead: string;
  glovoUrl: string | null;
  uberEatsUrl: string | null;
  className?: string;
}) {
  const urls = { glovo: glovoUrl, uber: uberEatsUrl };
  const apps = APPS.filter((a) => urls[a.key]);
  if (apps.length === 0) return null;

  return (
    <p className={cn("flex flex-wrap items-center gap-x-2.5 text-sm text-ink-muted", className)}>
      <span className="w-full pt-2 sm:w-auto sm:pt-0">{lead}</span>
      {apps.map((app, i) => (
        <Fragment key={app.key}>
          {i > 0 && <span aria-hidden>·</span>}
          <a
            href={urls[app.key]!}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-11 items-center gap-1.5 font-bold text-ink underline decoration-ink/25 decoration-1 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
          >
            <span aria-hidden className={cn("size-2.5", app.dot)} />
            {app.label}
            <ArrowUpRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            <span className="sr-only">(se abre en otra pestaña)</span>
          </a>
        </Fragment>
      ))}
    </p>
  );
}

export const hasDelivery = (s: { glovoUrl: string | null; uberEatsUrl: string | null }) => Boolean(s.glovoUrl || s.uberEatsUrl);
