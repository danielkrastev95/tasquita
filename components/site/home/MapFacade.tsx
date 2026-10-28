"use client";

import { ArrowUpRight, Map as MapIcon, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Fachada del mapa: no se pide nada a Google (ni cookies ni ~500 KB) hasta que el usuario
 * pulsa "Ver mapa interactivo". El iframe se monta en el mismo hueco, sin salto de layout.
 * Sin JS sigue quedando el enlace "Abrir en Google Maps".
 */
export function MapFacade({
  embedUrl,
  openUrl,
  title,
  street,
  cityLine,
}: {
  embedUrl: string;
  openUrl: string;
  title: string;
  street: string;
  cityLine: string;
}) {
  const [active, setActive] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  // El botón desaparece al pulsarlo: el foco pasa al mapa para no perderse
  useEffect(() => {
    if (active) frameRef.current?.focus({ preventScroll: true });
  }, [active]);

  return (
    <div className="relative min-h-[22rem] flex-1 overflow-hidden bg-cream-200 md:min-h-[28rem]">
      {active ? (
        <>
          <p aria-hidden className="absolute inset-0 flex items-center justify-center text-xs font-bold tracking-[0.16em] text-ink-muted uppercase">
            Cargando mapa…
          </p>
          <iframe
            ref={frameRef}
            src={embedUrl}
            title={title}
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="absolute inset-0 size-full border-0"
          />
        </>
      ) : (
        <>
          {/* Plano abstracto de calles (decorativo) */}
          <svg aria-hidden viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
            <rect width="400" height="300" fill="var(--color-cream-200)" />
            <rect x="214" y="160" width="82" height="56" fill="var(--color-primary-light)" />
            <rect x="104" y="84" width="82" height="52" fill="var(--color-cream-300)" />
            <g stroke="var(--color-cream)" strokeLinecap="square">
              <path d="M0 70H400M0 150H400M0 230H400M95 0V300M205 0V300M310 0V300" strokeWidth="7" />
              <path d="M-30 280L430 20" strokeWidth="15" />
              <path d="M0 110H95M150 150V230M255 230V300" strokeWidth="4" />
            </g>
          </svg>
          <div aria-hidden className="absolute inset-0 bg-grid" />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-y-auto px-5 py-6">
            <span aria-hidden className="relative flex size-12 items-center justify-center bg-primary text-white shadow-[0_12px_30px_-12px_rgb(28_28_24/0.6)]">
              <span className="absolute inset-0 animate-ping bg-primary/40 [animation-duration:2.4s]" />
              <MapPin className="relative size-6" />
            </span>

            <div className="w-full max-w-[19rem] border border-primary bg-cream px-5 py-5 text-center">
              <p className="font-serif text-[1.35rem] leading-tight font-extrabold text-ink uppercase italic">{street}</p>
              <p className="mt-1 text-sm text-ink-muted">{cityLine}</p>
              <button
                type="button"
                onClick={() => setActive(true)}
                className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2.5 bg-primary px-5 text-xs font-bold tracking-[0.16em] text-white uppercase transition-colors hover:bg-primary-dark"
              >
                <MapIcon aria-hidden className="size-4" />
                Ver mapa interactivo
              </button>
              <p className="mt-2 text-xs leading-snug text-ink-muted">Al cargarlo, Google puede usar cookies.</p>
              <a
                href={openUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex min-h-11 items-center gap-1.5 text-xs font-bold tracking-[0.12em] text-primary uppercase underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary-dark hover:decoration-primary"
              >
                Abrir en Google Maps
                <ArrowUpRight aria-hidden className="size-3.5" />
                <span className="sr-only">(se abre en otra pestaña)</span>
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
