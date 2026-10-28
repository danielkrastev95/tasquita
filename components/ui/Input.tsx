import { cn } from "@/lib/utils";

export const inputClasses =
  "w-full rounded-xl border border-cream-400 bg-white px-4 text-base text-ink placeholder:text-ink-muted/50 transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 disabled:bg-cream-100 disabled:text-ink-muted aria-[invalid=true]:border-danger aria-[invalid=true]:ring-danger/15";

const chevron =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2358413b' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(inputClasses, "h-12", className)} {...props} />;
}

export function Textarea({ className, rows = 4, ...props }: React.ComponentProps<"textarea">) {
  return <textarea rows={rows} className={cn(inputClasses, "min-h-24 py-3 leading-relaxed", className)} {...props} />;
}

export function Select({ className, children, style, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(inputClasses, "h-12 appearance-none bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10", className)}
      style={{ backgroundImage: chevron, ...style }}
      {...props}
    >
      {children}
    </select>
  );
}
