"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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

  const activeCategory = menuData.find((cat) => cat.id === activeTab);

  return (
    <section id="menu" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-playfair font-bold text-gray-900 mb-4">
            Nuestra Carta
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto" />
        </motion.div>

        {/* Tabs - Horizontal scroll on mobile, wrap on desktop */}
        <div className="mb-12 -mx-4 sm:mx-0">
          {/* Scroll hint for mobile */}
          <div className="flex items-center justify-center gap-2 mb-3 md:hidden">
            <svg
              className="w-4 h-4 text-gray-400 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            <p className="text-xs text-gray-500 font-medium">
              Desliza para ver más categorías
            </p>
          </div>

          {/* Tabs container with gradient fade on mobile */}
          <div className="relative px-4 sm:px-0">
            {/* Gradient overlay on right (mobile only) */}
            <div className="absolute right-0 top-0 bottom-3 w-12 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none md:hidden z-10" />

            <div className="flex gap-3 overflow-x-auto md:overflow-visible pb-3 scrollbar-hide snap-x snap-mandatory md:snap-none md:flex-wrap md:justify-center">
              {menuData.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`flex-shrink-0 snap-start px-8 py-3.5 rounded-lg font-medium transition-all duration-300 whitespace-nowrap min-w-[160px] ${
                    activeTab === category.id
                      ? "bg-primary text-white shadow-lg scale-105"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {category.name}
                </button>
              ))}
              {/* Spacer for mobile to allow scrolling past last item */}
              <div className="w-4 flex-shrink-0 md:hidden" />
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {activeCategory?.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group"
            >
              {/* Image */}
              {item.image && (
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-5">
                {/* Badges */}
                {item.popular && (
                  <div className="inline-block bg-gold text-white px-2.5 py-1 text-xs font-bold rounded-md mb-3">
                    ⭐ MÁS PEDIDA
                  </div>
                )}
                {item.award && (
                  <div className="inline-block bg-gradient-to-r from-gold to-yellow-500 text-white px-2.5 py-1 text-xs font-bold rounded-md mb-3 shadow-md">
                    🏆 PREMIADA
                  </div>
                )}
                {item.homemade && (
                  <div className="inline-block bg-primary text-white px-2.5 py-1 text-xs font-bold rounded-md mb-3">
                    🏠 CASERA
                  </div>
                )}

                {/* Title */}
                <h3 className="text-lg font-playfair font-bold text-gray-900 mb-2">
                  {item.name}
                </h3>

                {/* Award text */}
                {item.award && (
                  <p className="text-gold text-xs font-semibold mb-2 italic">
                    {item.award}
                  </p>
                )}

                {/* Description */}
                {item.description && (
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                    {item.description}
                  </p>
                )}

                {/* Price */}
                {item.price && (
                  <p className="text-primary font-bold text-lg mt-auto">
                    {item.price}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
