"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Home, UtensilsCrossed, Users, Calendar, MapPin, Instagram } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  eventsEnabled: boolean;
}

const menuItems = [
  { name: "Inicio", href: "#", icon: Home },
  { name: "Menu", href: "#menu", icon: UtensilsCrossed },
  { name: "Nosotros", href: "#nosotros", icon: Users },
  { name: "Eventos", href: "#eventos", icon: Calendar, conditional: true },
  { name: "Contacto", href: "#contacto", icon: MapPin },
];

export default function MobileMenu({ isOpen, onClose, eventsEnabled }: MobileMenuProps) {
  const [mounted, setMounted] = useState(false);
  const visibleItems = menuItems.filter(item => !item.conditional || eventsEnabled);

  // Ensure we only render portal on client side
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();

    // Close menu first
    onClose();

    // Wait for menu close animation to complete before scrolling
    setTimeout(() => {
      if (href === "#") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const element = document.querySelector(href);
        if (element) {
          const offset = 80; // Offset for navbar
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }
    }, 400); // Increased delay to let animation finish
  };

  // Don't render anything on server side or if not mounted
  if (!mounted) return null;

  const menuContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            style={{ zIndex: 9998 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 250,
              mass: 0.8
            }}
            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[390px] overflow-hidden"
            style={{ zIndex: 9999 }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegacion"
          >
            {/* Glass morphism background with gradient */}
            <div className="absolute inset-0 bg-white/90 backdrop-blur-2xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-white/20 to-gold/10" />

            {/* Border */}
            <div className="absolute inset-0 border-l border-gray-200/60" />

            {/* Content */}
            <div className="relative h-full flex flex-col">
              {/* Header */}
              <div className="px-6 pt-8 pb-6">
                <button
                  onClick={onClose}
                  className="p-2 -ml-2 rounded-full hover:bg-gray-900/5 active:bg-gray-900/10 transition-colors"
                  aria-label="Cerrar menu"
                >
                  <X className="w-6 h-6 text-gray-900" strokeWidth={2.5} />
                </button>
              </div>

              {/* Menu Items */}
              <nav className="flex-1 px-4 py-6 overflow-y-auto">
                <div className="space-y-1">
                  {visibleItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.a
                        key={item.name}
                        href={item.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: index * 0.08,
                          duration: 0.4,
                          ease: "easeOut"
                        }}
                        onClick={(e) => handleItemClick(e, item.href)}
                        className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-white/80 active:bg-white/95 active:scale-[0.98] transition-all duration-200 group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white/90 border border-primary/20 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/40 group-active:bg-primary/20 transition-all duration-200">
                          <Icon className="w-5 h-5 text-primary" strokeWidth={2.5} />
                        </div>
                        <span className="text-base font-montserrat font-semibold text-gray-900 group-hover:text-primary transition-colors duration-200">
                          {item.name}
                        </span>
                      </motion.a>
                    );
                  })}
                </div>
              </nav>

              {/* Bottom Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="relative px-6 pb-8 pt-4 border-t border-gray-200/40"
              >
                {/* Social Links */}
                <div className="mb-4">
                  <a
                    href="https://instagram.com/latasquitadesara"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary active:text-primary/80 transition-colors"
                  >
                    <Instagram className="w-4 h-4" strokeWidth={2.5} />
                    <span className="font-medium">@latasquitadesara</span>
                  </a>
                </div>

                {/* Delivery Apps */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wide">Pide a domicilio</p>
                  <div className="flex gap-2">
                    <a
                      href="https://glovoapp.com/es/es/valdemoro-ciempozuelos/stores/la-tasquita-de-sara-valdemoro"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2.5 bg-[#FFC244] hover:bg-[#FFD166] active:bg-[#FFB822] rounded-xl text-sm font-bold text-gray-900 text-center transition-all duration-200 active:scale-95 shadow-sm"
                    >
                      Glovo
                    </a>
                    <a
                      href="https://www.ubereats.com/es/store/la-tasquita-de-sara/tWST6whgU2iUdY71PWw9jw"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2.5 bg-[#06C167] hover:bg-[#06D170] active:bg-[#05AB5A] rounded-xl text-sm font-bold text-white text-center transition-all duration-200 active:scale-95 shadow-sm"
                    >
                      Uber Eats
                    </a>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="text-center space-y-1">
                  <p className="text-xs text-gray-500 font-medium">
                    C. Lili Alvarez, 66 - Valdemoro
                  </p>
                  <p className="text-xs text-gray-400">
                    2025 La Tasquita de Sara
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Use React Portal to render menu at document body level
  return createPortal(menuContent, document.body);
}
