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
    label: "MÚSICA EN VIVO",
    color: "bg-primary",
  },
  gastronomia: {
    label: "GASTRONOMÍA",
    color: "bg-gold",
  },
  especial: {
    label: "ESPECIAL",
    color: "bg-gray-900",
  },
};

export default function EventsSection({ eventsData }: EventsSectionProps) {
  if (!eventsData.enabled || eventsData.events.length === 0) {
    return null;
  }

  return (
    <section id="eventos" className="py-12 bg-gray-100 relative overflow-hidden">
      {/* Geometric Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 border-8 border-primary/10 rotate-12" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gold/5" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Title */}
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
                "6px 6px 0px rgba(83, 166, 153, 0.3)",
                "10px 10px 0px rgba(83, 166, 153, 0.3)",
                "6px 6px 0px rgba(83, 166, 153, 0.3)",
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-6xl sm:text-8xl font-black text-gray-900 uppercase tracking-tighter mb-4"
          >
            Eventos
          </motion.h2>
          <div className="h-2 w-32 bg-gradient-to-r from-primary to-gold mx-auto" />
        </motion.div>

        {/* Events Grid - Poster Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventsData.events.map((event, index) => {
            const config = categoryConfig[event.category];
            const eventDate = new Date(event.date);
            const day = eventDate.getDate();
            const month = eventDate.toLocaleDateString("es-ES", { month: "short" }).toUpperCase();

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 50, rotate: -5 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                {/* Featured Star */}
                {event.featured && (
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-3 -right-3 z-20 w-14 h-14 bg-gold border-4 border-black flex items-center justify-center"
                  >
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </motion.div>
                )}

                {/* Poster Card */}
                <motion.div
                  whileHover={{ y: -8, rotate: index % 2 === 0 ? 1 : -1 }}
                  transition={{ duration: 0.3 }}
                  className="relative bg-white border-4 border-black shadow-xl overflow-hidden"
                >
                  {/* Date Badge - Top Corner */}
                  <div className="absolute top-0 left-0 z-10 bg-black text-white p-3 border-r-4 border-b-4 border-primary">
                    <div className="text-center">
                      <div className="text-3xl font-black leading-none">{day}</div>
                      <div className="text-xs font-bold">{month}</div>
                    </div>
                  </div>

                  {/* Category Tag - Top Right */}
                  <div className={`absolute top-0 right-0 z-10 ${config.color} text-white px-4 py-2 border-l-4 border-b-4 border-black`}>
                    <span className="text-xs font-black tracking-wider">{config.label}</span>
                  </div>

                  {/* Image */}
                  {event.image && (
                    <div className="relative h-56 mt-16 border-t-4 border-b-4 border-black">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 space-y-3">
                    {/* Title */}
                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight leading-tight">
                      {event.title}
                    </h3>

                    {/* Time */}
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-base font-bold text-gray-700">{event.time}</span>
                    </div>

                    {/* Description */}
                    <p className="text-base text-gray-700 leading-relaxed">
                      {event.description}
                    </p>

                    {/* Bottom Stripe */}
                    <div className={`h-2 w-full ${config.color} mt-6`} />
                  </div>

                  {/* Diagonal Corner Accent */}
                  <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-b-[40px] border-b-primary" />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.a
            href="#contacto"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-primary text-white px-10 py-4 border-4 border-black font-black text-lg uppercase tracking-wider shadow-lg hover:bg-gold transition-colors duration-300"
          >
            Organiza tu evento
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
