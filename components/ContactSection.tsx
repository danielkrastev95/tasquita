"use client";

import { motion } from "framer-motion";

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
  const schedule = settings?.schedule
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
    <section id="contacto" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-playfair font-bold text-gray-900 mb-4">
            Visítanos
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Address */}
            <div>
              <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-4">
                Dirección
              </h3>
              <p className="text-gray-700 text-lg">
                {settings?.addressStreet || "C. Lili Álvarez, 66"}<br />
                {settings?.addressCity || "Valdemoro, Madrid"}<br />
                CP {settings?.addressPostalCode || "28342"}
              </p>
            </div>

            {/* Hours */}
            <div>
              <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-4">
                Horario
              </h3>
              <div className="space-y-2">
                {schedule.map((item) => (
                  <div
                    key={item.day}
                    className="flex justify-between py-2 border-b border-gray-200"
                  >
                    <span className="font-medium text-gray-700">{item.day}</span>
                    <span className={item.hours === "Cerrado" ? "text-red-600" : "text-gray-600"}>
                      {item.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social */}
            <div>
              <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-4">
                Síguenos
              </h3>
              <a
                href={`https://instagram.com/${settings?.instagramHandle || "latasquitadesara"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:text-primary/80 transition-colors text-lg font-medium"
              >
                <svg
                  className="w-6 h-6 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                @{settings?.instagramHandle || "latasquitadesara"}
              </a>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="h-[500px] rounded-lg overflow-hidden shadow-lg"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3050.4!2d-3.674!3d40.189!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDExJzIwLjQiTiAzwrA0MCcyNi40Ilc!5e0!3m2!1ses!2ses!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de La Tasquita de Sara en Valdemoro"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
