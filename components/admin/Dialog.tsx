"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useKeyboardInset } from "./useKeyboardInset";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md";
  /** false mientras hay una acción en curso: ni Escape ni el fondo cierran. */
  dismissible?: boolean;
  className?: string;
};

/**
 * Diálogo modal accesible sobre <dialog> nativo (foco atrapado, Escape, fondo inerte).
 * En móvil se abre como hoja inferior; en escritorio, centrado.
 */
export function Dialog({ open, onClose, title, description, children, footer, size = "sm", dismissible = true, className }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const keyboard = useKeyboardInset();
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // showModal() enfoca el primer control; respetamos el que marque `data-autofocus`.
      dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Evita que la página de fondo haga scroll mientras el diálogo está abierto (iOS).
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        event.preventDefault();
        if (dismissible) onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && dismissible) onClose();
      }}
      // Con el teclado abierto, la hoja sube y se encoge para quedar entera por encima de él
      style={open && keyboard ? { transform: `translateY(-${keyboard}px)`, maxHeight: `calc(100dvh - ${keyboard}px - 0.75rem)` } : undefined}
      className={cn(
        "fixed inset-x-0 top-auto bottom-0 m-0 h-auto max-h-[92dvh] w-full max-w-full overflow-y-auto overscroll-contain rounded-t-[1.75rem] border-0 bg-white p-0 text-ink shadow-2xl",
        "transition-[translate,opacity] duration-300 ease-out-expo starting:translate-y-full",
        "backdrop:bg-ink/45 backdrop:backdrop-blur-[2px]",
        "md:inset-0 md:m-auto md:h-fit md:max-h-[85dvh] md:rounded-3xl md:starting:translate-y-3 md:starting:opacity-0",
        size === "sm" ? "md:max-w-md" : "md:max-w-xl",
        className,
      )}
    >
      {open && (
        <div className="pt-5 pr-[max(1.25rem,env(safe-area-inset-right))] pb-[max(1.25rem,env(safe-area-inset-bottom))] pl-[max(1.25rem,env(safe-area-inset-left))] md:px-6 md:pt-6 md:pb-6">
          <header className="mb-4 flex items-start justify-between gap-4">
            <div className="space-y-1.5 pt-1">
              <h2 id={titleId} className="font-serif text-2xl leading-tight font-bold italic text-ink">
                {title}
              </h2>
              {description && (
                <div id={descriptionId} className="text-sm leading-relaxed text-ink-muted">
                  {description}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={!dismissible}
              aria-label="Cerrar"
              className="-mt-1 -mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full text-ink-muted transition hover:bg-cream-200 hover:text-ink disabled:opacity-40"
            >
              <X className="size-5" aria-hidden />
            </button>
          </header>
          {children}
          {footer && <footer className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">{footer}</footer>}
        </div>
      )}
    </dialog>
  );
}

type ConfirmDialogProps = {
  open: boolean;
  onCancel: () => void;
  /** Puede ser async; mientras se resuelve el botón muestra "cargando". */
  onConfirm: () => void | Promise<void>;
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "primary";
};

/** Confirmación accesible (sustituye a window.confirm). El foco empieza en «Cancelar». */
export function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  tone = "danger",
}: ConfirmDialogProps) {
  const [pending, startTransition] = useTransition();
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      title={title}
      description={description}
      dismissible={!pending}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={pending} data-autofocus className="w-full sm:w-auto">
            {cancelLabel}
          </Button>
          <Button
            variant={tone === "danger" ? "danger" : "primary"}
            loading={pending}
            onClick={() => startTransition(async () => onConfirm())}
            className="w-full sm:w-auto"
          >
            {confirmLabel}
          </Button>
        </>
      }
    />
  );
}
