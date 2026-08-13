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
import { useRef, useState, type PointerEvent } from "react";
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
  role: "center" | "left" | "right";
};

const LAYERS: LayerConfig[] = [
  {
    // Rear-left: ivory-gold gown — secondary, ~75% of centre width
    role: "left",
    src: "/hero-front-ivory-gold.png",
    alt: "Ivory gold gown — supporting secondary look",
    width: 636,
    height: 1017,
    className: "bottom-0 left-[6%] w-[40%] sm:left-[10%] sm:w-[37%] lg:left-[13%] lg:w-[34%]",
    zIndex: 10,
    entranceX: -40,
    entranceY: 20,
    entranceDelay: 0.15,
    entranceDuration: 0.9,
    parallaxAmpX: 7,
    parallaxAmpY: 7,
    driftY: 8,
    driftDuration: 6.5,
    driftDelay: 1.3,
  },
  {
    // Rear-right: floral noir gown — secondary, ~73% of centre width
    role: "right",
    src: "/hero-rear-floral-noir.png",
    alt: "Floral noir gown — supporting secondary look",
    width: 1024,
    height: 1536,
    className: "bottom-0 right-[4%] w-[38%] sm:right-[8%] sm:w-[35%] lg:right-[11%] lg:w-[32%]",
    zIndex: 15,
    entranceX: 40,
    entranceY: 20,
    entranceDelay: 0.28,
    entranceDuration: 0.9,
    parallaxAmpX: 7,
    parallaxAmpY: 7,
    driftY: 7,
    driftDuration: 7.5,
    driftDelay: 1.5,
    maskEdges: true,
  },
  {
    // Front-centre: black velvet gown — primary focal point, tallest, highest z
    role: "center",
    src: "/dresses/ko.png",
    alt: "Black velvet off-shoulder gown with gold floral embroidery — the featured piece",
    width: 636,
    height: 1017,
    className: "bottom-0 left-1/2 w-[58%] -translate-x-1/2 sm:w-[48%] lg:w-[44%]",
    zIndex: 20,
    entranceX: 0,
    entranceY: 34,
    entranceDelay: 0.45,
    entranceDuration: 1,
    parallaxAmpX: 8,
    parallaxAmpY: 6,
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
  isHovered,
  onHover,
  onLeave,
}: {
  config: LayerConfig;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  reduceMotion: boolean | null;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const parallaxX = useTransform(springX, [-0.5, 0.5], [-config.parallaxAmpX, config.parallaxAmpX]);
  const parallaxY = useTransform(springY, [-0.5, 0.5], [-config.parallaxAmpY, config.parallaxAmpY]);

  const isSide = config.role !== "center";
  const defaultOpacity = config.role === "left" ? 0.82 : config.role === "right" ? 0.80 : 1.0;

  return (
    <motion.div
      initial={{ opacity: 0, x: config.entranceX, y: config.entranceY, scale: 0.94 }}
      animate={{ opacity: isHovered ? 1 : defaultOpacity, x: 0, y: 0, scale: 1 }}
      transition={{
        duration: reduceMotion ? 0.01 : config.entranceDuration,
        delay: reduceMotion ? 0 : config.entranceDelay,
        ease: EASE,
      }}
      className={`absolute ${config.className}`}
      style={{ zIndex: config.zIndex }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
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
        <motion.div
          style={{ x: parallaxX, y: parallaxY }}
          animate={{ scale: isHovered ? (isSide ? 1.02 : 1.015) : 1 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <Image
            src={config.src}
            alt={config.alt}
            width={config.width}
            height={config.height}
            priority={config.priority}
            sizes="(min-width: 1024px) 40vw, 60vw"
            onLoad={() => trackEvent("hero_image_loaded", { src: config.src })}
            className={`h-auto w-full transition-[filter] duration-300 ${
              isSide
                ? isHovered
                  ? "brightness-100 saturate-100 drop-shadow-[0_30px_40px_rgba(0,0,0,0.5)]"
                  : "brightness-90 saturate-90 drop-shadow-[0_25px_35px_rgba(0,0,0,0.4)]"
                : "drop-shadow-[0_30px_40px_rgba(0,0,0,0.5)]"
            } ${
              config.maskEdges
                ? "[mask-image:radial-gradient(ellipse_78%_88%_at_50%_36%,black_55%,transparent_100%)]"
                : ""
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
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

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
      {/* Stage frame */}
      <div className="glass-stage absolute inset-x-2 inset-y-2 z-0 sm:inset-x-6 sm:inset-y-4 lg:inset-x-10 lg:inset-y-6" />

      {/* Mesh halo */}
      <div
        aria-hidden
        className="absolute inset-x-[10%] bottom-0 z-[1] h-[70%] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, var(--color-accent) 0%, var(--color-plum) 45%, transparent 75%)",
        }}
      />

      {/* Runway trace */}
      <RunwayTrace reduceMotion={reduceMotion} />

      {LAYERS.map((layer) => (
        <ModelLayer
          key={layer.src}
          config={layer}
          springX={springX}
          springY={springY}
          reduceMotion={reduceMotion}
          isHovered={hoveredRole === layer.role}
          onHover={() => setHoveredRole(layer.role)}
          onLeave={() => setHoveredRole(null)}
        />
      ))}
    </motion.div>
  );
}

function RunwayTrace({ reduceMotion }: { reduceMotion: boolean | null }) {
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
