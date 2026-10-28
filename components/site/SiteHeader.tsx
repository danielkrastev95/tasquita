"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import type { OpeningHours } from "@/lib/settings";
import { cn } from "@/lib/utils";
import { MobileMenu, type MenuContact } from "./MobileMenu";
import { OpenStatus } from "./OpenStatus";
import type { NavLink } from "./utils";

/* Cabecera sticky. Escritorio: logotipo + enlaces. Móvil: logotipo + botón de menú. */

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
  hours,
  contact,
}: {
  name: string;
  links: NavLink[];
  hasUpcomingEvents: boolean;
  hours: OpeningHours;
  contact: MenuContact;
}) {
  const pathname = usePathname();
  const scrolled = useSyncExternalStore(subscribeScroll, getScrolled, getServerScrolled);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 h-(--header-h) border-b transition-[background-color,border-color,box-shadow] duration-300",
          scrolled
            ? "border-primary/15 bg-cream/90 shadow-[0_10px_30px_-20px_rgb(28_28_24/0.35)] backdrop-blur-md"
            : "border-transparent bg-cream",
        )}
      >
        <div className="mx-auto flex h-full max-w-[100rem] items-center justify-between gap-6 px-5 md:px-10 lg:px-14">
          <Link
            href="/"
            className="font-serif text-[1.3rem] leading-none font-extrabold tracking-[-0.03em] whitespace-nowrap text-primary uppercase transition-opacity hover:opacity-80 lg:text-[1.6rem] xl:text-[1.85rem]"
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
            <span aria-hidden className="hidden h-6 w-px bg-primary/20 xl:block" />
            <Link href="/#contacto" title="Horario y contacto" className="hidden text-ink-muted transition-colors hover:text-primary xl:block">
              <OpenStatus hours={hours} className="text-xs tracking-[0.04em]" />
            </Link>
          </nav>

          {/* Móvil */}
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-haspopup="dialog"
            className="-mr-2 inline-flex h-11 items-center gap-3 px-2 text-ink lg:hidden"
          >
            <span className="text-xs font-bold tracking-[0.18em] uppercase">Menú</span>
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
        hours={hours}
        contact={contact}
      />
    </>
  );
}
