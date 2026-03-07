"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  category: "musica" | "gastronomia" | "especial";
  image?: string;
  featured?: boolean;
}

interface EventsData {
  enabled: boolean;
  events: Event[];
}

interface EventsSectionProps {
  eventsData: EventsData;
}

const categoryConfig = {
  musica: {
    color: "from-purple-500 to-pink-500",
    icon: "🎵",
    label: "Música en Vivo",
  },
  gastronomia: {
    color: "from-amber-500 to-orange-500",
    icon: "🍷",
    label: "Gastronomía",
  },
  especial: {
    color: "from-primary to-emerald-500",
    icon: "✨",
    label: "Evento Especial",
  },
};

export default function EventsSection({ eventsData }: EventsSectionProps) {
  // Si los eventos están deshabilitados, no renderizar nada
  if (!eventsData.enabled || eventsData.events.length === 0) {
    return null;
  }

  return (
    <section id="eventos" className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-20 -right-20 w-80 h-80 bg-gold/5 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <div className="bg-gradient-to-r from-primary to-gold text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg">
              Próximos Eventos
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-playfair font-bold text-gray-900 mb-4"
          >
            Eventos
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            No te pierdas nuestros eventos especiales. Música, gastronomía y momentos inolvidables.
          </motion.p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventsData.events.map((event, index) => {
            const config = categoryConfig[event.category];
            const eventDate = new Date(event.date);
            const formattedDate = eventDate.toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
            });

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="group relative"
              >
                {/* Featured badge */}
                {event.featured && (
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-3 -right-3 z-20 bg-gradient-to-r from-gold to-amber-400 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl"
                  >
                    ⭐ DESTACADO
                  </motion.div>
                )}

                {/* Card */}
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 h-full">
                  {/* Image */}
                  {event.image && (
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />

                      {/* Category badge on image */}
                      <div className={`absolute top-4 left-4 bg-gradient-to-r ${config.color} text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm`}>
                        {config.icon} {config.label}
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Date & Time */}
                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-primary font-semibold">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formattedDate}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {event.time}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300">
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-bl-full" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-6">
            ¿Quieres organizar tu evento con nosotros?
          </p>
          <a
            href="#contacto"
            className="inline-block bg-gradient-to-r from-primary to-gold text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Contáctanos
          </a>
        </motion.div>
      </div>
    </section>
  );
}
