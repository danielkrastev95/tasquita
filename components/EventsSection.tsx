"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

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

// ─── Shared tokens ───────────────────────────────────────────────────────────
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

const categoryMeta: Record<string, { label: string; accent: string }> = {
  musica: { label: "Música en vivo", accent: T.primary },
  gastronomia: { label: "Gastronomía", accent: T.gold },
  especial: { label: "Especial", accent: T.onSurface },
};

// ─── Format helpers ─────────────────────────────────────────────────────────
function formatDate(date: string) {
  const d = new Date(date);
  return {
    day: String(d.getDate()).padStart(2, "0"),
    month: String(d.getMonth() + 1).padStart(2, "0"),
    monthName: d.toLocaleDateString("es-ES", { month: "long" }),
    weekday: d.toLocaleDateString("es-ES", { weekday: "long" }),
    year: d.getFullYear(),
  };
}

// ─── Alternating event card ─────────────────────────────────────────────────
function EventCard({
  event,
  index,
  reversed,
}: {
  event: Event;
  index: number;
  reversed: boolean;
}) {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [25, -25]);
  const config = categoryMeta[event.category] || categoryMeta.especial;
  const { day, month } = formatDate(event.date);

  const imageBlock = (
    <div className="relative overflow-hidden" style={{ minHeight: "320px" }}>
      {event.image ? (
        <motion.div style={{ y: imgY }} className="absolute inset-0">
          <img
            src={event.image}
            alt={event.title}
            className="w-full object-cover"
            style={{ height: "130%", marginTop: "-15%" }}
          />
        </motion.div>
      ) : (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ backgroundColor: config.accent, minHeight: "320px" }}
        >
          <span
            className="font-black italic leading-none text-white/10 select-none"
            style={{ fontFamily: T.newsreader, fontSize: "14rem", letterSpacing: "-0.04em" }}
          >
            {day}
          </span>
        </div>
      )}
    </div>
  );

  const contentBlock = (
    <div
      className="flex flex-col justify-between p-8 md:p-12"
      style={{ backgroundColor: T.cream, minHeight: "320px" }}
    >
      <div>
        {/* Category + Date row */}
        <div className={`flex items-center gap-4 mb-6 ${reversed ? "md:justify-end" : ""}`}>
          <span
            className="text-[0.6rem] font-bold uppercase tracking-widest px-3 py-1.5 text-white"
            style={{ backgroundColor: config.accent, fontFamily: T.grotesk, letterSpacing: "0.15em" }}
          >
            {config.label}
          </span>
          <span
            className="font-black"
            style={{
              fontFamily: T.newsreader,
              fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
              color: T.primary,
              letterSpacing: "-0.02em",
            }}
          >
            {day}/{month}
          </span>
        </div>

        {/* Title */}
        <h3
          className={`font-black italic uppercase leading-[0.92] mb-4 ${reversed ? "md:text-right" : ""}`}
          style={{
            fontFamily: T.newsreader,
            fontSize: "clamp(2.2rem, 5vw, 4rem)",
            color: T.onSurface,
            letterSpacing: "-0.02em",
          }}
        >
          {event.title}
        </h3>

        {/* Description */}
        {event.description && (
          <p
            className={`text-sm leading-relaxed max-w-md mb-6 ${reversed ? "md:text-right md:ml-auto" : ""}`}
            style={{ fontFamily: T.grotesk, color: T.onSurfaceVariant }}
          >
            {event.description}
          </p>
        )}
      </div>

      {/* Bottom: time + CTA */}
      <div className={`flex items-center gap-6 ${reversed ? "md:justify-end" : ""}`}>
        <span
          className="text-sm font-bold uppercase tracking-wider"
          style={{ fontFamily: T.grotesk, color: T.onSurfaceVariant }}
        >
          {event.time} hrs
        </span>
        <motion.a
          href="/#contacto"
          whileHover={{ x: 4 }}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
          style={{ fontFamily: T.grotesk, color: T.primary, letterSpacing: "0.12em" }}
        >
          Reservar
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </motion.a>
      </div>
    </div>
  );

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      {/* Desktop: alternating grid, Mobile: image always on top */}
      <div
        className={`grid grid-cols-1 gap-px ${
          reversed
            ? "md:grid-cols-[55%_45%]"
            : "md:grid-cols-[45%_55%]"
        }`}
        style={{ backgroundColor: T.primary }}
      >
        {/* Mobile: always image first */}
        <div className="md:hidden">{imageBlock}</div>
        <div className="md:hidden">{contentBlock}</div>

        {/* Desktop: alternate order */}
        {reversed ? (
          <>
            <div className="hidden md:block">{contentBlock}</div>
            <div className="hidden md:block">{imageBlock}</div>
          </>
        ) : (
          <>
            <div className="hidden md:block">{imageBlock}</div>
            <div className="hidden md:block">{contentBlock}</div>
          </>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function EventsSection({ eventsData }: EventsSectionProps) {
  if (!eventsData.enabled || eventsData.events.length === 0) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <section id="eventos" className="relative" style={{ backgroundColor: T.cream }}>
      {/* ═══════════════════════════════════════════════════════════════════
          HEADER — compact editorial bar
         ═══════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="px-6 md:px-12 pt-12 md:pt-16 pb-4 flex items-baseline justify-between"
        style={{ borderBottom: `3px solid ${T.gold}` }}
      >
        <h1
          className="font-black italic uppercase tracking-tighter leading-none"
          style={{
            fontFamily: T.newsreader,
            fontSize: "clamp(1.8rem, 4.5vw, 4.5rem)",
            color: T.primary,
          }}
        >
          Eventos
        </h1>
        <span
          className="font-bold hidden sm:block"
          style={{
            fontFamily: T.grotesk,
            fontSize: "clamp(1rem, 1.8vw, 1.5rem)",
            color: T.gold,
          }}
        >
          {currentYear}
        </span>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════
          EVENT CARDS — alternating layout
         ═══════════════════════════════════════════════════════════════════ */}
      <div className="px-6 md:px-12 py-12 md:py-20 space-y-px" style={{ backgroundColor: T.cream }}>
        {eventsData.events.map((event, index) => (
          <EventCard
            key={event.id}
            event={event}
            index={index}
            reversed={index % 2 !== 0}
          />
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          CTA BOTTOM — "Organiza tu evento"
         ═══════════════════════════════════════════════════════════════════ */}
      <div className="px-6 md:px-12 pb-20 md:pb-32" style={{ backgroundColor: T.cream }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden"
          style={{ backgroundColor: T.cream, borderTop: `8px solid ${T.gold}` }}
        >
          <div className="py-12 md:py-20 flex flex-col md:flex-row md:items-end md:justify-between gap-10">
            {/* Left — Big italic title */}
            <div>
              <motion.h2
                className="font-black italic uppercase leading-[0.88]"
                style={{
                  fontFamily: T.newsreader,
                  fontSize: "clamp(3.5rem, 10vw, 9rem)",
                  color: T.primary,
                  letterSpacing: "-0.03em",
                }}
              >
                Organiza
                <br />
                Tu
                <br />
                Evento
              </motion.h2>

              <p
                className="mt-6 max-w-md leading-relaxed"
                style={{
                  fontFamily: T.grotesk,
                  fontSize: "0.9rem",
                  color: T.onSurfaceVariant,
                }}
              >
                Celebra tu momento especial en nuestro espacio. Menús
                personalizados, música en vivo y un ambiente diseñado para crear
                recuerdos.
              </p>
            </div>

            {/* Right — CTA button */}
            <motion.a
              href="/#contacto"
              whileHover={{ backgroundColor: T.secondary }}
              className="self-start md:self-end px-10 py-6 text-white font-bold uppercase tracking-widest transition-colors flex items-center gap-3"
              style={{
                backgroundColor: T.primary,
                fontFamily: T.grotesk,
                fontSize: "0.8rem",
                letterSpacing: "0.15em",
              }}
            >
              Contáctanos
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
