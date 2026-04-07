"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

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
      style={{ borderTop: `8px solid #C7AF65` }}
    >
      <h2
        className="font-black uppercase tracking-tighter leading-none"
        style={{
          fontFamily: T.newsreader,
          fontSize: "clamp(1.8rem, 4.5vw, 4.5rem)",
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
          color: "#C7AF65",
        }}
      >
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
    </motion.div>
  );
}

// ─── Scrollable card row with arrow buttons ───────────────────────────────────
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
            className="w-full md:w-1/3 flex-shrink-0 h-full"
          >
            <ItemCard item={item} />
          </motion.div>
        ))}
      </div>

      {/* Botones — solo desktop, solo cuando hay más de 3 items */}
      {items.length > 3 && (
        <div className="hidden md:flex justify-end gap-px mt-px">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Anterior"
            className="flex items-center justify-center w-20 h-20 transition-opacity"
            style={{
              backgroundColor: canScrollLeft ? T.primary : T.creamHigh,
              color: canScrollLeft ? "#fff" : T.onSurfaceVariant,
              opacity: canScrollLeft ? 1 : 0.4,
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Siguiente"
            className="flex items-center justify-center w-20 h-20 transition-opacity"
            style={{
              backgroundColor: canScrollRight ? T.primary : T.creamHigh,
              color: canScrollRight ? "#fff" : T.onSurfaceVariant,
              opacity: canScrollRight ? 1 : 0.4,
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

function ItemCard({ item }: { item: MenuItem }) {
  const hasImage = Boolean(item.image);

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: T.cream }}>

      {/* ── Foto — solo si existe ── */}
      {hasImage && (
        <div className="relative overflow-hidden flex-shrink-0 h-52 md:h-80">
          <img
            src={item.image!}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          {/* Precio flotante sobre la foto */}
          {item.price && (
            <span
              className="absolute bottom-0 right-0 font-bold text-white px-3 py-1.5 text-sm leading-snug"
              style={{ backgroundColor: T.secondary, fontFamily: T.grotesk }}
            >
              {item.price}
            </span>
          )}
        </div>
      )}

      {/* ── Contenido ── */}
      <div className="p-6 md:p-7 flex flex-col flex-1">
        {/* Título + precio (sin foto) */}
        <div className={`flex justify-between items-start gap-4 ${hasImage ? "mb-3" : "mb-3"}`}>
          <h4
            className="font-black leading-none uppercase"
            style={{
              fontFamily: T.newsreader,
              fontSize: "clamp(1.4rem, 2.2vw, 2rem)",
              color: T.onSurface,
            }}
          >
            {item.name}
          </h4>
          {/* Precio inline solo cuando no hay foto */}
          {!hasImage && item.price && (
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
          <div className="flex flex-wrap gap-2 mb-3">
            {item.award && (
              <span className="text-xs font-bold uppercase px-2 py-0.5 text-white" style={{ backgroundColor: "#C7AF65", fontFamily: T.grotesk }}>
                ★ {item.award}
              </span>
            )}
            {item.popular && (
              <span className="text-xs font-bold uppercase px-2 py-0.5 text-white" style={{ backgroundColor: T.primary, fontFamily: T.grotesk }}>
                ♥ Popular
              </span>
            )}
            {item.homemade && (
              <span className="text-xs font-bold uppercase px-2 py-0.5 text-white" style={{ backgroundColor: T.onSurface, fontFamily: T.grotesk }}>
                ⌂ Casera
              </span>
            )}
          </div>
        )}

        {/* Descripción */}
        {item.description && (
          <p className="leading-relaxed" style={{ fontFamily: T.grotesk, fontSize: "0.95rem", color: T.onSurfaceVariant }}>
            {item.description}
          </p>
        )}
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
          className="w-full md:w-80 flex-shrink-0 overflow-hidden"
          style={{ aspectRatio: "4/3", backgroundColor: T.creamHighest }}
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
            className="leading-relaxed"
            style={{
              fontFamily: T.grotesk,
              fontSize: "0.95rem",
              color: T.onSurfaceVariant,
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
  if (!menuData || menuData.length === 0) return null;

  return (
    <section
      id="menu"
      className="relative pb-32 overflow-x-hidden"
      style={{ backgroundColor: T.cream }}
    >
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


    </section>
  );
}
