"use client";

import {
  CalendarCheck,
  CheckCircle2,
  MessageCircle,
  Ruler,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import {
  buildConciergeMessage,
  buildWhatsAppLink,
  isWhatsAppConfigured,
  type ConciergeIntent,
} from "@/lib/whatsapp";
import RevealOnScroll from "./RevealOnScroll";

const INTENTS: {
  key: ConciergeIntent;
  label: string;
  hint: string;
  icon: typeof ShoppingBag;
}[] = [
  { key: "order", label: "Order a dress", hint: "Start an order on a piece you love", icon: ShoppingBag },
  { key: "availability", label: "Check availability", hint: "Confirm stock, size, or colour", icon: CheckCircle2 },
  { key: "size", label: "Size & fit", hint: "Get help choosing your size", icon: Ruler },
  { key: "styling", label: "Styling advice", hint: "Find the right piece for your occasion", icon: Sparkles },
  { key: "delivery", label: "Delivery & timing", hint: "Ask about shipping and lead times", icon: Truck },
  { key: "appointment", label: "Private appointment", hint: "Arrange a one-to-one consultation", icon: CalendarCheck },
];

export default function Concierge() {
  const configured = isWhatsAppConfigured();
  const generalLink = buildWhatsAppLink(buildConciergeMessage("general"));

  useEffect(() => {
    trackEvent("concierge_viewed");
  }, []);

  function handleClick(intent: ConciergeIntent) {
    trackEvent("concierge_cta_clicked", { intent });
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
            The Atelier Is Available
          </p>
          <h2
            id="contact-heading"
            className="font-display text-4xl leading-tight text-ivory italic sm:text-5xl"
          >
            A considered choice, made personal.
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ivory/60">
            Speak with our atelier team about sizing, availability, styling, and delivery.
            We&rsquo;ll help you find the piece that feels entirely yours.
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
              Explore the collection
            </a>{" "}
            — opens the full lookbook on this page.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <div className="glass-stage rounded-2xl p-6 sm:p-8">
            {!configured ? (
              <p className="text-sm leading-relaxed text-ivory/70">
                WhatsApp concierge isn&rsquo;t connected yet. Please email{" "}
                <a
                  href="mailto:atelier@floradahlia.example"
                  className="text-ivory underline underline-offset-4 hover:text-accent-soft"
                >
                  atelier@floradahlia.example
                </a>{" "}
                and our team will help directly.
              </p>
            ) : (
              <>
                <a
                  href={generalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleClick("general")}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ivory px-6 py-4 text-sm tracking-wide text-ink transition-colors hover:bg-accent hover:text-ivory"
                >
                  <MessageCircle size={18} />
                  Chat with the Atelier on WhatsApp
                </a>
                <p className="mt-3 text-center text-xs tracking-wide text-ivory/45">
                  Personal guidance · Availability checks · Delivery assistance
                </p>

                <div className="mt-8 border-t border-ivory/10 pt-8">
                  <p className="mb-4 text-xs tracking-[0.3em] text-ivory/40 uppercase">
                    Or start with a specific question
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {INTENTS.map(({ key, label, hint, icon: Icon }) => (
                      <a
                        key={key}
                        href={buildWhatsAppLink(buildConciergeMessage(key))}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleClick(key)}
                        className="group flex items-start gap-3 rounded-xl border border-ivory/10 px-4 py-3.5 transition-colors hover:border-accent hover:bg-accent/10"
                      >
                        <Icon size={18} className="mt-0.5 shrink-0 text-accent-soft" />
                        <span>
                          <span className="block text-sm text-ivory group-hover:text-ivory">
                            {label}
                          </span>
                          <span className="mt-0.5 block text-xs text-ivory/45">{hint}</span>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                <p className="mt-6 text-xs leading-relaxed text-ivory/40">
                  Opening WhatsApp never confirms an order or payment by itself — the Atelier
                  team will follow up there to arrange availability, delivery, and payment.
                </p>
              </>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
