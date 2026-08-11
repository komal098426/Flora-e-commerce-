"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import { useRef, type PointerEvent } from "react";
import { trackEvent } from "@/lib/analytics";

const EASE = [0.16, 1, 0.3, 1] as const;

type LayerConfig = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className: string;
  zIndex: number;
  entranceX: number;
  entranceY: number;
  entranceDelay: number;
  entranceDuration: number;
  parallaxAmpX: number;
  parallaxAmpY: number;
  driftY: number;
  driftDuration: number;
  driftDelay: number;
  maskEdges?: boolean;
  priority?: boolean;
};

const LAYERS: LayerConfig[] = [
  {
    // Rear-left: establishes width and balance, softened behind the front piece.
    src: "/hero-rear-rose-pink.png",
    alt: "Camellia Rosette Gown — strapless pink ball gown with sculpted rose appliqué, shown softened behind the featured piece",
    width: 900,
    height: 1017,
    className: "bottom-0 left-[-6%] w-[58%] sm:left-[-2%] sm:w-[44%] lg:left-[8%] lg:w-[38%] opacity-80",
    zIndex: 10,
    entranceX: -36,
    entranceY: 18,
    entranceDelay: 0.15,
    entranceDuration: 0.9,
    parallaxAmpX: 7,
    parallaxAmpY: 4,
    driftY: 7,
    driftDuration: 6.5,
    driftDelay: 1.3,
  },
  {
    // Rear-right: adds asymmetry and collection breadth; edges are masked to
    // blend its own dark backdrop into the hero atmosphere (no true cutout
    // was available for this asset).
    src: "/hero-rear-floral-noir.png",
    alt: "Bloomfall Gown — ivory gown with crimson and white floral appliqué over a fitted underskirt, shown softened behind the featured piece",
    width: 1024,
    height: 1536,
    className: "right-[-6%] bottom-0 w-[56%] sm:right-[-2%] sm:w-[42%] lg:right-[6%] lg:w-[36%] opacity-75",
    zIndex: 15,
    entranceX: 36,
    entranceY: 18,
    entranceDelay: 0.28,
    entranceDuration: 0.9,
    parallaxAmpX: 7,
    parallaxAmpY: 4,
    driftY: 6,
    driftDuration: 7.5,
    driftDelay: 1.5,
    maskEdges: true,
  },
  {
    // Front: the focal point — highest contrast, largest scale, settles last.
    src: "/hero-front-ivory-gold.png",
    alt: "Solstice Column Gown — ivory silk one-shoulder gown with hand-beaded gold embroidery and a thigh-high slit, the featured piece",
    width: 636,
    height: 1017,
    className: "bottom-0 left-1/2 w-[68%] -translate-x-1/2 sm:w-[56%] lg:w-[46%]",
    zIndex: 20,
    entranceX: 0,
    entranceY: 34,
    entranceDelay: 0.45,
    entranceDuration: 1,
    parallaxAmpX: 16,
    parallaxAmpY: 9,
    driftY: 0,
    driftDuration: 1,
    driftDelay: 0,
    priority: true,
  },
];

function ModelLayer({
  config,
  springX,
  springY,
  reduceMotion,
}: {
  config: LayerConfig;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  reduceMotion: boolean | null;
}) {
  const parallaxX = useTransform(springX, [-0.5, 0.5], [-config.parallaxAmpX, config.parallaxAmpX]);
  const parallaxY = useTransform(springY, [-0.5, 0.5], [-config.parallaxAmpY, config.parallaxAmpY]);

  return (
    <motion.div
      initial={{ opacity: 0, x: config.entranceX, y: config.entranceY, scale: 0.94 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      transition={{
        duration: reduceMotion ? 0.01 : config.entranceDuration,
        delay: reduceMotion ? 0 : config.entranceDelay,
        ease: EASE,
      }}
      className={`absolute ${config.className}`}
      style={{ zIndex: config.zIndex }}
    >
      <motion.div
        animate={{ y: [0, -config.driftY, 0] }}
        transition={{
          duration: config.driftDuration,
          delay: config.driftDelay,
          repeat: reduceMotion ? 0 : Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      >
        <motion.div style={{ x: parallaxX, y: parallaxY }}>
          <Image
            src={config.src}
            alt={config.alt}
            width={config.width}
            height={config.height}
            priority={config.priority}
            sizes="(min-width: 1024px) 40vw, 60vw"
            onLoad={() => trackEvent("hero_image_loaded", { src: config.src })}
            className={`h-auto w-full ${
              config.maskEdges
                ? "drop-shadow-[0_25px_35px_rgba(0,0,0,0.35)] [mask-image:radial-gradient(ellipse_78%_88%_at_50%_36%,black_55%,transparent_100%)]"
                : "drop-shadow-[0_30px_40px_rgba(0,0,0,0.5)]"
            }`}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function LayeredModelStage() {
  const reduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 55, damping: 20 });
  const springY = useSpring(my, { stiffness: 55, damping: 20 });

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end start"],
  });
  const stageOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);
  const stageY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      ref={stageRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ opacity: stageOpacity, y: stageY }}
      className="relative mx-auto h-[380px] w-full max-w-lg sm:h-[500px] lg:h-[620px] lg:max-w-none"
    >
      {/* Stage frame: a couture display case the models stand inside, rather
          than a flat black backdrop. */}
      <div className="glass-stage absolute inset-x-2 inset-y-2 z-0 sm:inset-x-6 sm:inset-y-4 lg:inset-x-10 lg:inset-y-6" />

      {/* Mesh halo behind the group. */}
      <div
        aria-hidden
        className="absolute inset-x-[10%] bottom-0 z-1 h-[70%] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, var(--color-accent) 0%, var(--color-plum) 45%, transparent 75%)",
        }}
      />

      {/* Runway trace: a reflected light line at the models' feet. */}
      <RunwayTrace reduceMotion={reduceMotion} />

      {LAYERS.map((layer) => (
        <ModelLayer
          key={layer.src}
          config={layer}
          springX={springX}
          springY={springY}
          reduceMotion={reduceMotion}
        />
      ))}
    </motion.div>
  );
}

function RunwayTrace({ reduceMotion }: { reduceMotion: boolean | null }) {
  // The dress trains flare wide enough near the bottom to cover a trace
  // positioned behind them at almost any width, so this sits above the
  // models (z-30) at the exact floor line as a soft glow rather than a hard
  // line — it reads as light catching the hemline, not a stripe cutting
  // across the garments.
  return (
    <div aria-hidden className="absolute inset-x-4 bottom-0 z-30 sm:inset-x-8 lg:inset-x-12">
      <div
        className="mx-auto h-4 w-full opacity-60 blur-lg"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--color-accent) 50%, transparent 100%)",
        }}
      />
      <motion.div
        className="mx-auto -mt-3 h-px w-2/3"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--color-accent-light) 50%, transparent 100%)",
        }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{
          duration: 4,
          repeat: reduceMotion ? 0 : Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
