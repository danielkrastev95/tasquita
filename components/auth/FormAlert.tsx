import { CircleAlert, Info } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Mensaje de error o aviso de un formulario. El contenedor siempre está en el DOM
 * para que los lectores de pantalla anuncien el texto en cuanto aparece.
 */
export function FormAlert({ message, tone = "error", className }: { message: string | null; tone?: "error" | "info"; className?: string }) {
  return (
    <div role={tone === "error" ? "alert" : "status"} aria-live={tone === "error" ? "assertive" : "polite"} className={className}>
      {message && (
        <p
          className={cn(
            "flex items-start gap-2.5 rounded-xl px-3.5 py-3 text-sm leading-relaxed",
            tone === "error" ? "bg-danger/[0.07] text-danger" : "bg-primary-light text-primary-dark",
          )}
        >
          {tone === "error" ? <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden /> : <Info className="mt-0.5 size-4 shrink-0" aria-hidden />}
          <span>{message}</span>
        </p>
      )}
    </div>
  );
}
