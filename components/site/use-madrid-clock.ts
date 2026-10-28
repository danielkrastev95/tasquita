"use client";

import { useSyncExternalStore } from "react";

/* Reloj compartido para los datos que dependen de "ahora" (abierto/cerrado, día de hoy).
 * Las páginas son estáticas: en servidor e hidratación devuelve null y, ya en el
 * cliente, el minuto actual. Se refresca cada minuto y al volver a la pestaña. */

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 15_000);
  document.addEventListener("visibilitychange", onChange);
  return () => {
    window.clearInterval(id);
    document.removeEventListener("visibilitychange", onChange);
  };
}

const getMinute = () => Math.floor(Date.now() / 60_000);
const getServerMinute = () => null;

/** Minuto actual (epoch) o null antes de montar. Convierte con `new Date(minute * 60_000)`. */
export function useMinute(): number | null {
  return useSyncExternalStore(subscribe, getMinute, getServerMinute);
}
