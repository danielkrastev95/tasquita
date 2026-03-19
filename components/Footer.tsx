"use client";

import { motion } from "framer-motion";

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
    <footer className="bg-gray-900 text-white border-t-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content - Simple Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo */}
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-1">
              La Tasquita
            </h3>
            <p className="text-gold text-sm font-bold uppercase">de Sara</p>
          </div>

          {/* Phone */}
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase mb-2">Teléfono</p>
            <a
              href="tel:+34624434593"
              className="text-lg font-black text-white hover:text-primary transition-colors"
            >
              624 43 45 93
            </a>
          </div>

          {/* Instagram */}
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase mb-2">Instagram</p>
            <a
              href={`https://instagram.com/${settings?.instagramHandle || "latasquitadesara"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-black text-white hover:text-primary transition-colors"
            >
              @{settings?.instagramHandle || "latasquitadesara"}
            </a>
          </div>

          {/* Address */}
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase mb-2">Dirección</p>
            <p className="text-sm font-bold text-white">
              {settings?.addressStreet || "C. Lili Álvarez, 66"}
            </p>
            <p className="text-sm text-gray-400">
              {settings?.addressCity || "Valdemoro, Madrid"}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t-2 border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-gray-500">
            © {currentYear} La Tasquita de Sara
          </p>

          <div className="flex items-center gap-6">
            <a
              href="#menu"
              className="font-bold text-gray-500 hover:text-primary transition-colors uppercase"
            >
              Menú
            </a>
            <a
              href="#nosotros"
              className="font-bold text-gray-500 hover:text-primary transition-colors uppercase"
            >
              Nosotros
            </a>
            <a
              href="#contacto"
              className="font-bold text-gray-500 hover:text-primary transition-colors uppercase"
            >
              Contacto
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
