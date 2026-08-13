import Image from "next/image";
import RevealOnScroll from "./RevealOnScroll";

const stages = [
  {
    id: "silhouette",
    label: "01 — Silhouette",
    title: "The line comes first",
    copy: "Every piece is draped directly on a form before a single seam is cut, so the finished silhouette holds its shape from the first fitting.",
    image: "/dresses/29cbf934-9be2-4874-aaee-deca828dd50b.jpg",
    alt: "Pearl Cascade Gown — ivory satin ball gown with pearl and crystal embroidery",
  },
  {
    id: "fabric",
    label: "02 — Fabric",
    title: "Fibres, chosen deliberately",
    copy: "Silk charmeuse, wool crepe, duchesse satin — each fabric is selected for how it falls and moves, not only how it photographs.",
    image: "/dresses/37c7158c-2e8a-41e1-8126-3373bff96cce.jpg",
    alt: "Silk Flora Skirt — luminous champagne satin A-line skirt with trailing floral embroidery",
  },
  {
    id: "construction",
    label: "03 — Construction",
    title: "Finished by hand",
    copy: "French seams, hand-set pleats, and covered closures are standard, not optional — the inside of the garment is made to the same standard as the outside.",
    image: "/dresses/405c352a-baac-45c4-b39c-d5aa34dbde4a.jpg",
    alt: "Azure Tulip Gown — white and powder blue mermaid gown with sculpted tulip appliqué",
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
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
                <Image
                  src={stage.image}
                  alt={stage.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink/70 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="text-xs tracking-[0.3em] text-ivory/80 uppercase">
                    {stage.label}
                  </span>
                </div>
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
