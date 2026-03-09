"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface MenuItem {
  name: string;
  description?: string;
  price?: string;
  image?: string;
  popular?: boolean;
  homemade?: boolean;
  award?: string;
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

interface MenuSectionProps {
  menuData: MenuCategory[];
}

export default function MenuSection({ menuData }: MenuSectionProps) {
  const [activeTab, setActiveTab] = useState(menuData[0]?.id || "");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const activeCategory = menuData.find((cat) => cat.id === activeTab);

  // Block body scroll when modal is open and handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedImage) {
        setSelectedImage(null);
      }
    };

    if (selectedImage) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscape);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [selectedImage]);

  return (
    <section id="menu" className="py-12 relative overflow-hidden bg-white">
      {/* Geometric Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-primary/5" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gold/5" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/10 rotate-45" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/10 rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Bold Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.h2
            animate={{
              textShadow: [
                "4px 4px 0px rgba(83, 166, 153, 0.3)",
                "8px 8px 0px rgba(83, 166, 153, 0.3)",
                "4px 4px 0px rgba(83, 166, 153, 0.3)",
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-6xl sm:text-8xl font-black text-gray-900 uppercase tracking-tighter mb-4"
          >
            MENÚ
          </motion.h2>
          <div className="h-2 w-32 bg-gradient-to-r from-primary to-gold mx-auto" />
        </motion.div>

        {/* Category Tabs - Bold Pills */}
        <div className="mb-16">
          <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory md:snap-none md:flex-wrap md:justify-center scrollbar-hide">
            {menuData.map((category, index) => {
              const isActive = activeTab === category.id;
              return (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  aria-label={`Ver categoría ${category.name}`}
                  aria-pressed={isActive}
                  className={`flex-shrink-0 snap-start px-8 py-4 font-black text-lg uppercase tracking-wider transition-all duration-300 min-w-[180px] ${
                    isActive
                      ? 'bg-gradient-to-r from-primary to-gold text-white shadow-2xl'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Menu Items - Compact List Style */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto space-y-4"
        >
          {activeCategory?.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group relative bg-white border-4 border-black hover:border-primary transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">

                  {/* Left: Content */}
                  <div className="flex-1 min-w-0">

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.award && (
                        <span className="inline-block px-2 py-1 bg-gold text-white text-xs font-black uppercase">
                          ★ Premio
                        </span>
                      )}
                      {item.popular && (
                        <span className="inline-block px-2 py-1 bg-primary text-white text-xs font-black uppercase">
                          ♥ Popular
                        </span>
                      )}
                      {item.homemade && (
                        <span className="inline-block px-2 py-1 bg-gray-900 text-white text-xs font-black uppercase">
                          ⌂ Casera
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tight mb-2">
                      {item.name}
                    </h3>

                    {/* Award text */}
                    {item.award && (
                      <p className="text-gold text-sm font-bold mb-2 italic">
                        {item.award}
                      </p>
                    )}

                    {/* Description */}
                    {item.description && (
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-3">
                        {item.description}
                      </p>
                    )}

                    {/* Bottom Row: Price + View Image Button */}
                    <div className="flex items-center gap-4 mt-4">
                      {/* Price */}
                      {item.price && (
                        <span className="text-3xl sm:text-4xl font-black text-primary">
                          {item.price}
                        </span>
                      )}

                      {/* View Image Button */}
                      {item.image && (
                        <motion.button
                          onClick={() => setSelectedImage(item.image!)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label={`Ver foto de ${item.name}`}
                          className="flex items-center gap-2 px-4 py-2 bg-black text-white font-bold text-sm uppercase tracking-wide hover:bg-primary transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span className="hidden sm:inline">Ver foto</span>
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Corner Accent on Hover */}
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Vista de imagen del plato"
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full aspect-[4/3] cursor-default"
            >
              {/* Close Button */}
              <motion.button
                onClick={() => setSelectedImage(null)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Cerrar imagen"
                className="absolute -top-4 -right-4 z-10 w-12 h-12 bg-white text-black font-black text-2xl flex items-center justify-center border-4 border-black hover:bg-primary hover:text-white transition-colors"
              >
                ×
              </motion.button>

              {/* Image */}
              <div className="relative w-full h-full border-8 border-white overflow-hidden">
                <Image
                  src={selectedImage}
                  alt="Plato"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
              </div>

              {/* Hint */}
              <p className="text-white text-center mt-4 font-bold uppercase tracking-wide">
                Toca fuera para cerrar
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
