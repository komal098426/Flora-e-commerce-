"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { dresses, looks } from "@/lib/dresses";
import { useDressDetail } from "./DressDetailProvider";
import RevealOnScroll from "./RevealOnScroll";

export default function ModelShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const { open: openDressDetail } = useDressDetail();
  const active = looks[activeIndex];
  const activeDress = dresses.find((d) => d.id === active.dressId);

  return (
    <section
      id="showcase"
      aria-labelledby="showcase-heading"
      className="bg-ink py-28 sm:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <RevealOnScroll className="mb-16 max-w-2xl">
          <p className="mb-5 text-xs tracking-[0.4em] text-accent-soft uppercase">
            Interactive Showcase
          </p>
          <h2
            id="showcase-heading"
            className="font-display text-4xl leading-tight text-ivory italic sm:text-5xl"
          >
            The same dress, four scenes
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ivory/60">
            Choose a scene to see how the collection holds up from entrance to
            exit. Each transition is a controlled sequence, not a live 3D
            render, so it stays fast on any device.
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div
            role="tablist"
            aria-label="Showcase scenes"
            className="flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:gap-2 lg:overflow-visible lg:pb-0"
          >
            {looks.map((look, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={look.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveIndex(i)}
                  className={`shrink-0 rounded-2xl border px-5 py-4 text-left transition-colors duration-300 lg:shrink ${
                    isActive
                      ? "border-accent bg-accent/10"
                      : "border-ivory/10 hover:border-ivory/30"
                  }`}
                >
                  <span
                    className={`font-display text-lg italic ${
                      isActive ? "text-ivory" : "text-ivory/70"
                    }`}
                  >
                    {look.title}
                  </span>
                  <span className="mt-1 block text-xs text-ivory/45">
                    {look.scene}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative aspect-4/5 w-full overflow-hidden rounded-[1.75rem] sm:aspect-16/10">
            <AnimatePresence mode={reduceMotion ? "sync" : "wait"} initial={false}>
              <motion.div
                key={active.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0.01 : 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                {activeDress && (
                  <Image
                    src={activeDress.image}
                    alt={activeDress.name}
                    fill
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className="object-cover object-top"
                    priority
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/30 to-ink/10" />
                <div className="relative flex h-full w-full flex-col justify-between p-8 sm:p-10">
                  <span className="w-fit rounded-full border border-ivory/30 px-4 py-1.5 text-xs tracking-[0.3em] text-ivory/80 uppercase">
                    {active.title}
                  </span>
                  {activeDress && (
                    <div>
                      <p className="font-display text-3xl text-ivory italic">
                        {activeDress.name}
                      </p>
                      <p className="mt-1 text-sm text-ivory/60">
                        {activeDress.descriptor}
                      </p>
                      <button
                        type="button"
                        onClick={() => openDressDetail(activeDress.id, "model_showcase")}
                        className="mt-4 inline-block text-sm tracking-wide text-ivory underline underline-offset-4 hover:text-accent-soft"
                      >
                        Explore the look
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
