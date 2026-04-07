"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface SiteSettings {
  aboutTitle: string;
  aboutSubtitle: string;
  aboutParagraph1: string;
  aboutParagraph2: string;
  aboutQuote: string;
  aboutQuoteAuthor: string;
  value1Title: string;
  value1Description: string;
  value2Title: string;
  value2Description: string;
  value3Title: string;
  value3Description: string;
  aboutImage1?: string | null;
  aboutImage2?: string | null;
  aboutImage3?: string | null;
}

interface AboutSectionProps {
  settings: SiteSettings | null;
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

export default function AboutSection({ settings }: AboutSectionProps) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  const values = [
    {
      num: "01",
      title: settings?.value1Title || "Producto de Calidad",
      description:
        settings?.value1Description ||
        "Seleccionamos los mejores ingredientes de proveedores locales y de temporada",
    },
    {
      num: "02",
      title: settings?.value2Title || "Trae a tu Peludito",
      description:
        settings?.value2Description ||
        "Espacio pet-friendly donde tu mascota es bienvenida a disfrutar contigo",
    },
    {
      num: "03",
      title: settings?.value3Title || "Ambiente Familiar",
      description:
        settings?.value3Description ||
        "Un espacio acogedor donde todos son bienvenidos, como en casa",
    },
  ];

  return (
    <section id="nosotros" style={{ backgroundColor: T.cream }}>
      {/* ═══════════════════════════════════════════════════════════════════
          HERO — Dark restaurant image with massive italic text overlay
         ═══════════════════════════════════════════════════════════════════ */}
      <div ref={heroRef} className="relative overflow-hidden" style={{ minHeight: "85vh" }}>
        {/* Background image with parallax */}
        <motion.div style={{ y: imgY }} className="absolute inset-0">
          <img
            src={settings?.aboutImage1 || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&q=85"}
            alt="Interior del restaurante"
            className="w-full object-cover"
            style={{ height: "120%", marginTop: "-10%", filter: "brightness(0.35)" }}
          />
        </motion.div>

        {/* Content overlay */}
        <div className="relative px-6 md:px-12 pt-20 pb-12 flex flex-col justify-end" style={{ minHeight: "85vh" }}>
          {/* Massive italic title */}
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-black italic uppercase leading-[0.88] mb-8"
            style={{
              fontFamily: T.newsreader,
              fontSize: "clamp(3.5rem, 11vw, 10rem)",
              color: "#ffffff",
              letterSpacing: "-0.03em",
            }}
          >
            Cocina
            <br />
            de barrio
            <br />
            <span className="inline-flex items-baseline gap-4">
              <span style={{ color: T.gold }}>·</span> Desde 2025
            </span>
          </motion.h2>

          {/* Descriptive paragraph over image */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="max-w-lg leading-relaxed"
            style={{
              fontFamily: T.grotesk,
              fontSize: "0.9rem",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            {settings?.aboutParagraph1 ||
              "Somos un bar de barrio que cocina en serio. Nacimos en 2025 con una idea clara: ser el bar de barrio donde la buena comida es parte del día a día. Un sitio donde la cocina tradicional se encuentra con toques modernos, donde cada plato cuenta una historia y donde nuestros clientes se sienten como en casa."}
          </motion.p>

          {/* Bottom labels */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex gap-8 mt-8"
          >
            <span
              className="text-[0.6rem] font-bold uppercase tracking-widest"
              style={{ fontFamily: T.grotesk, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em" }}
            >
              Valdemoro · Madrid
            </span>
          </motion.div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          QUOTE + TEXT — Two-column editorial row
         ═══════════════════════════════════════════════════════════════════ */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-px"
        style={{ backgroundColor: T.primary }}
      >
        {/* Left — Quote */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 md:p-12 lg:p-16 flex flex-col justify-center"
          style={{ backgroundColor: T.cream }}
        >
          <p
            className="font-black italic leading-[1.1] mb-6"
            style={{
              fontFamily: T.newsreader,
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              color: T.primary,
            }}
          >
            &ldquo;{settings?.aboutQuote ||
              "La cocina es amor hecho visible, y aquí cocinamos con el corazón"}&rdquo;
          </p>

          <div className="flex items-center gap-3">
            <div className="w-12 h-1" style={{ backgroundColor: T.gold }} />
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ fontFamily: T.grotesk, color: T.onSurfaceVariant, letterSpacing: "0.12em" }}
            >
              {settings?.aboutQuoteAuthor || "El equipo de La Tasquita"}
            </span>
          </div>
        </motion.div>

        {/* Right — Second paragraph + image peek */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="p-8 md:p-12 lg:p-16 flex flex-col justify-center"
          style={{ backgroundColor: T.cream }}
        >
          <p
            className="leading-relaxed mb-6"
            style={{
              fontFamily: T.grotesk,
              fontSize: "0.95rem",
              color: T.onSurfaceVariant,
            }}
          >
            {settings?.aboutParagraph2 ||
              "Trabajamos con productos de temporada y de la mejor calidad. Nuestra carta combina recetas de toda la vida con creaciones propias más atrevidas, siempre con ese sabor auténtico que nos caracteriza. Porque aquí lo importante es disfrutar de la buena comida en buena compañía."}
          </p>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          CHEF IMAGE — Full-width horizontal image
         ═══════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden"
        style={{ height: "clamp(250px, 40vw, 450px)" }}
      >
        <img
          src={settings?.aboutImage2 || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&q=85"}
          alt="Chef preparando un plato"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════
          VALUES — "Nuestros Valores" with numbered columns
         ═══════════════════════════════════════════════════════════════════ */}
      <div className="px-6 md:px-12 py-16 md:py-24" style={{ backgroundColor: T.cream }}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-12 md:mb-20">
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-black italic uppercase leading-[0.92] tracking-tighter"
            style={{
              fontFamily: T.newsreader,
              fontSize: "clamp(3rem, 8vw, 7rem)",
              color: T.onSurface,
              letterSpacing: "-0.02em",
            }}
          >
            Nuestros
            <br />
            Valores
          </motion.h3>

          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-[0.6rem] font-bold uppercase tracking-widest mt-4 md:mt-0"
            style={{ fontFamily: T.grotesk, color: T.primary, letterSpacing: "0.15em" }}
          >
            Manifiesto
            <br className="hidden md:block" />
            {" "}Futuro
          </motion.span>
        </div>

        {/* Three numbered columns */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-px"
          style={{ backgroundColor: T.primary }}
        >
          {values.map((value, index) => (
            <motion.div
              key={value.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12, duration: 0.5 }}
              className="p-8 md:p-10"
              style={{ backgroundColor: T.cream }}
            >
              {/* Number */}
              <span
                className="font-bold block mb-6"
                style={{
                  fontFamily: T.grotesk,
                  fontSize: "0.75rem",
                  color: T.gold,
                  letterSpacing: "0.1em",
                }}
              >
                {value.num}
              </span>

              {/* Divider */}
              <div className="w-full h-px mb-6" style={{ backgroundColor: `${T.gold}40` }} />

              {/* Title */}
              <h4
                className="font-black uppercase leading-tight mb-4"
                style={{
                  fontFamily: T.newsreader,
                  fontSize: "clamp(1.2rem, 2vw, 1.5rem)",
                  color: T.onSurface,
                }}
              >
                {value.title}
              </h4>

              {/* Description */}
              <p
                className="text-sm leading-relaxed"
                style={{ fontFamily: T.grotesk, color: T.onSurfaceVariant }}
              >
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          RESTAURANT EXTERIOR — Full-width bottom image
         ═══════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden"
        style={{ height: "clamp(250px, 35vw, 400px)" }}
      >
        <img
          src={settings?.aboutImage3 || "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=1400&q=85"}
          alt="Exterior de La Tasquita de Sara"
          className="w-full h-full object-cover"
        />
        {/* Name overlay bar */}
        <div
          className="absolute bottom-0 left-0 right-0 px-6 md:px-12 py-4"
          style={{ backgroundColor: T.primary }}
        >
          <span
            className="font-black italic uppercase text-white tracking-tighter"
            style={{ fontFamily: T.newsreader, fontSize: "clamp(1rem, 2vw, 1.5rem)" }}
          >
            La Tasquita de Sara
          </span>
          <span
            className="text-white/50 text-xs ml-4"
            style={{ fontFamily: T.grotesk }}
          >
            Valdemoro · Madrid · Est. 2025
          </span>
        </div>
      </motion.div>
    </section>
  );
}
