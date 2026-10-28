import { ArrowRight } from "lucide-react";
import Link from "next/link";

/** Contenido de la página 404 (compartido por la 404 global y la de la web pública). */
export function NotFoundContent() {
  return (
    <>
      <p className="mb-4 flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-primary uppercase">
        <span aria-hidden className="h-px w-10 bg-gold" />
        Error 404
      </p>
      <p aria-hidden className="font-serif text-[clamp(8rem,40vw,22rem)] leading-[0.78] font-extrabold tracking-[-0.05em] glyph-outline text-primary italic">
        404
      </p>
      <h1 className="mt-6 max-w-3xl font-serif text-[clamp(2.25rem,7vw,5rem)] leading-none font-extrabold tracking-[-0.03em] text-balance text-ink uppercase italic">
        Este plato no está en la carta
      </h1>
      <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-muted text-pretty">
        La página que buscas no existe o ha cambiado de sitio. Pero la cocina sigue abierta.
      </p>
      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/carta"
          className="group inline-flex h-14 items-center justify-between gap-6 bg-primary px-7 text-sm font-bold tracking-[0.2em] text-white uppercase transition-colors hover:bg-primary-dark"
        >
          Ver la carta
          <ArrowRight aria-hidden className="size-5 transition-transform group-hover:translate-x-1" />
        </Link>
        <Link
          href="/"
          className="inline-flex h-14 items-center justify-center border-2 border-primary px-7 text-sm font-bold tracking-[0.2em] text-primary uppercase transition-colors hover:bg-primary hover:text-white"
        >
          Volver al inicio
        </Link>
      </div>
    </>
  );
}
