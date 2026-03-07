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
    <section id="menu" className="py-20 relative overflow-hidden">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50/50" />

      {/* Blur orbs */}
      <div className="absolute top-40 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-40 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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
          <div className="w-24 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 mx-auto rounded-full" />
        </motion.div>

        {/* Glass Morphism Tabs */}
        <div className="mb-12 -mx-4 sm:mx-0">
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

          <div className="relative px-4 sm:px-0">
            <div className="absolute right-0 top-0 bottom-3 w-12 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none md:hidden z-10" />

            <div className="flex gap-3 overflow-x-auto md:overflow-visible pb-3 scrollbar-hide snap-x snap-mandatory md:snap-none md:flex-wrap md:justify-center">
              {menuData.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex-shrink-0 snap-start px-8 py-3.5 rounded-2xl font-medium transition-all duration-300 whitespace-nowrap min-w-[160px] overflow-hidden ${
                    activeTab === category.id ? "text-white" : "text-gray-700"
                  }`}
                >
                  {/* Glass background */}
                  <div className={`absolute inset-0 ${
                    activeTab === category.id
                      ? "bg-primary"
                      : "bg-white/60 backdrop-blur-xl hover:bg-white/80"
                  } transition-all duration-300`} />

                  {/* Border */}
                  <div className="absolute inset-0 rounded-2xl border border-white/20" />

                  {/* Active indicator */}
                  {activeTab === category.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-2xl shadow-lg"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}

                  <span className="relative z-10">{category.name}</span>
                </motion.button>
              ))}
              <div className="w-4 flex-shrink-0 md:hidden" />
            </div>
          </div>
        </div>

        {/* Menu Items with Glass Morphism Cards */}
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
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group relative"
            >
              {/* Glass Card */}
              <div className="relative h-full rounded-3xl overflow-hidden">
                {/* Glass background */}
                <div className="absolute inset-0 bg-white/70 backdrop-blur-xl" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30" />

                {/* Border */}
                <div className="absolute inset-0 rounded-3xl border border-white/40 group-hover:border-primary/30 transition-colors duration-500" />

                {/* Card content */}
                <div className="relative h-full">
                  {/* Image */}
                  {item.image && (
                    <div className="relative h-48 w-full overflow-hidden rounded-t-3xl">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      {/* Image overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Elegant Badges - Single Unified Style */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.award && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-primary/10 to-gold/10 border border-gold/20 text-gold text-xs font-semibold backdrop-blur-xl">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Premio
                        </span>
                      )}
                      {item.popular && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold backdrop-blur-xl">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                          </svg>
                          Popular
                        </span>
                      )}
                      {item.homemade && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold backdrop-blur-xl">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                          </svg>
                          Casera
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-playfair font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
                      {item.name}
                    </h3>

                    {/* Award text */}
                    {item.award && (
                      <p className="text-gold/80 text-xs font-medium mb-2 italic">
                        {item.award}
                      </p>
                    )}

                    {/* Description */}
                    {item.description && (
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    {/* Price */}
                    {item.price && (
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200/50">
                        <span className="text-primary font-bold text-xl">
                          {item.price}
                        </span>
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </motion.div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover shine effect */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                  animate={{
                    backgroundPosition: ["200% 0%", "-200% 0%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                    backgroundSize: '200% 100%',
                  }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
