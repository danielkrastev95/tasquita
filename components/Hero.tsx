"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";

interface FeaturedEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
}

interface HeroProps {
  featuredEvent: FeaturedEvent | null;
}

export default function Hero({ featuredEvent }: HeroProps) {
  const containerRef = useRef(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -60]);

  // Interactive Grid Effect — terracotta cells
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let mouse = { x: -9999, y: -9999 };
    const squareSize = 80;
    const grid: Array<{
      x: number;
      y: number;
      alpha: number;
      fading: boolean;
      lastTouched: number;
    }> = [];

    function initGrid() {
      grid.length = 0;
      for (let x = 0; x < width; x += squareSize) {
        for (let y = 0; y < height; y += squareSize) {
          grid.push({ x, y, alpha: 0, fading: false, lastTouched: 0 });
        }
      }
    }

    function getCellAt(x: number, y: number) {
      return grid.find(
        (cell) =>
          x >= cell.x &&
          x < cell.x + squareSize &&
          y >= cell.y &&
          y < cell.y + squareSize
      );
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initGrid();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      const cell = getCellAt(mouse.x, mouse.y);
      if (cell && cell.alpha === 0) {
        cell.alpha = 1;
        cell.lastTouched = Date.now();
        cell.fading = false;
      }
    };

    function drawGrid() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      const now = Date.now();
      for (let i = 0; i < grid.length; i++) {
        const cell = grid[i];
        if (cell.alpha > 0 && !cell.fading && now - cell.lastTouched > 500) {
          cell.fading = true;
        }
        if (cell.fading) {
          cell.alpha -= 0.02;
          if (cell.alpha <= 0) { cell.alpha = 0; cell.fading = false; }
        }
        if (cell.alpha > 0) {
          const cx = cell.x + squareSize / 2;
          const cy = cell.y + squareSize / 2;
          const g = ctx.createRadialGradient(cx, cy, 5, cx, cy, squareSize);
          g.addColorStop(0, `rgba(47,119,128,${cell.alpha * 0.3})`);
          g.addColorStop(1, `rgba(47,119,128,0)`);
          ctx.fillStyle = g;
          ctx.fillRect(cell.x, cell.y, squareSize, squareSize);
          ctx.strokeStyle = `rgba(47,119,128,${cell.alpha * 0.18})`;
          ctx.lineWidth = 1;
          ctx.strokeRect(cell.x + 0.5, cell.y + 0.5, squareSize - 1, squareSize - 1);
        }
      }
      requestAnimationFrame(drawGrid);
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    initGrid();
    drawGrid();
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "#fcf9f3", minHeight: "100vh" }}
    >
      {/* Mouse canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ display: "block" }}
        aria-hidden="true"
      />

      {/* Scrolling marquee background text — matches reference HTML */}
      <div
        className="absolute overflow-hidden pointer-events-none select-none"
        style={{
          top: "28%",
          left: 0,
          width: "100%",
          zIndex: 1,
          opacity: 0.055,
        }}
        aria-hidden="true"
      >
        {/* Text repeated so it loops seamlessly (translateX -50%) */}
        <span
          className="marquee-scroll font-bold uppercase leading-none"
          style={{
            fontFamily: "var(--font-newsreader)",
            fontSize: "clamp(6rem, 14vw, 16rem)",
            color: "#2f7780",
            letterSpacing: "-0.02em",
          }}
        >
          TRADICIÓN&nbsp;•&nbsp;SABOR&nbsp;•&nbsp;FUEGO&nbsp;•&nbsp;TRADICIÓN&nbsp;•&nbsp;SABOR&nbsp;•&nbsp;FUEGO&nbsp;•&nbsp;TRADICIÓN&nbsp;•&nbsp;SABOR&nbsp;•&nbsp;FUEGO&nbsp;•&nbsp;
        </span>
      </div>

      {/* Main two-column hero layout */}
      <div
        className="relative w-full grid grid-cols-1 md:grid-cols-[55%_45%]"
        style={{ minHeight: "100vh", zIndex: 2 }}
      >
        {/* ─── LEFT COLUMN ─── */}
        <div
          className="flex flex-col justify-center px-8 md:px-14 lg:px-20"
          style={{ paddingTop: "100px", paddingBottom: "48px" }}
        >
          {/* EST. badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-5 self-start"
          >
            <span
              className="text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5"
              style={{
                backgroundColor: "#2f7780",
                fontFamily: "var(--font-space-grotesk)",
                letterSpacing: "0.15em",
              }}
            >
              Est. Valdemoro · Tapas
            </span>
          </motion.div>

          {/* Display headline */}
          <motion.div
            style={{ y: y1 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <h1
              className="font-bold uppercase leading-[0.88]"
              style={{
                fontFamily: "var(--font-newsreader)",
                fontSize: "clamp(3.5rem, 7.5vw, 7rem)",
                color: "#2f7780",
                letterSpacing: "-0.02em",
              }}
            >
              LA
              <br />
              TASQUITA
              <br />
              DE SARA
            </h1>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="mt-6 mb-8 leading-relaxed max-w-[280px]"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontSize: "0.9rem",
              color: "#3a2a20",
              fontWeight: 400,
            }}
          >
            Un tributo visceral a la cocina de barrio.
            Donde el producto manda y el sabor no pide permiso.
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.55 }}
            className="flex flex-row gap-4 flex-wrap"
          >
            <motion.a
              href="#contacto"
              whileHover={{ backgroundColor: "#6b2000" }}
              className="px-7 py-4 text-white text-xs font-bold uppercase tracking-widest transition-colors"
              style={{
                backgroundColor: "#2f7780",
                fontFamily: "var(--font-space-grotesk)",
                letterSpacing: "0.14em",
              }}
            >
              Reservar mesa
            </motion.a>

            <motion.a
              href="#menu"
              whileHover={{ borderColor: "#2f7780", color: "#2f7780" }}
              className="px-7 py-4 text-xs font-bold uppercase tracking-widest transition-colors border-2"
              style={{
                color: "#3a2a20",
                borderColor: "#3a2a20",
                fontFamily: "var(--font-space-grotesk)",
                letterSpacing: "0.14em",
                backgroundColor: "transparent",
              }}
            >
              Ver menú
            </motion.a>
          </motion.div>

          {/* Delivery badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="flex gap-3 mt-8"
          >
            <motion.a
              href="https://glovoapp.com/es/es/valdemoro-ciempozuelos/stores/la-tasquita-de-sara-valdemoro"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              aria-label="Pedir en Glovo"
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider"
              style={{ backgroundColor: "#FFC244", color: "#000", fontFamily: "var(--font-space-grotesk)" }}
            >
              Glovo
            </motion.a>
            <motion.a
              href="https://www.ubereats.com/es/store/la-tasquita-de-sara/tWST6whgU2iUdY71PWw9jw"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              aria-label="Pedir en Uber Eats"
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider"
              style={{ backgroundColor: "#06C167", color: "#fff", fontFamily: "var(--font-space-grotesk)" }}
            >
              Uber Eats
            </motion.a>
          </motion.div>
        </div>

         {/* ─── RIGHT COLUMN ─── */}
        <div
          className="hidden md:flex flex-col justify-center items-start relative"
          style={{ paddingTop: "80px", paddingBottom: "80px", paddingRight: "0" }}
        >
          {/* Wrapper gives positioning context for the secondary image */}
          <div className="relative" style={{ width: "84%" }}>
            {/* Main large image frame */}
            <motion.div
              style={{
                y: y2,
                border: "6px solid #2f7780",
                position: "relative",
                height: "65vh",
                overflow: "hidden",
                width: "100%",
              }}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Main large image — fills the frame */}
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=85"
                alt="Plato estrella de La Tasquita de Sara"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "grayscale(100%) contrast(1.05)",
                }}
              />
            </motion.div>

            {/* Small secondary image — positioned outside the frame, overlapping bottom-left */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.7 }}
              style={{
                position: "absolute",
                bottom: "-48px",
                left: "-48px",
                width: "48%",
                zIndex: 10,
                border: "5px solid #2f7780",
              }}
            >
              <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                <img
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80"
                  alt="Interior La Tasquita de Sara"
                  className="w-full h-full object-cover"
                />
                {/* "Live Kitchen" label */}
                <div
                  className="absolute bottom-0 left-0 right-0 px-3 py-1.5"
                  style={{ backgroundColor: "#2f7780" }}
                >
                  <p
                    className="text-white text-xs font-bold uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "0.15em" }}
                  >
                    Cocina en vivo
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Featured event badge (top-right corner) */}
          {featuredEvent && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="absolute top-20 right-0"
              style={{ zIndex: 20 }}
            >
              <a href="#eventos" className="block">
                <div
                  className="px-4 py-3 text-white"
                  style={{
                    backgroundColor: "#2f7780",
                    maxWidth: "160px",
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <motion.div
                      animate={{ scale: [1, 1.25, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-1.5 h-1.5"
                      style={{ backgroundColor: "#C7AF65" }}
                    />
                    <span
                      className="text-xs font-bold uppercase tracking-widest"
                      style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "0.6rem" }}
                    >
                      Evento
                    </span>
                  </div>
                  <h3
                    className="font-bold text-sm leading-tight"
                    style={{ fontFamily: "var(--font-newsreader)" }}
                  >
                    {featuredEvent.title}
                  </h3>
                  <p
                    className="text-xs opacity-75 mt-1"
                    style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "0.65rem" }}
                  >
                    {new Date(featuredEvent.date).toLocaleDateString("es-ES")} · {featuredEvent.time}
                  </p>
                </div>
              </a>
            </motion.div>
          )}
        </div>
      </div>


      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="hidden md:flex absolute bottom-28 left-14 z-20 items-center gap-2"
      >
        <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <svg className="w-4 h-4" fill="none" stroke="#2f7780" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
        <span
          className="text-xs uppercase tracking-widest"
          style={{ color: "#2f7780", fontFamily: "var(--font-space-grotesk)" }}
        >
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
