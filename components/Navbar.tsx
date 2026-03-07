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
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto pt-4">
        <motion.div
          initial={false}
          animate={{
            backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0)",
            borderColor: isScrolled ? "rgba(255, 255, 255, 0.4)" : "rgba(255, 255, 255, 0)",
            boxShadow: isScrolled
              ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              : "0 0 0 0 rgba(0, 0, 0, 0)",
          }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1]
          }}
          className="flex justify-between items-center h-16 px-6 backdrop-blur-xl rounded-2xl border"
        >
          {/* Logo */}
          <a href="#" className="flex items-center">
            <motion.span
              initial={false}
              animate={{
                color: isScrolled ? "rgb(83, 166, 153)" : "rgb(255, 255, 255)"
              }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              className="text-2xl font-montserrat font-bold"
            >
              La Tasquita de Sara
            </motion.span>
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
        </motion.div>
      </div>

      {/* Mobile menu */}
      <MobileMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        eventsEnabled={eventsEnabled}
      />
    </nav>
  );
}
