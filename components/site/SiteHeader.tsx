"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { MobileActionBar } from "./MobileActionBar";
import { MobileMenu, type MenuContact } from "./MobileMenu";
import type { NavLink, Schedule, SiteActions } from "./utils";

/* Cabecera sticky. Escritorio: logotipo + enlaces + "Reservar". Móvil: logotipo + botón de menú + barra de acciones fija.
 * En móvil y tablet se esconde al bajar y reaparece al subir, para dejar más pantalla al contenido
 * (html[data-header-hidden] lo usan también las barras que van pegadas debajo, como los chips de la carta). */

function subscribeScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}
const getScrolled = () => window.scrollY > 8;
const getServerScrolled = () => false;

export function SiteHeader({
  name,
  links,
  hasUpcomingEvents,
  schedule,
  contact,
  actions,
}: {
  name: string;
  links: NavLink[];
  hasUpcomingEvents: boolean;
  schedule: Schedule;
  contact: MenuContact;
  actions: SiteActions;
}) {
  const pathname = usePathname();
  const scrolled = useSyncExternalStore(subscribeScroll, getScrolled, getServerScrolled);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const close = useCallback(() => setOpen(false), []);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 64rem)");
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const dy = y - lastY;
      if (Math.abs(dy) < 8 && y > 0) return;
      lastY = y;
      const focusInside = headerRef.current?.contains(document.activeElement) ?? false;
      setHidden(!desktop.matches && dy > 0 && y > 160 && !focusInside);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const headerHidden = hidden && !open;
  useEffect(() => {
    document.documentElement.toggleAttribute("data-header-hidden", headerHidden);
    return () => document.documentElement.removeAttribute("data-header-hidden");
  }, [headerHidden]);

  return (
    <>
      <header
        ref={headerRef}
        onFocus={() => setHidden(false)}
        className={cn(
          "sticky top-0 z-50 h-(--header-h) border-b transition-[background-color,border-color,box-shadow,translate] duration-300 ease-out-expo lg:translate-y-0",
          scrolled ? "border-primary/15 bg-cream shadow-[0_10px_30px_-22px_rgb(28_28_24/0.4)]" : "border-transparent bg-cream",
          headerHidden && "-translate-y-full shadow-none",
        )}
      >
        {/* pr-3: el botón de menú lleva su propio relleno y su icono queda alineado con el margen de 20 px */}
        <div className="mx-auto flex h-full max-w-[100rem] items-center justify-between gap-3 pr-3 pl-5 sm:gap-6 md:px-10 lg:px-14">
          <Link
            href="/"
            className="line-clamp-2 min-w-0 font-serif text-[clamp(1.05rem,5.6vw,1.3rem)] leading-[0.95] font-extrabold tracking-[-0.03em] text-balance text-primary uppercase transition-opacity hover:opacity-80 lg:line-clamp-none lg:shrink-0 lg:text-[1.6rem] lg:whitespace-nowrap xl:text-[1.85rem]"
          >
            {name}
          </Link>

          {/* Escritorio */}
          <nav aria-label="Principal" className="hidden items-center gap-9 lg:flex">
            <ul className="flex items-center gap-7 xl:gap-9">
              {links.map((link) => {
                const active = link.href === pathname;
                const isEvents = link.href === "/eventos";
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative inline-flex h-11 items-center font-serif text-[1.05rem] font-bold tracking-[-0.01em] uppercase transition-colors",
                        "after:absolute after:inset-x-0 after:bottom-2 after:h-0.5 after:origin-left after:bg-gold after:transition-transform after:duration-300",
                        active ? "text-primary after:scale-x-100" : "text-primary/70 after:scale-x-0 hover:text-primary hover:after:scale-x-100",
                      )}
                    >
                      {link.label}
                      {isEvents && hasUpcomingEvents && (
                        <span aria-hidden className="absolute top-2 -right-2.5 size-1.5 animate-pulse-dot rounded-full bg-gold" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
            {actions.reserveHref ? (
              <Link
                href={actions.reserveHref}
                className="inline-flex h-11 items-center bg-primary px-5 text-xs font-bold tracking-[0.18em] text-white uppercase transition-colors hover:bg-primary-dark active:translate-y-px"
              >
                Reservar
              </Link>
            ) : (
              <a
                href={actions.telHref}
                className="inline-flex h-11 items-center bg-primary px-5 text-xs font-bold tracking-[0.18em] text-white uppercase transition-colors hover:bg-primary-dark active:translate-y-px"
              >
                Llamar
              </a>
            )}
          </nav>

          {/* Móvil */}
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-haspopup="dialog"
            className="inline-flex h-11 min-w-11 shrink-0 items-center justify-center gap-3 px-2 text-ink lg:hidden"
          >
            {/* En pantallas muy estrechas solo el icono (el texto sigue disponible para lectores de pantalla) */}
            <span className="sr-only text-xs font-bold tracking-[0.18em] uppercase min-[24rem]:not-sr-only">Menú</span>
            <span aria-hidden className="flex w-6 flex-col gap-[5px]">
              <span className="h-0.5 w-full bg-current" />
              <span className="h-0.5 w-full bg-current" />
              <span className="h-0.5 w-2/3 self-end bg-current" />
            </span>
          </button>
        </div>
      </header>

      <MobileMenu
        open={open}
        onClose={close}
        triggerRef={triggerRef}
        name={name}
        links={links}
        pathname={pathname}
        schedule={schedule}
        contact={contact}
        actions={actions}
      />
      <MobileActionBar actions={actions} hidden={open} />
    </>
  );
}
