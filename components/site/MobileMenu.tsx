"use client";

import { ArrowRight, MapPin, Phone, X } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, type RefObject } from "react";
import { cn } from "@/lib/utils";
import { DeliveryLinks } from "./DeliveryLinks";
import { OpenStatus } from "./OpenStatus";
import { OpeningHoursList } from "./OpeningHoursList";
import { pad2, type NavLink, type Schedule, type SiteActions } from "./utils";

export type MenuContact = {
  addressStreet: string;
  addressCity: string;
  glovoUrl: string | null;
  uberEatsUrl: string | null;
  deliveryLabel: string;
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const EASE = [0.16, 1, 0.3, 1] as const;

/** Menú móvil a pantalla completa: Esc cierra, foco atrapado y devuelto, scroll bloqueado. */
export function MobileMenu({
  open,
  onClose,
  triggerRef,
  name,
  links,
  pathname,
  schedule,
  contact,
  actions,
}: {
  open: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  name: string;
  links: NavLink[];
  pathname: string;
  schedule: Schedule;
  contact: MenuContact;
  actions: SiteActions;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const items = [...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    // Si se gira la pantalla o se agranda la ventana hasta escritorio, se cierra
    const desktop = window.matchMedia("(min-width: 64rem)");
    const onDesktop = (e: MediaQueryListEvent) => e.matches && onClose();

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onDesktop);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onDesktop);
      html.style.overflow = prevOverflow;
      trigger?.focus({ preventScroll: true });
    };
  }, [open, onClose, triggerRef]);

  return (
    <AnimatePresence>
      {open && (
        <m.div
          ref={dialogRef}
          id="menu-movil"
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-0 z-[60] flex flex-col overflow-x-hidden overflow-y-auto overscroll-contain bg-cream pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] lg:hidden"
        >
          <div className="flex h-(--header-h) shrink-0 items-center justify-between border-b border-primary/15 px-5 md:px-10">
            <Link href="/" onClick={onClose} className="font-serif text-[1.3rem] leading-none font-extrabold tracking-[-0.03em] text-primary uppercase">
              {name}
            </Link>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Cerrar menú"
              className="-mr-2 inline-flex size-11 items-center justify-center text-ink transition-colors hover:text-primary"
            >
              <X aria-hidden className="size-7" strokeWidth={1.75} />
            </button>
          </div>

          <nav aria-label="Principal" className="px-5 pt-6 pb-8 md:px-10">
            <ol>
              {links.map((link, i) => {
                const active = link.href === pathname;
                return (
                  <m.li
                    key={link.href}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 + i * 0.05, duration: 0.6, ease: EASE }}
                    className="border-b border-primary/15 last:border-b-0"
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className="group flex items-baseline gap-4 py-2"
                    >
                      <span className="w-6 shrink-0 text-xs font-bold tracking-[0.12em] text-gold-deep tabular-nums">{pad2(i + 1)}</span>
                      <span
                        className={cn(
                          "font-serif text-[clamp(2.25rem,min(12vw,9svh),4.25rem)] leading-none font-extrabold tracking-[-0.025em] uppercase italic transition-colors group-hover:text-primary",
                          active ? "text-primary" : "text-ink",
                        )}
                      >
                        {link.label}
                      </span>
                    </Link>
                  </m.li>
                );
              })}
            </ol>
            {actions.reserveHref && (
              <m.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 + links.length * 0.05, duration: 0.6, ease: EASE }}
              >
                <Link
                  href={actions.reserveHref}
                  onClick={onClose}
                  className="group mt-6 flex h-14 items-center justify-between bg-primary px-6 text-sm font-bold tracking-[0.2em] text-white uppercase transition-colors hover:bg-primary-dark active:bg-primary-dark"
                >
                  Reservar mesa
                  <ArrowRight aria-hidden className="size-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </m.div>
            )}
          </nav>

          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
            className="mt-auto grid gap-px border-t border-primary bg-primary"
          >
            <section aria-label="Horario" className="bg-cream px-5 py-5 md:px-10">
              <div className="mb-2 flex items-center justify-between gap-3">
                <h2 className="text-xs font-bold tracking-[0.16em] text-primary uppercase">Horario</h2>
                <OpenStatus schedule={schedule} className="text-xs text-ink" />
              </div>
              <OpeningHoursList schedule={schedule} compact className="pl-3" />
            </section>

            <div className="grid grid-cols-2 gap-px">
              <a href={actions.telHref} className="flex min-h-16 items-center gap-3 bg-ink px-5 py-4 text-white transition-colors hover:bg-ink/90 focus-visible:outline-gold md:px-10">
                <Phone aria-hidden className="size-5 shrink-0 text-gold" />
                <span className="min-w-0">
                  <span className="block text-[0.6875rem] font-bold tracking-[0.16em] text-white/75 uppercase">Llamar</span>
                  <span className="block truncate font-semibold tabular-nums">{actions.phone}</span>
                </span>
              </a>
              <a
                href={actions.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-16 items-center gap-3 bg-cream px-5 py-4 text-ink transition-colors hover:bg-cream-200 md:px-10"
              >
                <MapPin aria-hidden className="size-5 shrink-0 text-primary" />
                <span className="min-w-0">
                  <span className="block text-[0.6875rem] font-bold tracking-[0.16em] text-primary uppercase">Cómo llegar</span>
                  <span className="block truncate text-sm font-semibold">{contact.addressStreet}</span>
                </span>
              </a>
            </div>

            {(contact.glovoUrl || contact.uberEatsUrl) && (
              <div className="flex flex-wrap items-center justify-between gap-3 bg-cream px-5 py-4 md:px-10">
                <span className="text-xs font-bold tracking-[0.16em] text-ink-muted uppercase">{contact.deliveryLabel}</span>
                <DeliveryLinks glovoUrl={contact.glovoUrl} uberEatsUrl={contact.uberEatsUrl} />
              </div>
            )}
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
