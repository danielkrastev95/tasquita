import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  htmlFor?: string;
  hint?: React.ReactNode;
  error?: string | string[] | null;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
};

/** Etiqueta + control + ayuda/error, con espaciado consistente. */
export function Field({ label, htmlFor, hint, error, optional, className, children }: FieldProps) {
  const message = Array.isArray(error) ? error[0] : error;
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="flex items-baseline justify-between gap-2 text-sm font-medium text-ink">
        <span>{label}</span>
        {optional && <span className="text-xs font-normal text-ink-muted">Opcional</span>}
      </label>
      {children}
      {message ? (
        <p role="alert" className="text-sm text-danger">
          {message}
        </p>
      ) : hint ? (
        <p className="text-xs leading-relaxed text-ink-muted">{hint}</p>
      ) : null}
    </div>
  );
}
