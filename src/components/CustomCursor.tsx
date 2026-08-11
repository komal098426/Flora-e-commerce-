"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

// Matches the real interactive surfaces on this site (nav links, CTAs,
// dress cards, size chips, accordion toggles, showcase tabs) rather than a
// speculative "model layer" or "preset control" concept the site doesn't
// have. Deliberately excludes text inputs, textareas, and selects — those
// keep their native cursor per globals.css.
const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], [role="tab"], summary, input[type="checkbox"], input[type="radio"], input[type="range"]';

export default function CustomCursor() {
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  // A tight spring keeps tracking feel near-instant while still smoothing
  // out sub-pixel jitter — reduced motion skips the spring entirely so the
  // flower snaps directly to the pointer with zero perceived lag.
  const springX = useSpring(mx, { stiffness: 900, damping: 60, mass: 0.4 });
  const springY = useSpring(my, { stiffness: 900, damping: 60, mass: 0.4 });

  // Gate on a fine pointer only, with a live listener so a hybrid device
  // (touchscreen laptop, tablet with a mouse) toggles correctly if the
  // active input method changes mid-session.
  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    document.body.classList.add("custom-cursor-active");

    function handleMove(e: PointerEvent) {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      mx.set(e.clientX);
      my.set(e.clientY);
      setVisible(true);
    }

    function handleOver(e: PointerEvent) {
      const target = e.target as Element | null;
      const interactive = target?.closest(INTERACTIVE_SELECTOR);
      const disabled =
        interactive?.matches(":disabled") || interactive?.getAttribute("aria-disabled") === "true";
      setHovering(!!interactive && !disabled);
    }

    function handleLeaveWindow() {
      setVisible(false);
    }

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerover", handleOver, { passive: true });
    document.addEventListener("mouseleave", handleLeaveWindow);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerover", handleOver);
      document.removeEventListener("mouseleave", handleLeaveWindow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  if (!enabled) return null;

  const scale = hovering ? 1.35 : 1;
  const rotate = hovering ? 10 : 0;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-9999"
      style={{
        x: reduceMotion ? mx : springX,
        y: reduceMotion ? my : springY,
        opacity: visible ? 1 : 0,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      <motion.svg
        width="30"
        height="30"
        viewBox="0 0 40 40"
        animate={{ scale, rotate }}
        transition={{ duration: reduceMotion ? 0.01 : 0.25, ease: [0.16, 1, 0.3, 1] }}
        style={{ filter: "drop-shadow(0 0 5px rgba(110, 20, 35, 0.4))" }}
      >
        <g>
          {[
            { angle: -6, rx: 6.5, ry: 9.5 },
            { angle: 66, rx: 6, ry: 9 },
            { angle: 138, rx: 6.5, ry: 9.5 },
            { angle: 214, rx: 6, ry: 9 },
            { angle: 288, rx: 6.5, ry: 9 },
          ].map((petal, i) => (
            <ellipse
              key={i}
              cx="20"
              cy="10.5"
              rx={petal.rx}
              ry={petal.ry}
              fill="var(--color-accent)"
              fillOpacity="0.92"
              stroke="var(--color-ivory)"
              strokeWidth="0.6"
              strokeOpacity="0.35"
              transform={`rotate(${petal.angle} 20 20)`}
            />
          ))}
        </g>
        <circle
          cx="20"
          cy="20"
          r="3.4"
          fill="var(--color-ivory)"
          stroke="var(--color-ink)"
          strokeWidth="0.8"
        />
      </motion.svg>
    </motion.div>
  );
}
