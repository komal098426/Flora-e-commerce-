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

// 1. Centralized Layout Configuration (Design Tokens) as requested by PRD Sec. 17
export interface SizeConfig {
  scale: number; // Scale as a fraction of the stage height (0.0 - 1.0)
  offset: string; // Horizontal offset from left/right edge
}

export interface BreakpointTokens {
  stageHeight: number; // Stage height in pixels
  center: SizeConfig;
  left: SizeConfig;
  right: SizeConfig;
}

export const STAGE_TOKENS: Record<"mobile" | "tablet" | "desktop", BreakpointTokens> = {
  desktop: {
    stageHeight: 620,
    center: { scale: 1.0, offset: "0%" },
    left: { scale: 0.78, offset: "6%" },  // 78% of center height (target: 72–84%)
    right: { scale: 0.78, offset: "6%" }, // 78% of center height (target: 72–84%)
  },
  tablet: {
    stageHeight: 500,
    center: { scale: 1.0, offset: "0%" },
    left: { scale: 0.75, offset: "4%" },  // 75% of center height (target: 70–80%)
    right: { scale: 0.75, offset: "4%" }, // 75% of center height (target: 70–80%)
  },
  mobile: {
    stageHeight: 380,
    center: { scale: 1.0, offset: "0%" },
    left: { scale: 0.65, offset: "0%" },  // 65% of center height (target: 58–72%)
    right: { scale: 0.65, offset: "0%" }, // 65% of center height (target: 58–72%)
  },
};

// Static model configurations, assets, z-index, aspect ratios, and visual center offsets
export interface ModelStaticConfig {
  src: string;
  alt: string;
  width: number;
  height: number;
  aspectRatio: number; // width / height
  zIndex: number;
  objectPosition: string;
  // Bounding box silhouette columns to define visual center and hit area width
  silhouetteMinX: number;
  silhouetteMaxX: number;
  // Center alignment offset correction (shifts center image left by % of width)
  // Formula: ((minX + maxX)/2 - width/2) / width
  visualCenterCorrection: number;
  // Animation settings
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
}

export const MODEL_STATIC_CONFIGS: Record<"center" | "left" | "right", ModelStaticConfig> = {
  center: {
    src: "/dresses/ko.png",
    alt: "Black velvet off-shoulder gown with gold floral embroidery and thigh-high slit — the featured piece",
    width: 598,
    height: 448,
    aspectRatio: 598 / 448, // 1.3348
    zIndex: 30, // Center model has highest z-index
    objectPosition: "center bottom",
    silhouetteMinX: 224,
    silhouetteMaxX: 421,
    visualCenterCorrection: -0.0393, // -3.93% shift left to visually center silhouette
    entranceX: 0,
    entranceY: 34,
    entranceDelay: 0.45,
    entranceDuration: 1.0,
    parallaxAmpX: 8,  // stable focal parallax (smaller than sides)
    parallaxAmpY: 4,
    driftY: 0,        // center model remains stable (no ambient floating)
    driftDuration: 1,
    driftDelay: 0,
    priority: true,
  },
  left: {
    src: "/hero-front-ivory-gold.png",
    alt: "Ivory gold gown — supporting secondary look, shown behind the featured piece",
    width: 636,
    height: 1017,
    aspectRatio: 636 / 1017, // 0.6254
    zIndex: 10, // Left model behind center
    objectPosition: "center bottom",
    silhouetteMinX: 7,
    silhouetteMaxX: 635,
    visualCenterCorrection: 0.0,
    entranceX: -40,
    entranceY: 20,
    entranceDelay: 0.15,
    entranceDuration: 0.9,
    parallaxAmpX: 14, // more depth offset (more movement)
    parallaxAmpY: 8,
    driftY: 8,        // ambient float
    driftDuration: 6.5,
    driftDelay: 1.3,
  },
  right: {
    src: "/hero-rear-floral-noir.png",
    alt: "Floral noir gown — supporting secondary look, shown behind the featured piece",
    width: 1024,
    height: 1536,
    aspectRatio: 1024 / 1536, // 0.6667
    zIndex: 20, // Right model behind center, but above left
    objectPosition: "center bottom",
    silhouetteMinX: 0,
    silhouetteMaxX: 1023,
    visualCenterCorrection: 0.0,
    entranceX: 40,
    entranceY: 20,
    entranceDelay: 0.28,
    entranceDuration: 0.9,
    parallaxAmpX: 14, // more depth offset
    parallaxAmpY: 8,
    driftY: 7,
    driftDuration: 7.5,
    driftDelay: 1.5,
    maskEdges: true,
  },
};

interface ModelLayerProps {
  role: "center" | "left" | "right";
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  reduceMotion: boolean | null;
  hoveredRole: "center" | "left" | "right" | null;
  setHoveredRole: (role: "center" | "left" | "right" | null) => void;
}

function ModelLayer({
  role,
  springX,
  springY,
  reduceMotion,
  hoveredRole,
  setHoveredRole,
}: ModelLayerProps) {
  const config = MODEL_STATIC_CONFIGS[role];
  const isHovered = hoveredRole === role;

  // Parallax offsets
  const parallaxX = useTransform(springX, [-0.5, 0.5], [-config.parallaxAmpX, config.parallaxAmpX]);
  const parallaxY = useTransform(springY, [-0.5, 0.5], [-config.parallaxAmpY, config.parallaxAmpY]);

  // Sizing styles using the CSS variables injected on the parent stage
  const sizeStyles = {
    height: `var(--${role}-height)`,
    width: `var(--${role}-width)`,
    zIndex: config.zIndex,
    bottom: 0,
  };

  // Add position style based on role
  let posClass = "absolute ";
  let inlinePos: Record<string, string> = {};
  if (role === "center") {
    inlinePos = { left: "var(--center-left)" };
  } else if (role === "left") {
    inlinePos = { left: "var(--left-pos)" };
  } else if (role === "right") {
    inlinePos = { right: "var(--right-pos)" };
  }

  // Interactive states: subtle hover contrast & opacity adjustments
  // Left and right are slightly desaturated/darkened normally, and reveal fully on hover
  let defaultFilter = "drop-shadow(0 30px 40px rgba(0, 0, 0, 0.5))";
  let hoverFilter = "drop-shadow(0 35px 50px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 15px rgba(233, 217, 174, 0.25))";
  let defaultOpacity = 1.0;

  if (role === "left") {
    defaultOpacity = 0.82;
    defaultFilter = "drop-shadow(0 30px 40px rgba(0, 0, 0, 0.45)) brightness(0.9) saturate(0.9)";
    hoverFilter = "drop-shadow(0 30px 40px rgba(0, 0, 0, 0.45)) brightness(1.0) saturate(1.0) drop-shadow(0 0 10px rgba(233, 217, 174, 0.15))";
  } else if (role === "right") {
    defaultOpacity = 0.8;
    defaultFilter = "drop-shadow(0 25px 35px rgba(0, 0, 0, 0.35)) brightness(0.9) saturate(0.9)";
    hoverFilter = "drop-shadow(0 25px 35px rgba(0, 0, 0, 0.35)) brightness(1.0) saturate(1.0) drop-shadow(0 0 10px rgba(233, 217, 174, 0.15))";
  }

  // Calculate hitbox positioning based on actual silhouette columns (hit area only wraps dress body, not empty space)
  const hitboxLeft = `calc(var(--${role}-width) * ${config.silhouetteMinX / config.width})`;
  const hitboxWidth = `calc(var(--${role}-width) * ${(config.silhouetteMaxX - config.silhouetteMinX) / config.width})`;

  return (
    <>
      {/* ── Layer Container (Entrance Animation) ── */}
      <motion.div
        initial={{ opacity: 0, x: config.entranceX, y: config.entranceY }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{
          duration: reduceMotion ? 0.01 : config.entranceDuration,
          delay: reduceMotion ? 0 : config.entranceDelay,
          ease: EASE,
        }}
        className={posClass}
        style={{ ...sizeStyles, ...inlinePos }}
      >
        {/* ── Idle Float Container ── */}
        <motion.div
          animate={{ y: [0, -config.driftY, 0] }}
          transition={{
            duration: config.driftDuration,
            delay: config.driftDelay,
            repeat: reduceMotion ? 0 : Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          className="h-full w-full"
        >
          {/* ── Pointer Parallax Container ── */}
          <motion.div
            style={{ x: parallaxX, y: parallaxY }}
            className="h-full w-full"
          >
            {/* ── Interactive Hover Container ── */}
            <motion.div
              animate={{
                y: isHovered ? -6 : 0,
                scale: isHovered ? (role === "center" ? 1.015 : 1.025) : 1.0,
                opacity: isHovered ? 1.0 : defaultOpacity,
              }}
              transition={{ duration: 0.4, ease: EASE }}
              style={{
                filter: isHovered ? hoverFilter : defaultFilter,
              }}
              className="h-full w-full transition-[filter] duration-300 pointer-events-none"
            >
              <Image
                src={config.src}
                alt=""
                aria-hidden="true"
                width={config.width}
                height={config.height}
                priority={config.priority}
                sizes="(min-width: 1024px) 40vw, 60vw"
                onLoad={() => trackEvent("hero_image_loaded", { src: config.src })}
                className={`h-full w-full ${
                  config.maskEdges
                    ? "[mask-image:radial-gradient(ellipse_78%_88%_at_50%_36%,black_55%,transparent_100%)]"
                    : ""
                }`}
                style={{ objectPosition: config.objectPosition, objectFit: "contain" }}
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ── Keyboard reachable & Silhouette hit-testing overlay button (PRD Sec. 14 & 17) ── */}
        <button
          type="button"
          aria-label={config.alt}
          onMouseEnter={() => setHoveredRole(role)}
          onMouseLeave={() => setHoveredRole(null)}
          onFocus={() => setHoveredRole(role)}
          onBlur={() => setHoveredRole(null)}
          onClick={() => {
            trackEvent("hero_model_clicked", { role });
          }}
          className="absolute top-0 cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-ink rounded-2xl transition-shadow"
          style={{
            left: hitboxLeft,
            width: hitboxWidth,
            height: "100%",
            zIndex: 50, // Higher than visual layers so it grabs pointer events
            background: "transparent",
            border: "none",
          }}
        />
      </motion.div>
    </>
  );
}

export default function LayeredModelStage() {
  const reduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const [hoveredRole, setHoveredRole] = useState<"center" | "left" | "right" | null>(null);

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

  // Generate responsive CSS variables for layout sizing and alignment
  const generateResponsiveStyles = () => {
    return `
      #layered-stage {
        --stage-height: ${STAGE_TOKENS.mobile.stageHeight}px;
        --center-scale: ${STAGE_TOKENS.mobile.center.scale};
        --left-scale: ${STAGE_TOKENS.mobile.left.scale};
        --left-pos: ${STAGE_TOKENS.mobile.left.offset};
        --right-scale: ${STAGE_TOKENS.mobile.right.scale};
        --right-pos: ${STAGE_TOKENS.mobile.right.offset};
      }
      
      @media (min-width: 640px) {
        #layered-stage {
          --stage-height: ${STAGE_TOKENS.tablet.stageHeight}px;
          --center-scale: ${STAGE_TOKENS.tablet.center.scale};
          --left-scale: ${STAGE_TOKENS.tablet.left.scale};
          --left-pos: ${STAGE_TOKENS.tablet.left.offset};
          --right-scale: ${STAGE_TOKENS.tablet.right.scale};
          --right-pos: ${STAGE_TOKENS.tablet.right.offset};
        }
      }
      
      @media (min-width: 1024px) {
        #layered-stage {
          --stage-height: ${STAGE_TOKENS.desktop.stageHeight}px;
          --center-scale: ${STAGE_TOKENS.desktop.center.scale};
          --left-scale: ${STAGE_TOKENS.desktop.left.scale};
          --left-pos: ${STAGE_TOKENS.desktop.left.offset};
          --right-scale: ${STAGE_TOKENS.desktop.right.scale};
          --right-pos: ${STAGE_TOKENS.desktop.right.offset};
        }
      }

      #layered-stage {
        /* Derived CSS variables */
        --center-height: calc(var(--stage-height) * var(--center-scale));
        --center-width: calc(var(--center-height) * ${MODEL_STATIC_CONFIGS.center.aspectRatio});
        --center-left: calc(50% - var(--center-width) * 0.5 + var(--center-width) * ${MODEL_STATIC_CONFIGS.center.visualCenterCorrection});

        --left-height: calc(var(--stage-height) * var(--left-scale));
        --left-width: calc(var(--left-height) * ${MODEL_STATIC_CONFIGS.left.aspectRatio});

        --right-height: calc(var(--stage-height) * var(--right-scale));
        --right-width: calc(var(--right-height) * ${MODEL_STATIC_CONFIGS.right.aspectRatio});
      }
    `;
  };

  return (
    <motion.div
      ref={stageRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ opacity: stageOpacity, y: stageY }}
      id="layered-stage"
      className="relative mx-auto w-full max-w-lg lg:max-w-none transition-[height] duration-300"
      style={{
        opacity: stageOpacity,
        y: stageY,
        height: "var(--stage-height)",
      }}
    >
      {/* Responsive stylesheet injection */}
      <style dangerouslySetInnerHTML={{ __html: generateResponsiveStyles() }} />

      {/* Stage frame: a couture display case the models stand inside */}
      <div className="glass-stage absolute inset-x-2 inset-y-2 z-0 sm:inset-x-6 sm:inset-y-4 lg:inset-x-10 lg:inset-y-6" />

      {/* Mesh halo behind the group */}
      <div
        aria-hidden
        className="absolute inset-x-[10%] bottom-0 z-1 h-[70%] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, var(--color-accent) 0%, var(--color-plum) 45%, transparent 75%)",
        }}
      />

      {/* Runway trace: a reflected light line at the models' feet */}
      <RunwayTrace reduceMotion={reduceMotion} />

      {/* Center-dominant models composition layers */}
      {(["left", "right", "center"] as const).map((role) => (
        <ModelLayer
          key={role}
          role={role}
          springX={springX}
          springY={springY}
          reduceMotion={reduceMotion}
          hoveredRole={hoveredRole}
          setHoveredRole={setHoveredRole}
        />
      ))}
    </motion.div>
  );
}

function RunwayTrace({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <div aria-hidden className="absolute inset-x-4 bottom-0 z-40 sm:inset-x-8 lg:inset-x-12">
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
