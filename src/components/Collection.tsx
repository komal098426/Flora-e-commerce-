"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { dresses } from "@/lib/dresses";
import { trackEvent } from "@/lib/analytics";
import { buildEnquiryMessage, buildWhatsAppLink, isWhatsAppConfigured } from "@/lib/whatsapp";
import { useDressDetail } from "./DressDetailProvider";
import RevealOnScroll from "./RevealOnScroll";

export default function Collection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const { open: openDressDetail } = useDressDetail();
  const whatsappReady = isWhatsAppConfigured();

  return (
    <section
      id="collection"
      aria-labelledby="collection-heading"
      className="bg-ivory-deep py-28 sm:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <RevealOnScroll className="mb-16 max-w-2xl">
          <p className="mb-5 text-xs tracking-[0.4em] text-accent uppercase">
            Featured Collection
          </p>
          <h2
            id="collection-heading"
            className="font-display text-4xl leading-tight text-ink italic sm:text-5xl"
          >
            The collection, considered closely
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink/70">
            Each piece is hand-finished in limited number. Select a gown to
            see construction notes, or enquire directly for availability and
            fitting.
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {dresses.map((dress, i) => {
            const open = openId === dress.id;
            return (
              <RevealOnScroll key={dress.id} delay={(i % 3) * 0.08}>
                <article className="group">
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : dress.id)}
                    aria-expanded={open}
                    aria-controls={`dress-detail-${dress.id}`}
                    className="block w-full text-left"
                  >
                    <div className="aspect-4/5 w-full overflow-hidden rounded-2xl bg-ink/5">
                      <motion.div
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="relative h-full w-full"
                      >
                        <Image
                          src={dress.image}
                          alt={`${dress.name} — ${dress.descriptor}`}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover object-top"
                        />
                      </motion.div>
                    </div>
                    <div className="mt-5 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-2xl text-ink italic">
                          {dress.name}
                        </h3>
                        <p className="mt-1 text-sm text-ink/60">
                          {dress.descriptor}
                        </p>
                      </div>
                      <span
                        aria-hidden
                        className={`mt-2 shrink-0 text-lg text-ink/40 transition-transform duration-300 ${
                          open ? "rotate-45" : ""
                        }`}
                      >
                        +
                      </span>
                    </div>
                  </button>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs tracking-wide text-ink/50 uppercase">
                        {dress.price}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] tracking-wide uppercase ${
                          dress.availability === "Limited availability"
                            ? "bg-accent/10 text-accent"
                            : "bg-ink/5 text-ink/50"
                        }`}
                      >
                        {dress.availability}
                      </span>
                    </div>
                    {whatsappReady && (
                      <button
                        type="button"
                        onClick={() => {
                          // Computed on click, not during render: the message embeds
                          // the current page URL via window.location, which is only
                          // available client-side. Building it at render time would
                          // make the SSR-rendered href empty and the client's first
                          // paint non-empty — a hydration mismatch.
                          trackEvent("whatsapp_cta_clicked", {
                            dressId: dress.id,
                            mode: "ask",
                            source: "collection_card",
                          });
                          window.open(
                            buildWhatsAppLink(buildEnquiryMessage(dress)),
                            "_blank",
                            "noopener,noreferrer",
                          );
                        }}
                        className="inline-flex items-center gap-1.5 text-xs tracking-wide text-ink/60 underline underline-offset-4 transition-colors hover:text-ink"
                      >
                        <MessageCircle size={13} aria-hidden />
                        Ask on WhatsApp
                      </button>
                    )}
                  </div>

                  <motion.div
                    id={`dress-detail-${dress.id}`}
                    initial={false}
                    animate={{
                      height: open ? "auto" : 0,
                      opacity: open ? 1 : 0,
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="mt-4 text-sm leading-relaxed text-ink/70">
                      {dress.detail}
                    </p>
                    <div className="mt-4 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => openDressDetail(dress.id, "collection_card")}
                        className="text-sm tracking-wide text-accent underline underline-offset-4"
                      >
                        View piece &amp; order via WhatsApp
                      </button>
                    </div>
                  </motion.div>
                </article>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
