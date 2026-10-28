"use client";

import { useSyncExternalStore } from "react";

/* ── Teclado en pantalla ──────────────────────────────────────────────────────
 * iOS (y Chrome en Android por defecto) no encogen la página al abrir el teclado:
 * lo fijado abajo quedaría debajo del teclado. Con visualViewport sabemos cuántos
 * píxeles tapa, para subir barras y hojas justo encima. */

const subscribe = (onChange: () => void) => {
  const vv = window.visualViewport;
  vv?.addEventListener("resize", onChange);
  vv?.addEventListener("scroll", onChange);
  window.addEventListener("resize", onChange);
  return () => {
    vv?.removeEventListener("resize", onChange);
    vv?.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
};

const keyboardInset = () => {
  const vv = window.visualViewport;
  if (!vv || vv.scale > 1.05) return 0; // con zoom de pellizco, no tocamos nada
  const inset = Math.round(window.innerHeight - vv.height - vv.offsetTop);
  return inset > 80 ? inset : 0; // menos de 80 px son barras del navegador, no el teclado
};

/** Píxeles que tapa el teclado en pantalla (0 si está cerrado). */
export function useKeyboardInset() {
  return useSyncExternalStore(subscribe, keyboardInset, () => 0);
}
