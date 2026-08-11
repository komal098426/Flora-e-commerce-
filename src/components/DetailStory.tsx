import MeshGradient from "./MeshGradient";
import RevealOnScroll from "./RevealOnScroll";

const stages = [
  {
    id: "silhouette",
    label: "01 — Silhouette",
    title: "The line comes first",
    copy: "Every piece is draped directly on a form before a single seam is cut, so the finished silhouette holds its shape from the first fitting.",
    tone: ["#2a251f", "#948a7c"] as [string, string],
  },
  {
    id: "fabric",
    label: "02 — Fabric",
    title: "Fibres, chosen deliberately",
    copy: "Silk charmeuse, wool crepe, duchesse satin — each fabric is selected for how it falls and moves, not only how it photographs.",
    tone: ["#c9a86a", "#7a5c33"] as [string, string],
  },
  {
    id: "construction",
    label: "03 — Construction",
    title: "Finished by hand",
    copy: "French seams, hand-set pleats, and covered closures are standard, not optional — the inside of the garment is made to the same standard as the outside.",
    tone: ["#6e1423", "#2a0a10"] as [string, string],
  },
];

export default function DetailStory() {
  return (
    <section
      id="detail"
      aria-labelledby="detail-heading"
      className="bg-ivory py-28 sm:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <RevealOnScroll className="mb-16 max-w-2xl">
          <p className="mb-5 text-xs tracking-[0.4em] text-accent uppercase">
            Detail &amp; Material
          </p>
          <h2
            id="detail-heading"
            className="font-display text-4xl leading-tight text-ink italic sm:text-5xl"
          >
            What premium actually means here
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {stages.map((stage, i) => (
            <RevealOnScroll key={stage.id} delay={i * 0.12}>
              <div className="aspect-square w-full overflow-hidden rounded-2xl">
                <MeshGradient tone={stage.tone} className="h-full w-full">
                  <div className="flex h-full items-end p-6">
                    <span className="text-xs tracking-[0.3em] text-ivory/70 uppercase">
                      {stage.label}
                    </span>
                  </div>
                </MeshGradient>
              </div>
              <h3 className="mt-5 font-display text-2xl text-ink italic">
                {stage.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                {stage.copy}
              </p>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={0.2} className="mt-16 text-center">
          <a
            href="#contact"
            className="inline-block rounded-full border border-ink px-7 py-3.5 text-sm tracking-wide text-ink transition-colors hover:border-accent hover:text-accent"
          >
            Request a consultation
          </a>
        </RevealOnScroll>
      </div>
    </section>
  );
}
