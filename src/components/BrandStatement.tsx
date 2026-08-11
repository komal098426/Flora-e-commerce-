import Image from "next/image";
import RevealOnScroll from "./RevealOnScroll";

export default function BrandStatement() {
  return (
    <section
      id="story"
      aria-labelledby="story-heading"
      className="relative bg-ivory py-28 sm:py-36"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 sm:px-10 lg:grid-cols-2">
        <RevealOnScroll>
          <div className="relative aspect-4/5 w-full overflow-hidden rounded-3xl bg-ink/5">
            <Image
              src="/story-black-gold-gown.jpg"
              alt="Model in a black velvet off-shoulder gown with hand-beaded gold floral embroidery and a thigh-high slit, in the studio"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover object-top"
            />
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/80 via-ink/15 to-transparent p-8 pt-20">
              <p className="text-xs tracking-[0.3em] text-ivory/80 uppercase">
                Studio, Atelier No. 4
              </p>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <p className="mb-5 text-xs tracking-[0.4em] text-accent uppercase">
            The Philosophy
          </p>
          <h2
            id="story-heading"
            className="font-display text-4xl leading-tight text-ink italic sm:text-5xl"
          >
            &ldquo;A dress should move before it is seen.&rdquo;
          </h2>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-ink/70">
            <p>
              Every piece begins on the body, not the sketch. We drape first,
              draft second — a discipline that means our silhouettes hold
              their shape in a room the way they do on a hanger.
            </p>
            <p>
              We work in small runs from natural fibres — silk, wool crepe,
              duchesse satin — finished by hand in our studio. Nothing leaves
              the atelier until it moves the way it was designed to.
            </p>
          </div>
          <a
            href="#collection"
            className="mt-8 inline-block text-sm tracking-wide text-ink underline decoration-accent underline-offset-4 transition-colors hover:text-accent"
          >
            See the current collection
          </a>
        </RevealOnScroll>
      </div>
    </section>
  );
}
