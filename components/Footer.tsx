"use client";

import { motion } from "framer-motion";
import { Instagram, Phone, MapPin } from "lucide-react";

interface SiteSettings {
  addressStreet: string;
  addressCity: string;
  addressPostalCode: string;
  instagramHandle: string;
}

interface FooterProps {
  settings: SiteSettings | null;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="py-12 border-b border-gray-800/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-center">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-montserrat font-bold text-white mb-1">
                La Tasquita de Sara
              </h3>
              <p className="text-gray-500 text-sm">
                Valdemoro, Madrid
              </p>
            </motion.div>

            {/* Phone */}
            <motion.a
              href="tel:+34624434593"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Phone className="w-5 h-5" strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Llámanos</p>
                <p className="text-sm font-semibold">624 43 45 93</p>
              </div>
            </motion.a>

            {/* Instagram */}
            <motion.a
              href={`https://instagram.com/${settings?.instagramHandle || "latasquitadesara"}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Instagram className="w-5 h-5" strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Síguenos</p>
                <p className="text-sm font-semibold">@{settings?.instagramHandle || "latasquitadesara"}</p>
              </div>
            </motion.a>

            {/* Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 text-gray-400"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <MapPin className="w-5 h-5" strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Visítanos</p>
                <p className="text-sm font-semibold">
                  {settings?.addressStreet || "C. Lili Álvarez, 66"}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500"
        >
          <p>© {currentYear} La Tasquita de Sara. Todos los derechos reservados.</p>

          <div className="flex items-center gap-6">
            <a href="#menu" className="hover:text-primary transition-colors">
              Menú
            </a>
            <a href="#nosotros" className="hover:text-primary transition-colors">
              Nosotros
            </a>
            <a href="#contacto" className="hover:text-primary transition-colors">
              Contacto
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
