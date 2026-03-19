"use client";

import { motion } from "framer-motion";

interface ScheduleItem {
  day: string;
  hours: string;
}

interface SiteSettings {
  addressStreet: string;
  addressCity: string;
  addressPostalCode: string;
  instagramHandle: string;
  schedule: string;
}

interface ContactSectionProps {
  settings: SiteSettings | null;
}

export default function ContactSection({ settings }: ContactSectionProps) {
  const schedule: ScheduleItem[] = settings?.schedule
    ? JSON.parse(settings.schedule)
    : [
        { day: "Lunes", hours: "Cerrado" },
        { day: "Martes - Miércoles", hours: "9:00 - 15:45" },
        { day: "Jueves", hours: "9:00 - 15:45 y 20:00 - 23:00" },
        { day: "Viernes", hours: "9:00 - 15:45 y 20:00 - 23:20" },
        { day: "Sábado", hours: "10:00 - 15:45 y 20:00 - 23:20" },
        { day: "Domingo", hours: "10:00 - 15:45" },
      ];

  return (
    <section id="contacto" className="py-12 relative overflow-hidden bg-white">
      {/* Geometric Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gold/5" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 border-8 border-primary/20 rotate-45" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <motion.h2
            animate={{
              textShadow: [
                "6px 6px 0px rgba(199, 175, 101, 0.3)",
                "10px 10px 0px rgba(199, 175, 101, 0.3)",
                "6px 6px 0px rgba(199, 175, 101, 0.3)",
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-6xl sm:text-8xl font-black text-gray-900 uppercase tracking-tighter leading-none"
          >
            Visítanos
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left - Contact Info */}
          <div className="space-y-6">
            {/* Address Block */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-primary border-4 border-black p-6 shadow-lg relative"
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gold border-4 border-black flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
                Dirección
              </h3>
              <div className="text-lg text-white font-bold">
                <p>{settings?.addressStreet || "C. Lili Álvarez, 66"}</p>
                <p>{settings?.addressCity || "Valdemoro, Madrid"}</p>
                <p>CP {settings?.addressPostalCode || "28342"}</p>
              </div>
            </motion.div>

            {/* Schedule Table */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white border-4 border-black p-6 shadow-lg relative"
            >
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary border-4 border-black flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-6">
                Horario
              </h3>
              <div className="space-y-0">
                {schedule.map((item, index) => (
                  <div
                    key={item.day}
                    className={`flex justify-between items-center py-4 ${
                      index !== schedule.length - 1 ? "border-b-4 border-gray-200" : ""
                    }`}
                  >
                    <span className="font-black text-gray-900 uppercase text-sm tracking-tight">
                      {item.day}
                    </span>
                    <span className={`font-bold text-sm ${
                      item.hours === "Cerrado" ? "text-red-600" : "text-gray-700"
                    }`}>
                      {item.hours}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Social */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-gold border-4 border-black p-6 shadow-lg relative"
            >
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-white border-4 border-black flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
                Síguenos
              </h3>
              <a
                href={`https://instagram.com/${settings?.instagramHandle || "latasquitadesara"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-white hover:text-black transition-colors"
              >
                <span className="text-2xl font-black uppercase tracking-tight">
                  @{settings?.instagramHandle || "latasquitadesara"}
                </span>
              </a>
            </motion.div>
          </div>

          {/* Right - Map and Phone */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Map */}
            <div className="relative h-[400px] border-4 border-black shadow-xl overflow-hidden">
              {/* Map Label Overlay */}
              <div className="absolute top-0 left-0 right-0 z-10 bg-black text-white p-3 border-b-4 border-primary">
                <span className="text-base font-black uppercase tracking-wider">📍 Encuéntranos Aquí</span>
              </div>

              <iframe
                src="https://www.google.com/maps?q=40.201998253991874,-3.6892787099523385&hl=es&z=16&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa de La Tasquita de Sara en Valdemoro"
                className="mt-12"
              />
            </div>

            {/* Phone Call Box */}
            <motion.a
              href="tel:+34624434593"
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="block bg-black border-4 border-black p-6 shadow-xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-primary transform translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gold border-4 border-white flex items-center justify-center flex-shrink-0">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gold uppercase tracking-wider mb-1">Llámanos</p>
                    <p className="text-3xl font-black text-white uppercase tracking-tight">624 43 45 93</p>
                  </div>
                </div>

                <svg className="w-8 h-8 text-white group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
