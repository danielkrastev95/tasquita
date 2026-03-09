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
    offset: ["start start", "end start"]
  });

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 10]);

  // Interactive Grid Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

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
          grid.push({
            x,
            y,
            alpha: 0,
            fading: false,
            lastTouched: 0,
          });
        }
      }
    }

    function getCellAt(x: number, y: number) {
      return grid.find(cell =>
        x >= cell.x && x < cell.x + squareSize &&
        y >= cell.y && y < cell.y + squareSize
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
      ctx.clearRect(0, 0, width, height);
      const now = Date.now();

      for (let i = 0; i < grid.length; i++) {
        const cell = grid[i];

        // Start fading after 500ms
        if (cell.alpha > 0 && !cell.fading && now - cell.lastTouched > 500) {
          cell.fading = true;
        }

        if (cell.fading) {
          cell.alpha -= 0.02;
          if (cell.alpha <= 0) {
            cell.alpha = 0;
            cell.fading = false;
          }
        }

        if (cell.alpha > 0) {
          const centerX = cell.x + squareSize / 2;
          const centerY = cell.y + squareSize / 2;

          // Verde primary: #53A699 = rgb(83, 166, 153)
          const gradient = ctx.createRadialGradient(
            centerX, centerY, 5,
            centerX, centerY, squareSize
          );
          gradient.addColorStop(0, `rgba(83, 166, 153, ${cell.alpha})`);
          gradient.addColorStop(1, `rgba(83, 166, 153, 0)`);

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
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
      className="relative h-screen w-full overflow-hidden bg-white"
    >
      {/* Interactive Canvas Grid */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: "block" }}
        aria-hidden="true"
      />

      {/* Featured Event - Floating Badge */}
      {featuredEvent && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="absolute top-32 left-8 z-30"
        >
          <motion.a
            href="#eventos"
            whileHover={{ scale: 1.05, rotate: -2 }}
            className="block"
          >
            <div className="bg-primary text-white px-6 py-4 border-4 border-black shadow-2xl max-w-xs">
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 bg-gold rounded-full"
                />
                <span className="text-xs font-bold uppercase tracking-wider">Evento</span>
              </div>
              <h3 className="font-bold text-lg mb-1">{featuredEvent.title}</h3>
              <p className="text-sm opacity-90">
                {new Date(featuredEvent.date).toLocaleDateString("es-ES")} • {featuredEvent.time}
              </p>
            </div>
          </motion.a>
        </motion.div>
      )}

      {/* Main Content - Kinetic Typography */}
      <div className="relative h-full flex items-center justify-center px-4 z-10">
        <div className="max-w-7xl w-full">

          {/* LA TASQUITA - Animated */}
          <div className="mb-4 overflow-hidden">
            <motion.div
              style={{ y: y1 }}
              className="relative"
            >
              <motion.h1
                animate={{
                  x: [0, 10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-[16vw] sm:text-[10vw] font-black leading-none text-gray-900 uppercase tracking-tighter"
                style={{
                  textShadow: "8px 8px 0px rgba(83, 166, 153, 0.3)",
                  WebkitTextStroke: "2px rgba(83, 166, 153, 0.1)"
                }}
              >
                LA TASQUITA
              </motion.h1>
            </motion.div>
          </div>

          {/* DE SARA - Counter animated */}
          <div className="mb-8 overflow-hidden flex justify-end">
            <motion.div
              style={{ y: y2, rotate }}
              className="relative"
            >
              <motion.h2
                animate={{
                  x: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                className="text-[13vw] sm:text-[8vw] font-black leading-none text-gray-900 uppercase tracking-tighter"
                style={{
                  textShadow: "-8px 8px 0px rgba(199, 175, 101, 0.3)",
                  WebkitTextStroke: "2px rgba(199, 175, 101, 0.1)"
                }}
              >
                DE SARA
              </motion.h2>
            </motion.div>
          </div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="relative mb-12"
          >
            <motion.p
              animate={{
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-base sm:text-3xl font-bold text-gray-700 uppercase tracking-wider text-center px-2"
            >
              Bar de tapas · Hamburguesas · Cocina de mercado
            </motion.p>
          </motion.div>

          {/* CTA Buttons - Bold */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.a
              href="#menu"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group px-12 py-5 bg-primary text-white text-xl font-black uppercase tracking-wider overflow-hidden border-4 border-black shadow-lg"
            >
              <motion.div
                className="absolute inset-0 bg-black"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10 group-hover:text-white transition-colors">
                Ver Menú
              </span>
            </motion.a>

            <motion.a
              href="#contacto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group px-12 py-5 border-4 border-black bg-white text-black text-xl font-black uppercase tracking-wider overflow-hidden shadow-lg"
            >
              <motion.div
                className="absolute inset-0 bg-gold"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10 group-hover:text-white transition-colors">
                Contacto
              </span>
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Delivery Apps - Minimal Badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 left-0 right-0 z-20"
      >
        <div className="flex justify-center gap-6">
          <motion.a
            href="https://glovoapp.com/es/es/valdemoro-ciempozuelos/stores/la-tasquita-de-sara-valdemoro"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -5, scale: 1.05 }}
            aria-label="Pedir a domicilio en Glovo"
            className="bg-[#FFC244] text-black font-black px-8 py-3 text-lg uppercase tracking-wider border-4 border-black shadow-lg"
          >
            Glovo
          </motion.a>

          <motion.a
            href="https://www.ubereats.com/es/store/la-tasquita-de-sara/tWST6whgU2iUdY71PWw9jw"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -5, scale: 1.05 }}
            aria-label="Pedir a domicilio en Uber Eats"
            className="bg-[#06C167] text-white font-black px-8 py-3 text-lg uppercase tracking-wider border-4 border-black shadow-lg"
          >
            Uber Eats
          </motion.a>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Floating Geometric Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 right-12 w-24 h-24 border-8 border-primary/20 rounded-full z-0"
      />

      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-1/4 left-12 w-32 h-32 border-8 border-gold/20 z-0"
      />
    </section>
  );
}
