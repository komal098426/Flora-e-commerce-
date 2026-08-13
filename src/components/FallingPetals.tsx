"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

// Petal shape variants — SVG ellipses mimicking wisteria petals
const PETAL_PATHS = [
  // rounded oval
  <ellipse key="a" cx="10" cy="6" rx="10" ry="6" />,
  // slightly pointed oval
  <path key="b" d="M10 0 Q20 4 10 12 Q0 4 10 0Z" />,
  // small teardrop
  <path key="c" d="M8 0 Q16 5 8 14 Q0 5 8 0Z" />,
];

type Petal = {
  id: number;
  x: number;          // start x % across viewport
  delay: number;      // animation start delay (s)
  duration: number;   // fall duration (s)
  scale: number;      // size multiplier
  opacity: number;    // base opacity
  blur: number;       // px blur (depth cue)
  drift: number;      // horizontal drift px
  rotateStart: number;
  rotateEnd: number;
  shapeIdx: number;
  color: string;
};

// Configuration — tune these without touching animation logic
const CONFIG = {
  desktop: { count: 18 },
  mobile:  { count: 9  },
  durationRange: [6, 14],   // seconds
  delayRange:    [0, 12],   // seconds
  scaleRange:    [0.5, 1.6],
  opacityRange:  [0.35, 0.85],
  blurRange:     [0, 2.5],  // px
  driftRange:    [-80, 80], // px horizontal
  rotateRange:   [-180, 180],
  colors: [
    "rgba(220,180,230,ALPHA)",   // soft lilac
    "rgba(240,200,240,ALPHA)",   // pale lavender
    "rgba(255,210,240,ALPHA)",   // blush pink
    "rgba(200,160,220,ALPHA)",   // medium lilac
    "rgba(255,230,250,ALPHA)",   // near-white
  ],
};

function lerp(min: number, max: number, t: number) {
  return min + (max - min) * t;
}

// Seeded pseudo-random for consistent SSR/CSR output
function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function generatePetals(count: number): Petal[] {
  return Array.from({ length: count }, (_, i) => {
    const r = (n: number) => seededRand(i * 17 + n);
    const alpha = lerp(CONFIG.opacityRange[0], CONFIG.opacityRange[1], r(0));
    const color = CONFIG.colors[Math.floor(r(9) * CONFIG.colors.length)].replace("ALPHA", alpha.toFixed(2));
    return {
      id: i,
      x: lerp(2, 98, r(1)),
      delay: lerp(CONFIG.delayRange[0], CONFIG.delayRange[1], r(2)),
      duration: lerp(CONFIG.durationRange[0], CONFIG.durationRange[1], r(3)),
      scale: lerp(CONFIG.scaleRange[0], CONFIG.scaleRange[1], r(4)),
      opacity: alpha,
      blur: lerp(CONFIG.blurRange[0], CONFIG.blurRange[1], r(5)),
      drift: lerp(CONFIG.driftRange[0], CONFIG.driftRange[1], r(6)),
      rotateStart: lerp(CONFIG.rotateRange[0], CONFIG.rotateRange[1], r(7)),
      rotateEnd: lerp(CONFIG.rotateRange[0], CONFIG.rotateRange[1], r(8)),
      shapeIdx: Math.floor(r(10) * PETAL_PATHS.length),
      color,
    };
  });
}

export default function FallingPetals() {
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const count = isMobile ? CONFIG.mobile.count : CONFIG.desktop.count;
  const petals = generatePetals(count);

  if (reduceMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
    >
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-0"
          style={{
            left: `${p.x}%`,
            filter: p.blur > 0 ? `blur(${p.blur}px)` : undefined,
          }}
          initial={{ y: "-8vh", opacity: 0, rotate: p.rotateStart, x: 0 }}
          animate={{
            y: "108vh",
            opacity: [0, p.opacity, p.opacity, 0],
            rotate: p.rotateEnd,
            x: [0, p.drift * 0.4, p.drift * 0.7, p.drift],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: lerp(3, 8, seededRand(p.id * 3 + 11)),
            ease: [0.2, 0, 0.8, 1],
            opacity: { times: [0, 0.1, 0.85, 1] },
            x: { times: [0, 0.3, 0.7, 1], ease: "easeInOut" },
          }}
        >
          <svg
            width={20 * p.scale}
            height={14 * p.scale}
            viewBox="0 0 20 14"
            fill={p.color}
          >
            {PETAL_PATHS[p.shapeIdx]}
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
