import { cn } from "@/lib/utils";

const tones = {
  gold: "bg-gold/20 text-gold-deep",
  primary: "bg-primary-light text-primary-dark",
  muted: "bg-cream-300 text-ink-muted",
  success: "bg-success/10 text-success",
  danger: "bg-danger/10 text-danger",
  ink: "bg-ink text-white",
} as const;

export function Badge({
  tone = "muted",
  icon: Icon,
  children,
  className,
}: {
  tone?: keyof typeof tones;
  icon?: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1 rounded-full px-2 py-0.5 text-[11px] leading-4 font-semibold tracking-wide whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {Icon && <Icon className="size-3 shrink-0" aria-hidden />}
      <span className="truncate">{children}</span>
    </span>
  );
}
