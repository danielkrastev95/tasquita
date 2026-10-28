"use client";

import { CalendarPlus, MessageCircle, Phone, Share2 } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const secondary =
  "inline-flex h-11 items-center justify-center gap-1.5 border border-primary/30 px-3 text-xs font-bold tracking-[0.1em] whitespace-nowrap sm:gap-2 sm:px-4 sm:tracking-[0.14em] text-primary uppercase transition-colors hover:border-primary hover:bg-primary hover:text-white active:translate-y-px";

/** Reservar para el evento (WhatsApp o llamada), añadir al calendario (.ics) y compartir. */
export function EventActions({
  id,
  title,
  when,
  siteName,
  reservePhone,
  telHref,
}: {
  id: string;
  title: string;
  /** "viernes 6 de noviembre a las 21:00" */
  when: string;
  siteName: string;
  /** Teléfono de WhatsApp si las reservas están activas */
  reservePhone: string | null;
  telHref: string;
}) {
  const share = async () => {
    const url = `${window.location.origin}/eventos#evento-${id}`;
    const text = `${title} · ${when} en ${siteName}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // El usuario ha cancelado: no hay nada que hacer
      }
      return;
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="grid max-w-md grid-cols-1 gap-2 min-[24rem]:grid-cols-2">
      {reservePhone ? (
        <a
          href={whatsappLink(reservePhone, `¡Hola! Me gustaría reservar para «${title}» (${when}). Seríamos … personas.`)}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(secondary, "border-primary bg-primary text-white hover:bg-primary-dark min-[24rem]:col-span-2")}
        >
          <MessageCircle aria-hidden className="size-4" />
          Reservar para este evento
          <span className="sr-only">(WhatsApp, se abre en otra pestaña)</span>
        </a>
      ) : (
        <a href={telHref} className={cn(secondary, "border-primary bg-primary text-white hover:bg-primary-dark min-[24rem]:col-span-2")}>
          <Phone aria-hidden className="size-4" />
          Reservar por teléfono
        </a>
      )}
      <a href={`/eventos/${id}/evento.ics`} className={secondary}>
        <CalendarPlus aria-hidden className="size-4" />
        <span className="sm:hidden">Calendario</span>
        <span className="hidden sm:inline">Al calendario</span>
      </a>
      <button type="button" onClick={share} className={secondary}>
        <Share2 aria-hidden className="size-4" />
        Compartir
      </button>
    </div>
  );
}
