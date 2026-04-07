"use client";

import { motion } from "framer-motion";

// ─── Shared design tokens (same as AboutSection) ────────────────────────────
const T = {
  cream: "#fcf9f3",
  primary: "#2f7780",
  secondary: "#1f5f67",
  gold: "#C7AF65",
  onSurface: "#1c1c18",
  onSurfaceVariant: "#58413b",
  newsreader: "var(--font-newsreader)",
  grotesk: "var(--font-space-grotesk)",
};

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
    <section id="contacto" style={{ backgroundColor: T.cream }}>

      {/* ═══════════════════════════════════════════════════════════════════
          HEADER — Dark restaurant image with massive italic title overlay
         ═══════════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden" style={{ height: "clamp(320px, 52vw, 540px)" }}>
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=85"
          alt="Ambiente de La Tasquita de Sara"
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.28)" }}
        />

        {/* Gradient para legibilidad inferior */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* Contenido sobre la imagen */}
        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-12 pb-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-3"
          >
            <span
              className="font-bold uppercase"
              style={{
                fontFamily: T.grotesk,
                fontSize: "0.6rem",
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.18em",
              }}
            >
              Encuéntranos
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-black italic uppercase leading-[0.88]"
            style={{
              fontFamily: T.newsreader,
              fontSize: "clamp(4.5rem, 13vw, 11rem)",
              color: "#ffffff",
              letterSpacing: "-0.03em",
            }}
          >
            Visítanos
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45 }}
            className="mt-6 flex items-center gap-4"
          >
            <div className="w-8 h-px" style={{ backgroundColor: T.gold }} />
            <span
              className="font-bold uppercase"
              style={{
                fontFamily: T.grotesk,
                fontSize: "0.7rem",
                color: "rgba(255,255,255,0.45)",
                letterSpacing: "0.14em",
              }}
            >
              {settings?.addressCity || "Valdemoro, Madrid"}
            </span>
          </motion.div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          MAIN GRID — Info left / Map right
         ═══════════════════════════════════════════════════════════════════ */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-px"
        style={{ backgroundColor: T.primary }}
      >
        {/* Left column: Address + Schedule (stacked with gap-px) */}
        <div className="flex flex-col gap-px" style={{ backgroundColor: T.primary }}>

          {/* Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-8 md:p-10"
            style={{ backgroundColor: T.cream }}
          >
            <span
              className="font-bold block mb-5 uppercase"
              style={{
                fontFamily: T.grotesk,
                fontSize: "0.7rem",
                color: T.primary,
                letterSpacing: "0.12em",
              }}
            >
              01
            </span>
            <div className="w-full h-px mb-6" style={{ backgroundColor: `${T.primary}25` }} />

            <h3
              className="font-black italic uppercase leading-tight mb-5"
              style={{
                fontFamily: T.newsreader,
                fontSize: "clamp(1.5rem, 2.8vw, 2.1rem)",
                color: T.onSurface,
              }}
            >
              Dirección
            </h3>

            <p
              className="leading-loose"
              style={{ fontFamily: T.grotesk, color: T.onSurfaceVariant, fontSize: "0.95rem" }}
            >
              {settings?.addressStreet || "C. Lili Álvarez, 66"}
              <br />
              {settings?.addressCity || "Valdemoro, Madrid"}
              <br />
              <span style={{ color: T.primary, fontWeight: 700 }}>
                CP {settings?.addressPostalCode || "28342"}
              </span>
            </p>
          </motion.div>

          {/* Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-8 md:p-10 flex-1"
            style={{ backgroundColor: T.cream }}
          >
            <span
              className="font-bold block mb-5 uppercase"
              style={{
                fontFamily: T.grotesk,
                fontSize: "0.7rem",
                color: T.primary,
                letterSpacing: "0.12em",
              }}
            >
              02
            </span>
            <div className="w-full h-px mb-6" style={{ backgroundColor: `${T.primary}25` }} />

            <h3
              className="font-black italic uppercase leading-tight mb-7"
              style={{
                fontFamily: T.newsreader,
                fontSize: "clamp(1.5rem, 2.8vw, 2.1rem)",
                color: T.onSurface,
              }}
            >
              Horario
            </h3>

            <div>
              {schedule.map((item, index) => (
                <div
                  key={item.day}
                  className={`flex justify-between items-center py-3 ${
                    index !== schedule.length - 1 ? "border-b" : ""
                  }`}
                  style={{ borderColor: `${T.primary}18` }}
                >
                  <span
                    className="font-bold text-sm uppercase"
                    style={{
                      fontFamily: T.grotesk,
                      color: T.onSurface,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {item.day}
                  </span>
                  <span
                    className="text-sm"
                    style={{
                      fontFamily: T.grotesk,
                      fontWeight: 500,
                      color: item.hours === "Cerrado" ? "#b83232" : T.onSurfaceVariant,
                    }}
                  >
                    {item.hours}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right column: Map */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden flex flex-col"
          style={{ minHeight: "520px", backgroundColor: T.cream }}
        >
          {/* Label bar */}
          <div
            className="px-8 py-4 flex items-center gap-3 flex-shrink-0"
            style={{ backgroundColor: T.primary }}
          >
            <svg
              className="w-4 h-4 text-white/70 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span
              className="font-black italic uppercase text-white"
              style={{ fontFamily: T.newsreader, fontSize: "1.05rem" }}
            >
              Encuéntranos aquí
            </span>
          </div>

          {/* Map iframe fills remaining space */}
          <div className="flex-1" style={{ minHeight: "460px" }}>
            <iframe
              src="https://www.google.com/maps?q=40.201998253991874,-3.6892787099523385&hl=es&z=16&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, display: "block", minHeight: "460px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de La Tasquita de Sara en Valdemoro"
            />
          </div>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BOTTOM ROW — Phone (dark) + Instagram (light)
         ═══════════════════════════════════════════════════════════════════ */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-px"
        style={{ backgroundColor: T.primary }}
      >
        {/* Phone — dark panel */}
        <motion.a
          href="tel:+34624434593"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between p-8 md:p-10 group transition-colors duration-300"
          style={{ backgroundColor: T.primary }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = T.secondary;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = T.primary;
          }}
        >
          <div>
            <span
              className="font-bold block mb-2 uppercase"
              style={{
                fontFamily: T.grotesk,
                fontSize: "0.65rem",
                color: "rgba(255,255,255,0.45)",
                letterSpacing: "0.18em",
              }}
            >
              Llámanos
            </span>
            <span
              className="font-black italic uppercase text-white"
              style={{
                fontFamily: T.newsreader,
                fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
                letterSpacing: "-0.025em",
              }}
            >
              624 43 45 93
            </span>
          </div>
          <svg
            className="w-6 h-6 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.a>

        {/* Instagram — cream panel */}
        <motion.a
          href={`https://instagram.com/${settings?.instagramHandle || "latasquitadesara"}`}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center justify-between p-8 md:p-10 group"
          style={{ backgroundColor: T.cream }}
        >
          <div>
            <span
              className="font-bold block mb-2 uppercase"
              style={{
                fontFamily: T.grotesk,
                fontSize: "0.65rem",
                color: T.primary,
                letterSpacing: "0.18em",
              }}
            >
              Síguenos
            </span>
            <span
              className="font-black italic uppercase"
              style={{
                fontFamily: T.newsreader,
                fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                color: T.onSurface,
                letterSpacing: "-0.025em",
              }}
            >
              @{settings?.instagramHandle || "latasquitadesara"}
            </span>
          </div>
          <svg
            className="w-6 h-6 flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
            fill="currentColor"
            viewBox="0 0 24 24"
            style={{ color: T.gold }}
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </motion.a>
      </div>
    </section>
  );
}
