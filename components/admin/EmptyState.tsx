import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  children,
  action,
  className,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col items-center rounded-2xl border border-dashed border-cream-400 bg-white/60 px-6 py-10 text-center [overflow-wrap:anywhere]", className)}>
      <span className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
        <Icon className="size-6" aria-hidden />
      </span>
      <p className="font-serif text-xl font-bold italic text-ink">{title}</p>
      {children && <div className="mt-1.5 max-w-sm text-sm leading-relaxed text-ink-muted">{children}</div>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
