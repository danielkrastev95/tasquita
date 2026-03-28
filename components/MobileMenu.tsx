"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  eventsEnabled: boolean;
}

// ─── Shared tokens ───────────────────────────────────────────────────────────
const T = {
  cream: "#fcf9f3",
  primary: "#2f7780",
  secondary: "#1f5f67",
  gold: "#C7AF65",
  onSurface: "#1c1c18",
  onSurfaceVariant: "#58413b",
  newsreader: "var(--font-newsreader)",
  grotesk: "var(--font-space-grotesk)",
};

const menuItems = [
  { name: "Carta", href: "/carta" },
  { name: "Nosotros", href: "/#nosotros" },
  { name: "Eventos", href: "/eventos", conditional: true },
  { name: "Contacto", href: "/#contacto" },
];

export default function MobileMenu({ isOpen, onClose, eventsEnabled }: MobileMenuProps) {
  const [mounted, setMounted] = useState(false);
  const visibleItems = menuItems.filter((item) => !item.conditional || eventsEnabled);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onClose();

    setTimeout(() => {
      if (href.startsWith("/#")) {
        const hash = href.substring(1);
        if (window.location.pathname === "/") {
          const element = document.querySelector(hash);
          if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
          }
        } else {
          window.location.href = href;
        }
      } else if (href === "/") {
        if (window.location.pathname === "/") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          window.location.href = href;
        }
      } else {
        window.location.href = href;
      }
    }, 500);
  };

  if (!mounted) return null;

  const menuContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* ─── Full-screen overlay ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0"
            style={{ zIndex: 9998, backgroundColor: T.cream }}
            aria-hidden="true"
          >
            {/* Subtle texture / grain effect */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                backgroundRepeat: "repeat",
              }}
            />
          </motion.div>

          {/* ─── Menu content ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 flex flex-col"
            style={{ zIndex: 9999 }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegación"
          >
            {/* ── Top bar ── */}
            <div className="flex justify-between items-center px-6 py-5">
              <a
                href="/"
                onClick={(e) => handleItemClick(e, "/")}
                className="font-black uppercase tracking-tighter"
                style={{
                  fontFamily: T.newsreader,
                  fontSize: "1.1rem",
                  color: T.primary,
                }}
              >
                La Tasquita
              </a>

              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center"
                aria-label="Cerrar menú"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={T.onSurface}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ── Navigation links — massive italic serif ── */}
            <div className="flex-1 flex flex-col justify-center px-6 relative">
              {/* Sideways text */}
              <div
                className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{
                  writingMode: "vertical-lr",
                  transform: "rotate(180deg) translateX(50%)",
                }}
              >
                <span
                  className="text-[0.55rem] font-bold uppercase tracking-[0.25em]"
                  style={{ fontFamily: T.grotesk, color: `${T.primary}30` }}
                >
                  Valdemoro 2025
                </span>
              </div>

              {/* Links */}
              <nav className="pl-6">
                {visibleItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
                  >
                    <a
                      href={item.href}
                      onClick={(e) => handleItemClick(e, item.href)}
                      className="block group"
                    >
                      <span
                        className="font-black italic uppercase leading-[1.05] block transition-colors duration-200"
                        style={{
                          fontFamily: T.newsreader,
                          fontSize: "clamp(3rem, 12vw, 4.5rem)",
                          color: index === 0 ? T.primary : T.onSurface,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {item.name}
                      </span>
                    </a>
                  </motion.div>
                ))}
              </nav>
            </div>

            {/* ── Bottom section ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="px-6 pb-8"
            >
              {/* CTA Button */}
              <a
                href="/#contacto"
                onClick={(e) => handleItemClick(e, "/#contacto")}
                className="flex items-center justify-between w-full px-6 py-5 mb-6 text-white transition-colors"
                style={{ backgroundColor: T.primary }}
              >
                <span
                  className="text-sm font-bold uppercase tracking-widest"
                  style={{ fontFamily: T.grotesk, letterSpacing: "0.14em" }}
                >
                  Reservar mesa
                </span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </a>

              {/* Location + Hours */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span
                    className="text-[0.6rem] font-bold uppercase tracking-widest block mb-1.5"
                    style={{ fontFamily: T.grotesk, color: T.primary, letterSpacing: "0.15em" }}
                  >
                    Ubicación
                  </span>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ fontFamily: T.grotesk, color: T.onSurfaceVariant }}
                  >
                    C. Lili Álvarez, 66
                    <br />
                    28342 Valdemoro
                  </p>
                </div>
                <div>
                  <span
                    className="text-[0.6rem] font-bold uppercase tracking-widest block mb-1.5"
                    style={{ fontFamily: T.grotesk, color: T.primary, letterSpacing: "0.15em" }}
                  >
                    Horario
                  </span>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ fontFamily: T.grotesk, color: T.onSurfaceVariant }}
                  >
                    Mar—Dom
                    <br />
                    9:00—23:00
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(menuContent, document.body);
}
