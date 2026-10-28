import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      className={cn("rounded-2xl border border-cream-400/70 bg-white p-5 shadow-[0_1px_2px_rgba(28,28,24,0.04)] md:p-6", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, children, description }: { className?: string; children: React.ReactNode; description?: React.ReactNode }) {
  return (
    <header className={cn("mb-5 space-y-1", className)}>
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{children}</h2>
      {description && <p className="text-sm leading-relaxed text-ink-muted">{description}</p>}
    </header>
  );
}

/** Cabecera de página del panel. */
export function PageHeader({ title, description, actions }: { title: string; description?: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
      <div className="space-y-1.5">
        <h1 className="font-serif text-3xl font-bold italic tracking-tight text-ink md:text-4xl">{title}</h1>
        {description && <p className="max-w-2xl text-sm leading-relaxed text-ink-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
