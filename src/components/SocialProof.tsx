import { testimonials } from "@/lib/dresses";
import RevealOnScroll from "./RevealOnScroll";

export default function SocialProof() {
  return (
    <section
      aria-labelledby="proof-heading"
      className="bg-ivory-deep py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <h2 id="proof-heading" className="sr-only">
          What clients and press say
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <RevealOnScroll key={t.id} delay={i * 0.1}>
              <blockquote className="flex h-full flex-col justify-between rounded-2xl border border-ink/10 bg-ivory p-8">
                <p className="font-display text-xl leading-snug text-ink italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="mt-6 text-sm text-ink/60">
                  <span className="font-medium text-ink">{t.attribution}</span>
                  <span className="block text-xs tracking-wide text-ink/40 uppercase">
                    {t.role}
                  </span>
                </footer>
              </blockquote>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
