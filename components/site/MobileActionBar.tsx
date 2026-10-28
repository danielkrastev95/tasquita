"use client";

import { CalendarCheck, MapPin, MessageCircle, Phone, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import type { SiteActions } from "./utils";

/* Barra de acciones fija en móvil: aparece al dejar atrás el hero (o tras un poco de scroll). */

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}
function getPastHero() {
  const hero = document.querySelector("[data-hero]");
  return hero ? hero.getBoundingClientRect().bottom < 96 : window.scrollY > window.innerHeight * 0.6;
}
const getServerPastHero = () => false;

const cell =
  "flex h-full flex-col items-center justify-center gap-1 text-[0.6875rem] leading-none font-bold tracking-[0.14em] uppercase transition-colors";

export function MobileActionBar({ actions, hidden }: { actions: SiteActions; hidden: boolean }) {
  const pastHero = useSyncExternalStore(subscribe, getPastHero, getServerPastHero);
  const visible = pastHero && !hidden;

  return (
    <nav
      aria-label="Acciones rápidas"
      aria-hidden={!visible}
      inert={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-primary bg-cream pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] shadow-[0_-12px_30px_-18px_rgb(28_28_24/0.35)] transition-transform duration-500 ease-out-expo md:hidden",
        visible ? "translate-y-0" : "translate-y-[calc(100%+1px)]",
      )}
    >
      <ul className="grid h-16 grid-cols-3 divide-x divide-primary/20 [@media(max-height:44rem)]:h-14">
        <li>
          <a href={actions.telHref} className={cn(cell, "text-ink active:bg-cream-200")}>
            <Phone aria-hidden className="size-5 text-primary" />
            Llamar
          </a>
        </li>
        <li>
          {actions.reserveHref ? (
            <Link href={actions.reserveHref} className={cn(cell, "bg-primary text-white active:bg-primary-dark")}>
              <CalendarCheck aria-hidden className="size-5" />
              Reservar
            </Link>
          ) : actions.whatsappHref ? (
            <a href={actions.whatsappHref} target="_blank" rel="noopener noreferrer" className={cn(cell, "bg-primary text-white active:bg-primary-dark")}>
              <MessageCircle aria-hidden className="size-5" />
              WhatsApp
            </a>
          ) : (
            <Link href="/carta" className={cn(cell, "bg-primary text-white active:bg-primary-dark")}>
              <UtensilsCrossed aria-hidden className="size-5" />
              Carta
            </Link>
          )}
        </li>
        <li>
          <a href={actions.directionsUrl} target="_blank" rel="noopener noreferrer" className={cn(cell, "text-ink active:bg-cream-200")}>
            <MapPin aria-hidden className="size-5 text-primary" />
            Cómo llegar
          </a>
        </li>
      </ul>
    </nav>
  );
}
