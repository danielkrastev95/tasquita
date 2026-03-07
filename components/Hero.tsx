"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface FeaturedEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
}

interface HeroProps {
  featuredEvent: FeaturedEvent | null;
}

export default function Hero({ featuredEvent }: HeroProps) {

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600"
        alt="La Tasquita de Sara - Restaurante en Valdemoro"
        fill
        priority
        className="object-cover"
        quality={90}
      />

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary/30 to-transparent"
        style={{
          background: `linear-gradient(135deg, rgba(83, 166, 153, 0.5) 0%, rgba(83, 166, 153, 0.3) 50%, rgba(0, 0, 0, 0.4) 100%)`,
        }}
      />

      {/* Featured Event Banner - Floating */}
      <AnimatePresence>
        {featuredEvent && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.8, delay: 1.2, type: "spring" }}
            className="absolute top-24 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 z-30 sm:w-full sm:max-w-2xl"
          >
            <motion.a
              href="#eventos"
              whileHover={{ scale: 1.02, y: -3 }}
              className="block mx-auto"
            >
              {/* Glass Morphism Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                {/* Glass background with blur */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-xl" />

                {/* Gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent" />

                {/* Animated light reflection */}
                <motion.div
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                    backgroundSize: "200% 200%",
                  }}
                />

                <div className="relative p-4 sm:p-6">
                  {/* Badge and Live indicator */}
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-gold/90 to-amber-500/90 backdrop-blur-sm rounded-full text-xs font-bold text-white uppercase tracking-wide shadow-lg">
                      Evento Destacado
                    </span>
                    <motion.span
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="flex items-center gap-1 text-white/90 text-xs font-medium"
                    >
                      <span className="w-2 h-2 bg-red-400 rounded-full" />
                      En vivo
                    </motion.span>
                  </div>

                  {/* Content - Centered layout */}
                  <div className="text-center sm:text-left">
                    <h3 className="text-white font-bold text-base sm:text-xl mb-2 drop-shadow-lg">
                      {featuredEvent.title}
                    </h3>
                    <div className="flex flex-row items-center justify-center sm:justify-start gap-2 text-white/95 text-xs sm:text-sm font-medium">
                      <span className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-lg">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(featuredEvent.date).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                      <span className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-lg">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {featuredEvent.time}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom glow effect */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              </div>
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-playfair font-bold text-white mb-6 leading-tight"
          >
            La Tasquita de Sara
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl text-white/90 mb-12 font-light"
          >
            Bar de tapas moderno con hamburguesas gourmet y cocina de mercado
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="#menu"
              className="px-8 py-4 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105"
            >
              Ver menú
            </a>
            <a
              href="#reservas"
              className="px-8 py-4 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-primary transition-all duration-300 hover:scale-105"
            >
              Reservar mesa
            </a>
          </motion.div>
        </div>
      </div>

      {/* Delivery Apps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute bottom-24 left-0 right-0 z-20 flex justify-center"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-white/90 text-sm font-medium text-center">
            Pide a domicilio
          </span>

          <div className="flex items-center justify-center gap-3">
            {/* Glovo */}
            <motion.a
              href="https://glovoapp.com/es/es/valdemoro-ciempozuelos/stores/la-tasquita-de-sara-valdemoro"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#FFC244] hover:bg-[#FFD166] transition-all duration-300 rounded-xl px-6 py-3 shadow-lg hover:shadow-xl w-32 text-center flex items-center justify-center"
              aria-label="Pedir en Glovo"
            >
              <span className="font-bold text-gray-900 text-sm whitespace-nowrap">Glovo</span>
            </motion.a>

            {/* Uber Eats */}
            <motion.a
              href="https://www.ubereats.com/es/store/la-tasquita-de-sara/tWST6whgU2iUdY71PWw9jw?srsltid=AfmBOoqpmxu_smOZ74LF4eBhWqkldFrlinhkREF6JiLZPipn20vP-BqJ"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#06C167] hover:bg-[#06D170] transition-all duration-300 rounded-xl px-6 py-3 shadow-lg hover:shadow-xl w-32 text-center flex items-center justify-center"
              aria-label="Pedir en Uber Eats"
            >
              <span className="font-bold text-white text-sm whitespace-nowrap">Uber Eats</span>
            </motion.a>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2"
        >
          <div className="w-1 h-3 bg-white rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
