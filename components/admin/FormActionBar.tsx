"use client";

import Link from "next/link";
import { Button, buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type FormActionBarProps = {
  /** id del <form> que envía el botón principal. */
  formId: string;
  dirty: boolean;
  pending: boolean;
  submitLabel?: string;
  /** Enlace de «Cancelar» (vuelve a la lista) o acción de «Descartar». */
  cancelHref?: string;
  onDiscard?: () => void;
  /** Permite guardar aunque no haya cambios (p. ej. al crear algo nuevo). */
  alwaysEnabled?: boolean;
};

/**
 * Barra fija inferior con Cancelar/Guardar, siempre al alcance del pulgar.
 * En móvil ocupa el sitio de la barra de pestañas (que se oculta en las fichas de edición).
 */
export function FormActionBar({ formId, dirty, pending, submitLabel = "Guardar", cancelHref, onDiscard, alwaysEnabled }: FormActionBarProps) {
  const canSubmit = alwaysEnabled || dirty;
  return (
    <>
      {/* Hueco para que el final del formulario no quede tapado */}
      <div aria-hidden className="h-24 md:h-20" />
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-cream-400/80 bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:left-64">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 md:px-8">
          <p aria-live="polite" className="hidden flex-1 items-center gap-2 text-sm text-ink-muted sm:flex">
            <span className={cn("size-2 rounded-full", dirty ? "bg-gold" : "bg-cream-400")} aria-hidden />
            {pending ? "Guardando…" : dirty ? "Tienes cambios sin guardar" : "Sin cambios"}
          </p>
          {onDiscard ? (
            <Button variant="secondary" onClick={onDiscard} disabled={!dirty || pending} className="flex-1 sm:flex-none">
              Descartar
            </Button>
          ) : cancelHref ? (
            <Link href={cancelHref} className={buttonClasses("secondary", "md", "flex-1 sm:flex-none")}>
              Cancelar
            </Link>
          ) : null}
          <Button type="submit" form={formId} loading={pending} disabled={!canSubmit} className="flex-[2] sm:flex-none sm:px-8">
            {submitLabel}
          </Button>
        </div>
      </div>
    </>
  );
}
