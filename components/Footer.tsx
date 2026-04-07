"use client";

import { motion } from "framer-motion";

const T = {
  cream: "#fcf9f3",
  primary: "#2f7780",
  secondary: "#1f5f67",
  gold: "#C7AF65",
  onSurface: "#1c1c18",
  newsreader: "var(--font-newsreader)",
  grotesk: "var(--font-space-grotesk)",
};

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
    <footer style={{ backgroundColor: T.onSurface }}>

      {/* Gold top rule */}
      <div style={{ height: "3px", backgroundColor: T.gold }} />

      {/* ── Main grid ── */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-px"
        style={{ backgroundColor: T.gold }}
      >
        {/* Left — Brand block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="px-8 md:px-12 py-14 md:py-20 flex flex-col justify-between"
          style={{ backgroundColor: T.onSurface }}
        >
          <div>
            <span
              className="font-bold uppercase block mb-6"
              style={{
                fontFamily: T.grotesk,
                fontSize: "0.6rem",
                color: T.gold,
                letterSpacing: "0.2em",
              }}
            >
              Est. 2025 · Valdemoro, Madrid
            </span>

            <h2
              className="font-black italic uppercase leading-[0.88]"
              style={{
                fontFamily: T.newsreader,
                fontSize: "clamp(3.5rem, 9vw, 7rem)",
                color: "#ffffff",
                letterSpacing: "-0.03em",
              }}
            >
              La
              <br />
              Tasquita
              <br />
              <span style={{ color: T.gold }}>de Sara</span>
            </h2>
          </div>

          <p
            className="mt-10 leading-relaxed max-w-xs"
            style={{
              fontFamily: T.grotesk,
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            Un tributo visceral a la cocina de barrio.
            Donde el producto manda y el sabor no pide permiso.
          </p>
        </motion.div>

        {/* Right — Info grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="px-8 md:px-12 py-14 md:py-20 grid grid-cols-2 gap-10 content-start"
          style={{ backgroundColor: T.onSurface }}
        >
          {/* Phone */}
          <div>
            <p
              className="font-bold uppercase mb-3"
              style={{
                fontFamily: T.grotesk,
                fontSize: "0.6rem",
                color: T.gold,
                letterSpacing: "0.18em",
              }}
            >
              Teléfono
            </p>
            <a
              href="tel:+34624434593"
              className="font-black italic transition-colors"
              style={{
                fontFamily: T.newsreader,
                fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                color: "#ffffff",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = T.gold; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff"; }}
            >
              624 43 45 93
            </a>
          </div>

          {/* Instagram */}
          <div>
            <p
              className="font-bold uppercase mb-3"
              style={{
                fontFamily: T.grotesk,
                fontSize: "0.6rem",
                color: T.gold,
                letterSpacing: "0.18em",
              }}
            >
              Instagram
            </p>
            <a
              href={`https://instagram.com/${settings?.instagramHandle || "latasquitadesara"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-black italic transition-colors"
              style={{
                fontFamily: T.newsreader,
                fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                color: "#ffffff",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = T.gold; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff"; }}
            >
              @{settings?.instagramHandle || "latasquitadesara"}
            </a>
          </div>

          {/* Address */}
          <div>
            <p
              className="font-bold uppercase mb-3"
              style={{
                fontFamily: T.grotesk,
                fontSize: "0.6rem",
                color: T.gold,
                letterSpacing: "0.18em",
              }}
            >
              Dirección
            </p>
            <p
              className="leading-relaxed"
              style={{
                fontFamily: T.grotesk,
                fontSize: "0.85rem",
                color: "rgba(255,255,255,0.55)",
              }}
            >
              {settings?.addressStreet || "C. Lili Álvarez, 66"}
              <br />
              {settings?.addressCity || "Valdemoro, Madrid"}
            </p>
          </div>

          {/* Nav */}
          <div>
            <p
              className="font-bold uppercase mb-3"
              style={{
                fontFamily: T.grotesk,
                fontSize: "0.6rem",
                color: T.gold,
                letterSpacing: "0.18em",
              }}
            >
              Páginas
            </p>
            <nav className="flex flex-col gap-2">
              {[
                { label: "Carta", href: "/carta" },
                { label: "Nosotros", href: "/#nosotros" },
                { label: "Eventos", href: "/#eventos" },
                { label: "Contacto", href: "/#contacto" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-bold uppercase transition-colors w-fit"
                  style={{
                    fontFamily: T.grotesk,
                    fontSize: "0.75rem",
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.08em",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = T.gold; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.4)"; }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </motion.div>
      </div>

      {/* ── Bottom bar ── */}
      <div
        className="px-8 md:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <p
          style={{
            fontFamily: T.grotesk,
            fontSize: "0.7rem",
            color: "rgba(255,255,255,0.25)",
          }}
        >
          © {currentYear} La Tasquita de Sara
        </p>

        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5"
            style={{ backgroundColor: T.gold, opacity: 0.6 }}
          />
          <p
            style={{
              fontFamily: T.grotesk,
              fontSize: "0.7rem",
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "0.1em",
            }}
          >
            Valdemoro · Madrid · Est. 2025
          </p>
        </div>
      </div>
    </footer>
  );
}
