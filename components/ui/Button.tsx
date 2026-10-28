import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-primary text-white hover:bg-primary-dark shadow-sm",
  secondary: "border border-cream-400 bg-white text-ink hover:bg-cream-100",
  ghost: "text-ink hover:bg-cream-200",
  danger: "bg-danger text-white hover:bg-danger/90 shadow-sm",
  "danger-ghost": "text-danger hover:bg-danger/10",
} as const;

const sizes = {
  md: "h-12 px-5 text-sm",
  sm: "h-10 px-4 text-sm",
  icon: "h-11 w-11 p-0",
} as const;

const base =
  "inline-flex select-none items-center justify-center gap-2 rounded-xl font-semibold transition-[background-color,transform,opacity] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

export type ButtonProps = React.ComponentProps<"button"> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  loading?: boolean;
};

export function Button({ variant = "primary", size = "md", loading, disabled, className, children, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

/** Mismas clases que Button para usar en <Link>/<a>. */
export const buttonClasses = (variant: keyof typeof variants = "primary", size: keyof typeof sizes = "md", className?: string) =>
  cn(base, variants[variant], sizes[size], className);
