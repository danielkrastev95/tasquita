"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ConfirmDialog } from "./Dialog";

/**
 * Avisa antes de perder cambios sin guardar:
 *  - al cerrar/recargar la pestaña (beforeunload, diálogo del navegador);
 *  - al pulsar cualquier enlace interno del panel (diálogo propio).
 * Devuelve el diálogo para renderizarlo dentro del formulario.
 */
export function useLeaveGuard(dirty: boolean) {
  const router = useRouter();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => {
    if (!dirty) return;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    // Fase de captura: se ejecuta antes que el onClick de <Link> y lo puede frenar.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if ((anchor.target && anchor.target !== "_self") || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      event.preventDefault();
      event.stopPropagation();
      setPendingHref(`${url.pathname}${url.search}${url.hash}`);
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [dirty]);

  const dialog = (
    <ConfirmDialog
      open={pendingHref !== null}
      onCancel={() => setPendingHref(null)}
      onConfirm={() => {
        if (pendingHref) router.push(pendingHref);
        setPendingHref(null);
      }}
      title="¿Salir sin guardar?"
      description="Has hecho cambios que todavía no están guardados. Si sales ahora, se perderán."
      confirmLabel="Salir sin guardar"
      cancelLabel="Seguir editando"
    />
  );

  return dialog;
}
