"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Home, UtensilsCrossed, Users, Calendar, BookOpen, MapPin, Instagram } from "lucide-react";

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
  { name: "Reservas", href: "#reservas", icon: BookOpen },
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
      // Store current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleItemClick = (href: string, name: string) => {
    console.log(`Navegando a: ${name}`);
    onClose();
    // Smooth scroll to section after menu closes
    if (href !== "#") {
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    }
  };

  // Don't render anything on server side
  if (!mounted) return null;

  const menuContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - rendered at document root level */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            style={{ zIndex: 9998 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Menu Panel - rendered at document root level */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[390px] overflow-hidden"
            style={{ zIndex: 9999 }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegacion"
          >
            {/* Glass morphism background with gradient */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-2xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-white/30 to-gold/15" />

            {/* Border */}
            <div className="absolute inset-0 border-l-2 border-gray-200/50" />

            {/* Content */}
            <div className="relative h-full flex flex-col">
              {/* Header */}
              <div className="px-6 pt-8 pb-6">
                <button
                  onClick={onClose}
                  className="p-2 -ml-2 rounded-full hover:bg-gray-900/5 transition-colors"
                  aria-label="Cerrar menu"
                >
                  <X className="w-6 h-6 text-gray-900" />
                </button>
                <h2 className="text-2xl font-montserrat font-bold text-gray-900 mt-4">
                  Menu
                </h2>
              </div>

              {/* Menu Items */}
              <nav className="flex-1 px-4 overflow-y-auto">
                {visibleItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      onClick={() => handleItemClick(item.href, item.name)}
                      className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-white/60 active:bg-white/80 transition-all duration-200 group backdrop-blur-sm"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/70 backdrop-blur-sm border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
                        <Icon className="w-5 h-5 text-primary" strokeWidth={2} />
                      </div>
                      <span className="text-base font-montserrat font-medium text-gray-900">
                        {item.name}
                      </span>
                    </motion.button>
                  );
                })}
              </nav>

              {/* Bottom Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative px-6 pb-8 pt-4"
              >
                {/* Glass background for footer */}
                <div className="absolute inset-0 bg-white/50 backdrop-blur-xl border-t border-gray-200/50" />

                {/* Social Links */}
                <div className="relative flex items-center gap-4 mb-4">
                  <a
                    href="https://instagram.com/latasquitadesara"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                    <span>@latasquitadesara</span>
                  </a>
                </div>

                {/* Delivery Apps */}
                <div className="relative space-y-2 mb-4">
                  <p className="text-xs text-gray-500 font-medium mb-2">Pide a domicilio:</p>
                  <div className="flex gap-2">
                    <a
                      href="https://glovoapp.com/es/es/valdemoro-ciempozuelos/stores/la-tasquita-de-sara-valdemoro"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-3 py-2 bg-[#FFC244] hover:bg-[#FFD166] rounded-lg text-xs font-bold text-gray-900 text-center transition-colors"
                    >
                      Glovo
                    </a>
                    <a
                      href="https://www.ubereats.com/es/store/la-tasquita-de-sara/tWST6whgU2iUdY71PWw9jw"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-3 py-2 bg-[#06C167] hover:bg-[#06D170] rounded-lg text-xs font-bold text-white text-center transition-colors"
                    >
                      Uber Eats
                    </a>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="relative text-center space-y-1">
                  <p className="text-xs text-gray-500">
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
  // This escapes the stacking context of the Navbar
  return createPortal(menuContent, document.body);
}
