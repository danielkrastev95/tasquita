"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface MenuItem {
  name: string;
  description?: string;
  price?: string;
  image?: string;
  popular?: boolean;
  homemade?: boolean;
  award?: string;
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

interface MenuSectionProps {
  menuData: MenuCategory[];
}

// ─── Shared tokens ───────────────────────────────────────────────────────────
const T = {
  cream: "#fcf9f3",
  creamLow: "#f6f3ed",
  creamMid: "#f0eee8",
  creamHigh: "#ebe8e2",
  creamHighest: "#e5e2dc",
  primary: "#2f7780",
  secondary: "#1f5f67",
  onSurface: "#1c1c18",
  onSurfaceVariant: "#58413b",
  newsreader: "var(--font-newsreader)",
  grotesk: "var(--font-space-grotesk)",
};

// ─── Category header (matches reference: 8px top border + huge type) ─────────
function CategoryHeader({
  name,
  index,
  total,
}: {
  name: string;
  index: number;
  total: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex justify-between items-baseline pt-4 mb-12 mt-24 md:mt-32"
      style={{ borderTop: `8px solid ${T.primary}` }}
    >
      <h2
        className="font-black uppercase tracking-tighter leading-none"
        style={{
          fontFamily: T.newsreader,
          fontSize: "clamp(3.5rem, 9vw, 8rem)",
          color: T.primary,
        }}
      >
        {name}
      </h2>
      <span
        className="font-bold uppercase tracking-tighter hidden sm:block"
        style={{
          fontFamily: T.grotesk,
          fontSize: "clamp(1rem, 1.8vw, 1.5rem)",
          color: T.primary,
        }}
      >
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
    </motion.div>
  );
}

// ─── Scrollable card row with arrow buttons (desktop only) ────────────────────────
function ScrollableCardRow({ items }: { items: MenuItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(items.length > 3);

  const updateButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.clientWidth / 3;
    el.scrollBy({ left: dir === "right" ? cardWidth : -cardWidth, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Scroll container — mobile: flex-col, desktop: flex-row with overflow */}
      <div
        ref={scrollRef}
        onScroll={updateButtons}
        className="flex flex-col md:flex-row md:overflow-x-hidden scrollbar-hide gap-px"
        style={{ backgroundColor: T.primary }}
      >
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(i * 0.08, 0.4) }}
            className="w-full menu-card-col"
          >
            <ItemCard item={item} />
          </motion.div>
        ))}
      </div>

      {/* Arrow buttons — desktop only, shown only when scrollable */}
      {items.length > 3 && (
        <div className="hidden md:flex justify-end gap-px mt-px">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Anterior"
            className="flex items-center justify-center w-14 h-14 transition-opacity"
            style={{
              backgroundColor: canScrollLeft ? T.primary : T.creamHigh,
              color: canScrollLeft ? "#fff" : T.onSurfaceVariant,
              opacity: canScrollLeft ? 1 : 0.4,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Siguiente"
            className="flex items-center justify-center w-14 h-14 transition-opacity"
            style={{
              backgroundColor: canScrollRight ? T.primary : T.creamHigh,
              color: canScrollRight ? "#fff" : T.onSurfaceVariant,
              opacity: canScrollRight ? 1 : 0.4,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

function ItemCard({ item }: { item: MenuItem }) {
  const [flipped, setFlipped] = useState(false);
  const hasImage = Boolean(item.image);

  return (
    // Fixed height so front and back are the same size
    <div className={`flip-card h-full${flipped ? " flipped" : ""}`} style={{ backgroundColor: T.cream }}>
      <div className="flip-card-inner">

        {/* ── FRONT ── */}
        <div
          className="flip-card-front flex flex-col"
          style={{ backgroundColor: T.cream }}
        >
          <div className="p-6 md:p-8 flex-1 flex flex-col">
            {/* Title + price */}
            <div className="flex justify-between items-start gap-4 mb-4">
              <h4
                className="font-black leading-none uppercase"
                style={{
                  fontFamily: T.newsreader,
                  fontSize: "clamp(1.5rem, 2.2vw, 2.2rem)",
                  color: T.onSurface,
                }}
              >
                {item.name}
              </h4>
              {item.price && (
                <span
                  className="font-bold text-white px-2 py-1 text-sm flex-shrink-0 leading-snug"
                  style={{ backgroundColor: T.secondary, fontFamily: T.grotesk }}
                >
                  {item.price}
                </span>
              )}
            </div>

            {/* Badges */}
            {(item.popular || item.homemade || item.award) && (
              <div className="flex gap-2 mb-3">
                {item.award && <span className="text-xs font-bold uppercase px-2 py-0.5 text-white" style={{ backgroundColor: "#C7AF65", fontFamily: T.grotesk }}>★ {item.award}</span>}
                {item.popular && <span className="text-xs font-bold uppercase px-2 py-0.5 text-white" style={{ backgroundColor: T.primary, fontFamily: T.grotesk }}>♥ Popular</span>}
                {item.homemade && <span className="text-xs font-bold uppercase px-2 py-0.5 text-white" style={{ backgroundColor: T.onSurface, fontFamily: T.grotesk }}>⌂ Casera</span>}
              </div>
            )}

            {/* Description */}
            {item.description && (
              <p className="text-sm leading-relaxed mb-6" style={{ fontFamily: T.grotesk, color: T.onSurfaceVariant }}>
                {item.description}
              </p>
            )}

            {/* Flip button — only when image exists */}
            {hasImage && (
              <button
                onClick={() => setFlipped(true)}
                aria-label={`Ver foto de ${item.name}`}
                className="mt-auto self-start flex items-center gap-2 px-4 py-2 text-white text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-75"
                style={{ backgroundColor: T.primary, fontFamily: T.grotesk }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Ver foto
              </button>
            )}
          </div>
        </div>

        {/* ── BACK ── */}
        <div className="flip-card-back" style={{ backgroundColor: T.cream }}>
          {item.image && (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              style={{ opacity: 0.85 }}
            />
          )}
          {/* Overlay with name + back button */}
          <div
            className="absolute inset-0 flex flex-col justify-between p-6"
            style={{ background: "linear-gradient(to top, rgba(30,15,5,0.75) 40%, transparent)" }}
          >
            <button
              onClick={() => setFlipped(false)}
              aria-label="Volver"
              className="self-start flex items-center gap-1.5 px-3 py-1.5 text-white text-xs font-bold uppercase tracking-widest"
              style={{ backgroundColor: "rgba(255,255,255,0.15)", fontFamily: T.grotesk, backdropFilter: "blur(6px)" }}
            >
              ← Volver
            </button>
            <div>
              <p className="font-black uppercase text-white leading-none mb-1" style={{ fontFamily: T.newsreader, fontSize: "clamp(1.3rem, 2vw, 1.8rem)" }}>
                {item.name}
              </p>
              {item.price && (
                <span className="text-sm font-bold text-white/70" style={{ fontFamily: T.grotesk }}>{item.price}</span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── List-style item (for Del Mar, or sparse categories) ────────────────────
function ItemRow({
  item,
  reversed,
}: {
  item: MenuItem;
  reversed?: boolean;
}) {
  return (
    <div
      className={`flex flex-col ${reversed ? "md:flex-row-reverse" : "md:flex-row"} gap-6 items-start`}
    >
      {item.image && (
        <div
          className="w-full md:w-44 flex-shrink-0 overflow-hidden"
          style={{ aspectRatio: "1", backgroundColor: T.creamHighest }}
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className={`flex-1 ${reversed ? "text-right w-full" : ""}`}>
        <div
          className={`flex ${reversed ? "md:justify-end md:gap-8" : "justify-between"} items-baseline pb-2 mb-3`}
          style={{ borderBottom: `2px solid rgba(167,52,17,0.15)` }}
        >
          <h4
            className="font-black uppercase leading-tight"
            style={{
              fontFamily: T.newsreader,
              fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)",
              color: T.onSurface,
            }}
          >
            {item.name}
          </h4>
          {item.price && (
            <span
              className="font-bold text-sm ml-4 flex-shrink-0"
              style={{ fontFamily: T.grotesk, color: T.onSurface }}
            >
              {item.price}
            </span>
          )}
        </div>
        {item.description && (
          <p
            className="text-sm leading-relaxed"
            style={{
              fontFamily: T.grotesk,
              color: T.onSurfaceVariant,
              opacity: 0.8,
            }}
          >
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function MenuSection({ menuData }: MenuSectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedImage) setSelectedImage(null);
    };
    if (selectedImage) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscape);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [selectedImage]);

  if (!menuData || menuData.length === 0) return null;

  return (
    <section
      id="menu"
      className="relative pb-32"
      style={{ backgroundColor: T.cream }}
    >
      {/* ── Compact section heading ── */}
      <div className="px-6 md:px-12 pt-12 md:pt-16 flex items-baseline justify-between border-b border-[rgba(167,52,17,0.12)] pb-4">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="font-black uppercase tracking-tighter leading-none"
          style={{
            fontFamily: T.newsreader,
            fontSize: "clamp(2rem, 5vw, 4rem)",
            color: T.primary,
          }}
        >
          Nuestra Carta
        </motion.h1>
        <p
          className="text-xs uppercase tracking-widest font-bold hidden sm:block"
          style={{ fontFamily: T.grotesk, color: T.onSurfaceVariant }}
        >
          Valdemoro · Madrid
        </p>
      </div>

      {/* ── Categories ── */}
      <div className="px-6 md:px-12">
        {menuData.map((category, catIndex) => {
          const isLast = catIndex === menuData.length - 1;
          const items = category.items;

          // Layout choice: last category gets a 2-col hover-reveal grid,
          // others get 3-col standard cards or rows depending on item count
          const useRowLayout = items.length <= 3 && items.some((i) => i.image);
          const useGridLayout = !useRowLayout;

          return (
            <div key={category.id}>
              <CategoryHeader
                name={category.name}
                index={catIndex}
                total={menuData.length}
              />

              {useGridLayout && <ScrollableCardRow items={items} />}

              {/* Row layout (for small / seafood-style categories) */}
              {useRowLayout && (
                <div className="space-y-16">
                  {items.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <ItemRow item={item} reversed={i % 2 === 1} />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Postres: image hover-reveal grid (last section special treatment) */}
              {isLast && useGridLayout && false /* already handled above */ }
            </div>
          );
        })}
      </div>


      {/* ── Image Modal ── */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Vista de imagen del plato"
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full aspect-[4/3] cursor-default"
            >
              <button
                onClick={() => setSelectedImage(null)}
                aria-label="Cerrar imagen"
                className="absolute -top-4 -right-4 z-10 w-12 h-12 bg-white text-black font-black text-2xl flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                style={{ color: T.onSurface }}
              >
                ×
              </button>
              <div
                className="relative w-full h-full overflow-hidden"
                style={{ border: `8px solid ${T.cream}` }}
              >
                <Image
                  src={selectedImage}
                  alt="Plato"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
