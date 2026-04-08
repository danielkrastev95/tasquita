"use client";

import { useState } from "react";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { motion } from "framer-motion";
import MobileMenu from "./MobileMenu";

type NavLink = {
  name: string;
  href: string;
  badge?: boolean;
};

const baseNavLinks: NavLink[] = [
  { name: "Carta", href: "/carta" },
  { name: "Nosotros", href: "/#nosotros" },
];

const eventLink: NavLink = { name: "Eventos", href: "/eventos", badge: true };

const endNavLinks: NavLink[] = [{ name: "Contacto", href: "/#contacto" }];

interface NavbarProps {
  eventsEnabled: boolean;
  addressStreet?: string | null;
  addressCity?: string | null;
  heroTitle?: string | null;
}

export default function Navbar({ eventsEnabled, addressStreet, addressCity, heroTitle }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const scrollPosition = useScrollPosition();
  const isScrolled = scrollPosition > 50;

  const navLinks = [
    ...baseNavLinks,
    ...(eventsEnabled ? [eventLink] : []),
    ...endNavLinks,
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Desktop navbar — matches reference HTML: px-6 md:px-12, items-end, Newsreader */}
      <div className="hidden md:block">
        <motion.div
          initial={false}
          animate={{
            backgroundColor: isScrolled
              ? "#fcf9f3"
              : "rgba(252, 249, 243, 0.95)",
            borderBottom: isScrolled
              ? "1px solid #e0d5c7"
              : "1px solid transparent",
          }}
          transition={{ duration: 0.25 }}
          className="w-full"
        >
          <div className="flex justify-between items-end w-full px-6 md:px-12 pt-6 pb-4">
            {/* Logo — Newsreader, large, uppercase, terracotta */}
            <motion.a
              href="/"
              whileHover={{ opacity: 0.85 }}
              className="font-black uppercase tracking-tighter"
              style={{
                fontFamily: "var(--font-newsreader)",
                fontSize: "clamp(1.6rem, 2.2vw, 2.2rem)",
                color: "#2f7780",
                lineHeight: 1,
              }}
            >
              {(heroTitle || "La Tasquita de Sara").toUpperCase()}
            </motion.a>

            {/* Nav links — Newsreader, uppercase */}
            <div className="flex items-center gap-10 mb-0.5">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ opacity: 1 }}
                  className="relative uppercase tracking-tighter transition-opacity"
                  style={{
                    fontFamily: "var(--font-newsreader)",
                    fontSize: "clamp(0.85rem, 1vw, 1rem)",
                    color: "#2f7780",
                    opacity: 0.75,
                    fontWeight: 700,
                  }}
                >
                  {link.name}

                  {link.badge && (
                    <motion.span
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-0.5 -right-2 w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: "#C7AF65" }}
                    />
                  )}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile navbar */}
      <div
        className="md:hidden flex justify-between items-center px-6 py-4"
        style={{
          backgroundColor: isScrolled
            ? "#fcf9f3"
            : "rgba(252, 249, 243, 0.9)",
          backdropFilter: "blur(8px)",
          borderBottom: isScrolled ? "1px solid #e0d5c7" : "none",
          position: "relative",
          zIndex: 51,
        }}
      >
        <motion.a
          href="/"
          className="font-black uppercase tracking-tighter"
          style={{
            fontFamily: "var(--font-newsreader)",
            fontSize: "1.25rem",
            color: "#2f7780",
          }}
        >
          {heroTitle || "La Tasquita"}
        </motion.a>

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 flex flex-col items-center justify-center gap-1.5"
          aria-label="Abrir menú"
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 7 : 0 }}
            className="w-6 h-0.5"
            style={{ backgroundColor: "#3a2a20" }}
          />
          <motion.div
            animate={{ opacity: isOpen ? 0 : 1 }}
            className="w-6 h-0.5"
            style={{ backgroundColor: "#3a2a20" }}
          />
          <motion.div
            animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -7 : 0 }}
            className="w-6 h-0.5"
            style={{ backgroundColor: "#3a2a20" }}
          />
        </motion.button>
      </div>

      <MobileMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        eventsEnabled={eventsEnabled}
        addressStreet={addressStreet}
        addressCity={addressCity}
        heroTitle={heroTitle}
      />
    </nav>
  );
}
