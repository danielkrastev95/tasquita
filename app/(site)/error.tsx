"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";

/* Error inesperado en una página pública: cabecera y pie siguen visibles (los pinta el layout). */
export default function SiteError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <section className="mx-auto max-w-[100rem] px-5 py-20 md:px-10 md:py-28 lg:px-14">
      <div className="border-t-8 border-gold pt-8">
        <p className="mb-4 text-xs font-bold tracking-[0.2em] text-primary uppercase">Algo ha fallado</p>
        <h1 className="max-w-3xl font-serif text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.9] font-extrabold tracking-[-0.03em] text-balance text-ink uppercase italic">
          Se nos ha quemado algo en la cocina
        </h1>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-muted text-pretty">
          No hemos podido cargar esta página. Vuelve a intentarlo en un momento.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => retry()}
            className="inline-flex h-14 items-center justify-center gap-3 bg-primary px-7 text-sm font-bold tracking-[0.2em] text-white uppercase transition-colors hover:bg-primary-dark"
          >
            <RotateCcw aria-hidden className="size-4" />
            Reintentar
          </button>
          <Link
            href="/"
            className="inline-flex h-14 items-center justify-center border-2 border-primary px-7 text-sm font-bold tracking-[0.2em] text-primary uppercase transition-colors hover:bg-primary hover:text-white"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}
