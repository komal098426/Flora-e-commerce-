"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
};

export default function RevealOnScroll({
  children,
  className,
  delay = 0,
  y = 28,
  once = true,
}: RevealOnScrollProps) {
  const reduceMotion = useReducedMotion();

  // `initial`/`whileInView` targets stay constant regardless of reduced-motion
  // preference so the server-rendered style matches the client's first paint —
  // only the transition timing collapses to near-zero, which is invisible but
  // avoids a hydration mismatch (reduceMotion resolves synchronously on the
  // client via matchMedia, but is unknown during SSR).
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.3 }}
      transition={{
        duration: reduceMotion ? 0.01 : 0.7,
        delay: reduceMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
