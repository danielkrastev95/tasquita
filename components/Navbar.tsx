"use client";

import { useState } from "react";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { motion, AnimatePresence } from "framer-motion";

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
  { name: "Reservas", href: "#reservas" },
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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/70 backdrop-blur-xl shadow-lg border-b border-white/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <a href="#" className="flex items-center">
            <span
              className={`text-2xl font-playfair font-bold transition-colors ${
                isScrolled ? "text-primary" : "text-white"
              }`}
            >
              La Tasquita de Sara
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`relative text-sm font-medium transition-colors hover:text-primary ${
                  isScrolled ? "text-gray-700" : "text-white"
                }`}
              >
                {link.name}
                {link.badge && (
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute -top-1 -right-3 w-2 h-2 bg-red-500 rounded-full"
                  />
                )}
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`block h-0.5 w-6 transition-all duration-300 ${
                  isScrolled ? "bg-gray-700" : "bg-white"
                } ${isOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`block h-0.5 w-6 transition-all duration-300 ${
                  isScrolled ? "bg-gray-700" : "bg-white"
                } ${isOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-6 transition-all duration-300 ${
                  isScrolled ? "bg-gray-700" : "bg-white"
                } ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/90 backdrop-blur-xl shadow-lg overflow-hidden border-b border-white/20"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="relative flex items-center text-gray-700 hover:text-primary font-medium transition-colors"
                >
                  {link.name}
                  {link.badge && (
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="ml-2 w-2 h-2 bg-red-500 rounded-full"
                    />
                  )}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
