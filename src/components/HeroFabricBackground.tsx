"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

// Configuration for the flowing-cloth presentation layer. Tune here without
// touching the animation wiring below.
const FABRIC = {
  src: "/hero-fabric-red.png",
  // Warm neutral sampled from the source image — shows during load, never a bare flash.
  baseColor: "#efe5d8",
  // Overscan keeps the drift/breathing motion from ever exposing an edge.
  overscan: 1.03,
  amplitudeX: 6,
  amplitudeY: 3,
  scaleBreath: 0.01,
  duration: 20,
  objectPosition: "object-[68%_38%] sm:object-[58%_40%] lg:object-[50%_42%]",
};

export default function HeroFabricBackground() {
  const reduceMotion = useReducedMotion();

  const rest = { x: 0, y: 0, scale: FABRIC.overscan };
  const drift = {
    x: [0, FABRIC.amplitudeX, 0, -FABRIC.amplitudeX, 0],
    y: [0, -FABRIC.amplitudeY, 0, FABRIC.amplitudeY, 0],
    scale: [
      FABRIC.overscan,
      FABRIC.overscan + FABRIC.scaleBreath,
      FABRIC.overscan,
      FABRIC.overscan + FABRIC.scaleBreath,
      FABRIC.overscan,
    ],
  };

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden"
      style={{ backgroundColor: FABRIC.baseColor }}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, ...rest }}
        animate={reduceMotion ? { opacity: 1, ...rest } : { opacity: 1, ...drift }}
        transition={{
          opacity: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
          x: { duration: FABRIC.duration, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" },
          y: { duration: FABRIC.duration, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" },
          scale: { duration: FABRIC.duration, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" },
        }}
      >
        <Image
          src={FABRIC.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className={`object-cover ${FABRIC.objectPosition}`}
        />
      </motion.div>

      {/* Readability treatment — localized, never a full-section tint.
          Mobile/tablet: text sits below the models, so protect the lower band.
          Desktop: text sits in the left column, so protect the left band. */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-ink/8 to-transparent lg:hidden" />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-ink/45 via-ink/8 to-transparent lg:block" />
    </div>
  );
}
