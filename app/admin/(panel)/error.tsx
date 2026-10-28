"use client";

import { RefreshCw, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { Button, buttonClasses } from "@/components/ui/Button";

/** Fallo inesperado (p. ej. sin conexión con la base de datos): mensaje claro y botón de reintentar. */
export default function PanelError({ error, retry }: { error: unknown; retry: () => void }) {
  const [pending, startTransition] = useTransition();
  const digest = error instanceof Error && "digest" in error ? String((error as Error & { digest?: string }).digest ?? "") : "";

  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-12 text-center">
      <span className="mb-5 inline-flex size-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
        <TriangleAlert className="size-7" aria-hidden />
      </span>
      <h1 className="font-serif text-3xl font-bold text-ink italic">Algo no ha ido bien</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        No hemos podido cargar esta página. Suele ser la conexión: comprueba que tienes internet y vuelve a intentarlo. Lo que ya habías guardado está a salvo.
      </p>
      <div className="mt-6 flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
        <Button loading={pending} onClick={() => startTransition(() => retry())}>
          <RefreshCw className="size-4" aria-hidden />
          Reintentar
        </Button>
        <Link href="/admin" className={buttonClasses("secondary")}>
          Ir al inicio
        </Link>
      </div>
      {digest && <p className="mt-6 text-xs text-ink-muted/70">Código del error: {digest}</p>}
    </div>
  );
}
