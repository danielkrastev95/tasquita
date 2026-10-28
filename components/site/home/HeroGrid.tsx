"use client";

import { useEffect, useRef } from "react";

const CELL = 80; // mismo tamaño que la utilidad bg-grid
const HOLD_MS = 450;
const FADE_PER_FRAME = 0.025;

/**
 * Rejilla interactiva del hero: ilumina la celda bajo el ratón y la apaga poco a poco.
 * Solo con ratón (pointer: fine) y sin "reducir movimiento". El bucle de dibujo
 * solo corre mientras hay celdas encendidas; la celda se calcula por índice.
 */
export function HeroGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const area = canvas?.parentElement;
    if (!canvas || !area) return;
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let cols = 0;
    let alpha = new Float32Array(0);
    let touchedAt = new Float64Array(0);
    const active = new Set<number>();
    let frame = 0;

    const resize = () => {
      const rect = area.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / CELL);
      const rows = Math.ceil(height / CELL);
      alpha = new Float32Array(cols * rows);
      touchedAt = new Float64Array(cols * rows);
      active.clear();
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const i of active) {
        if (now - touchedAt[i] > HOLD_MS) alpha[i] -= FADE_PER_FRAME;
        if (alpha[i] <= 0) {
          alpha[i] = 0;
          active.delete(i);
          continue;
        }
        const x = (i % cols) * CELL;
        const y = Math.floor(i / cols) * CELL;
        const a = alpha[i];
        const glow = ctx.createRadialGradient(x + CELL / 2, y + CELL / 2, 4, x + CELL / 2, y + CELL / 2, CELL);
        glow.addColorStop(0, `rgba(47,119,128,${a * 0.26})`);
        glow.addColorStop(1, "rgba(47,119,128,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(x, y, CELL, CELL);
        ctx.strokeStyle = `rgba(47,119,128,${a * 0.4})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, CELL - 1, CELL - 1);
      }
      frame = active.size > 0 ? requestAnimationFrame(draw) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x >= width || y >= height) return;
      const i = Math.floor(y / CELL) * cols + Math.floor(x / CELL);
      if (alpha[i] === 0) alpha[i] = 1;
      touchedAt[i] = performance.now();
      active.add(i);
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(area);
    area.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      observer.disconnect();
      area.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden size-full pointer-fine:block" />;
}
