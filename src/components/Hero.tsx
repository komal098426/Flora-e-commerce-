"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import FallingPetals from "./FallingPetals";
import LayeredModelStage from "./LayeredModelStage";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    trackEvent("hero_viewed");
  }, []);

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.12,
        delayChildren: reduceMotion ? 0 : 0.9,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0.01 : 0.8, ease: EASE },
    },
  };

  return (
    <section id="top" className="relative flex min-h-svh items-center overflow-hidden bg-ink">

      {/* ── Layer 0: wisteria atmospheric background ── */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0.01 : 1.4, ease: EASE }}
      >
        <Image
          src="/dresses/hero.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* light bottom fade for text legibility — image is already dark */}
        <div className="absolute inset-0 bg-linear-to-b from-black/5 via-transparent to-black/50" />
        {/* subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_100%_at_50%_0%,transparent_50%,rgba(21,19,15,0.3)_100%)]" />
      </motion.div>

      {/* ── Layer 1: falling petals (behind models, above background) ── */}
      <FallingPetals />

      {/* ── Layer 2: content + model stage ── */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 pt-28 pb-16 sm:px-10 lg:grid-cols-[0.95fr_1.25fr] lg:gap-6 lg:pt-20">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="order-2 lg:order-1"
        >
          <motion.p
            variants={item}
            className="glass-chip mb-6 inline-block w-fit rounded-full px-4 py-1.5 text-xs tracking-[0.4em] text-accent-soft/90 uppercase"
          >
            Autumn / Winter Collection
          </motion.p>
          <motion.h1
            variants={item}
            className="font-display text-6xl leading-[1.02] text-ivory italic sm:text-7xl lg:text-8xl"
          >
            Dresses in
            <br />
            Motion
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-8 max-w-md text-base leading-relaxed text-ivory/70"
          >
            An atmosphere before it is a garment. A considered collection of
            dresses for the entrance, the reception, and everything after —
            cut, draped, and finished by hand.
          </motion.p>
          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-6">
            <a
              href="#collection"
              onClick={() => trackEvent("hero_cta_clicked", { cta: "explore_collection" })}
              className="relative overflow-hidden rounded-full bg-linear-to-b from-ivory to-ivory-deep px-7 py-3.5 text-sm tracking-wide text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition-all duration-300 hover:-translate-y-px hover:from-accent hover:to-accent-light hover:text-ivory hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_8px_20px_-6px_rgba(110,20,35,0.55)]"
            >
              Explore the collection
            </a>
            <a
              href="#story"
              onClick={() => trackEvent("hero_cta_clicked", { cta: "discover_the_story" })}
              className="text-sm tracking-wide text-ivory/80 underline underline-offset-4 transition-colors hover:text-ivory"
            >
              Discover the story
            </a>
          </motion.div>
        </motion.div>

        <div className="order-1 lg:order-2">
          <LayeredModelStage />
        </div>
      </div>

      <motion.a
        href="#story"
        aria-label="Scroll to next section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0.01 : 1, delay: reduceMotion ? 0 : 1.6 }}
        className="absolute inset-x-0 bottom-8 z-10 mx-auto flex w-fit flex-col items-center gap-2 text-ivory/60"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{
            duration: 1.8,
            repeat: reduceMotion ? 0 : Infinity,
            ease: "easeInOut",
          }}
        >
          <ChevronDown size={18} />
        </motion.span>
      </motion.a>
    </section>
  );
}
