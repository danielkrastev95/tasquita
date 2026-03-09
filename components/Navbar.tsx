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
  { name: "Inicio", href: "#" },
  { name: "Menú", href: "#menu" },
  { name: "Nosotros", href: "#nosotros" },
];

const eventLink: NavLink = { name: "Eventos", href: "#eventos", badge: true };

const endNavLinks: NavLink[] = [
  { name: "Contacto", href: "#contacto" },
];

interface NavbarProps {
  eventsEnabled: boolean;
}

export default function Navbar({ eventsEnabled }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const scrollPosition = useScrollPosition();
  const isScrolled = scrollPosition > 50;

  // Build nav links dynamically
  const navLinks = [
    ...baseNavLinks,
    ...(eventsEnabled ? [eventLink] : []),
    ...endNavLinks,
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Desktop navbar */}
      <div className="hidden md:block">
        <motion.div
          initial={false}
          animate={{
            backgroundColor: isScrolled ? "#ffffff" : "rgba(255, 255, 255, 0.95)",
            borderBottom: isScrolled ? "4px solid #000000" : "4px solid transparent",
          }}
          transition={{ duration: 0.2 }}
          className="w-full shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-8 flex justify-between items-center h-16">
            {/* Logo */}
            <motion.a
              href="#"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <span className="text-2xl font-black uppercase tracking-tighter text-gray-900">
                La Tasquita
              </span>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="flex items-center gap-2">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-4 py-2 font-black uppercase text-sm tracking-wide text-gray-900 hover:text-primary transition-colors"
                >
                  {link.name}

                  {/* Badge */}
                  {link.badge && (
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full"
                    />
                  )}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile navbar */}
      <div className="md:hidden flex justify-between items-center p-4">
        {/* Mobile Logo */}
        <motion.a
          href="#"
          className="text-xl font-black uppercase tracking-tighter"
          style={{
            color: isScrolled ? "#000000" : "#ffffff",
            textShadow: isScrolled ? "none" : "2px 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          TASQUITA
        </motion.a>

        {/* Hamburger */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.9 }}
          animate={{
            backgroundColor: isScrolled ? "#ffffff" : "rgba(0, 0, 0, 0.5)",
            borderColor: "#000000",
          }}
          className="w-12 h-12 border-4 flex flex-col items-center justify-center gap-1"
        >
          <motion.div
            animate={{
              rotate: isOpen ? 45 : 0,
              y: isOpen ? 6 : 0,
              backgroundColor: isScrolled ? "#000000" : "#ffffff",
            }}
            className="w-6 h-1"
          />
          <motion.div
            animate={{
              opacity: isOpen ? 0 : 1,
              backgroundColor: isScrolled ? "#000000" : "#ffffff",
            }}
            className="w-6 h-1"
          />
          <motion.div
            animate={{
              rotate: isOpen ? -45 : 0,
              y: isOpen ? -6 : 0,
              backgroundColor: isScrolled ? "#000000" : "#ffffff",
            }}
            className="w-6 h-1"
          />
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} navLinks={navLinks} />
    </nav>
  );
}
