"use client";

import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { dresses } from "@/lib/dresses";
import RevealOnScroll from "./RevealOnScroll";

type Status = "idle" | "loading" | "success" | "error";

export default function Conversion() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      // No backend is wired up yet — this simulates the round trip so the
      // interaction and states are demonstrable end to end.
      await new Promise((resolve) => setTimeout(resolve, 900));
      if (!data.get("email")) throw new Error("missing email");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden bg-ink py-28 sm:py-36"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 sm:px-10 lg:grid-cols-2">
        <RevealOnScroll>
          <p className="mb-5 text-xs tracking-[0.4em] text-accent-soft uppercase">
            Book a Fitting
          </p>
          <h2
            id="contact-heading"
            className="font-display text-4xl leading-tight text-ivory italic sm:text-5xl"
          >
            Let&rsquo;s find your dress
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ivory/60">
            Send a short enquiry and our studio will reply within two
            business days to arrange a private fitting or answer questions
            about a specific piece.
          </p>

          <dl className="mt-10 space-y-3 text-sm text-ivory/70">
            <div className="flex gap-3">
              <dt className="text-ivory/40">Studio</dt>
              <dd>By appointment, Tuesday–Saturday</dd>
            </div>
            <div className="flex gap-3">
              <dt className="text-ivory/40">Email</dt>
              <dd>
                <a
                  href="mailto:atelier@floradahlia.example"
                  className="underline underline-offset-4 hover:text-accent-soft"
                >
                  atelier@floradahlia.example
                </a>
              </dd>
            </div>
          </dl>

          <p className="mt-8 text-sm text-ivory/50">
            Prefer to browse first?{" "}
            <a
              href="#collection"
              className="text-ivory underline underline-offset-4 hover:text-accent-soft"
            >
              Shop the collection
            </a>{" "}
            — opens the full lookbook on this page.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-2xl border border-ivory/10 bg-ivory/5 p-6 sm:p-8"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label htmlFor="name" className="block text-xs tracking-wide text-ivory/60 uppercase">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className="mt-2 w-full rounded-lg border border-ivory/20 bg-transparent px-3.5 py-2.5 text-ivory placeholder:text-ivory/30 focus-visible:border-accent"
                  placeholder="Your full name"
                />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="email" className="block text-xs tracking-wide text-ivory/60 uppercase">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="mt-2 w-full rounded-lg border border-ivory/20 bg-transparent px-3.5 py-2.5 text-ivory placeholder:text-ivory/30 focus-visible:border-accent"
                  placeholder="you@example.com"
                />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="date" className="block text-xs tracking-wide text-ivory/60 uppercase">
                  Preferred date
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  className="mt-2 w-full rounded-lg border border-ivory/20 bg-transparent px-3.5 py-2.5 text-ivory focus-visible:border-accent [color-scheme:dark]"
                />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="dress" className="block text-xs tracking-wide text-ivory/60 uppercase">
                  Dress of interest
                </label>
                <select
                  id="dress"
                  name="dress"
                  defaultValue=""
                  className="mt-2 w-full rounded-lg border border-ivory/20 bg-ink px-3.5 py-2.5 text-ivory focus-visible:border-accent"
                >
                  <option value="">No preference</option>
                  {dresses.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="message" className="block text-xs tracking-wide text-ivory/60 uppercase">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="mt-2 w-full resize-none rounded-lg border border-ivory/20 bg-transparent px-3.5 py-2.5 text-ivory placeholder:text-ivory/30 focus-visible:border-accent"
                  placeholder="Tell us about the occasion, sizing, or anything else"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={status === "loading"}
              whileTap={{ scale: 0.98 }}
              className="mt-6 w-full rounded-full bg-ivory px-6 py-3.5 text-sm tracking-wide text-ink transition-colors hover:bg-accent hover:text-ivory disabled:opacity-60"
            >
              {status === "loading" ? "Sending…" : "Send enquiry"}
            </motion.button>

            <div aria-live="polite" className="mt-4 min-h-[1.25rem] text-sm">
              {status === "success" && (
                <p className="text-emerald-400">
                  Thank you — your enquiry has been received. We&rsquo;ll reply within two business days.
                </p>
              )}
              {status === "error" && (
                <p className="text-accent-light">
                  Something went wrong sending that. Please try again or email us directly.
                </p>
              )}
            </div>
          </form>
        </RevealOnScroll>
      </div>
    </section>
  );
}
