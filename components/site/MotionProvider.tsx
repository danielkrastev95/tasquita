"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";

/** Motion ligero (LazyMotion + `m.*`) y respeto a "reducir movimiento" del sistema. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
