"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown, Copy, Minus, MessageCircle, Plus, Share2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import {
  CARE_INSTRUCTIONS,
  CUSTOMISATION_NOTE,
  DELIVERY_INFO,
  type Dress,
} from "@/lib/dresses";
import { trackEvent } from "@/lib/analytics";
import {
  buildEnquiryMessage,
  buildOrderMessage,
  buildWhatsAppLink,
  isWhatsAppConfigured,
} from "@/lib/whatsapp";

const EASE = [0.16, 1, 0.3, 1] as const;

type SectionId = "description" | "delivery" | "care";
type HandoffMode = "order" | "ask";

export default function DressDetailModal({
  dress,
  source,
  onClose,
}: {
  dress: Dress;
  source: string;
  onClose: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const orderPanelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Set<SectionId>>(new Set(["description"]));
  const [quantity, setQuantity] = useState(1);
  const [handoffMode, setHandoffMode] = useState<HandoffMode | null>(null);
  const [hasViewedSummary, setHasViewedSummary] = useState(false);

  const orderReady = selectedSize !== null && selectedSize !== "Not sure yet";

  const orderMessage = useMemo(
    () => buildOrderMessage({ dress, size: selectedSize, quantity }),
    [dress, selectedSize, quantity],
  );
  const enquiryMessage = useMemo(() => buildEnquiryMessage(dress), [dress]);
  const orderLink = useMemo(() => buildWhatsAppLink(orderMessage), [orderMessage]);
  const enquiryLink = useMemo(() => buildWhatsAppLink(enquiryMessage), [enquiryMessage]);

  // Body scroll lock + focus management: this modal only ever mounts client-side
  // in response to a user click, so there is no SSR HTML to match — safe to
  // read the DOM directly on mount.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  function handleTabTrap(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function toggleSection(id: SectionId) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        trackEvent("dress_info_expanded", { dressId: dress.id, section: id });
      }
      return next;
    });
  }

  function selectSize(size: string) {
    setSelectedSize(size);
    trackEvent("variant_selected", { dressId: dress.id, variantType: "size", label: size });
  }

  function changeQuantity(next: number) {
    const clamped = Math.min(5, Math.max(1, next));
    setQuantity(clamped);
    trackEvent("variant_selected", { dressId: dress.id, variantType: "quantity", label: clamped });
  }

  function scrollToOrderPanel() {
    if (!hasViewedSummary) {
      setHasViewedSummary(true);
      trackEvent("order_summary_viewed", {
        dressId: dress.id,
        source,
        variantComplete: orderReady,
      });
    }
    orderPanelRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  function handleWhatsAppClick(mode: HandoffMode) {
    setHandoffMode(mode);
    trackEvent("whatsapp_cta_clicked", {
      dressId: dress.id,
      mode,
      size: selectedSize ?? "not_specified",
      quantity: mode === "order" ? quantity : undefined,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0.01 : 0.25 }}
      className="fixed inset-0 z-100 flex items-center justify-center bg-ink/70 backdrop-blur-sm sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={handleTabTrap}
        initial={{ opacity: 0, y: reduceMotion ? 0 : 24, scale: reduceMotion ? 1 : 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: reduceMotion ? 0 : 24, scale: reduceMotion ? 1 : 0.98 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.4, ease: EASE }}
        className="relative flex h-full w-full flex-col overflow-y-auto bg-ivory outline-none sm:h-auto sm:max-h-[90vh] sm:max-w-5xl sm:rounded-3xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dress details"
          className="sticky top-4 z-20 ml-auto mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/80 text-ivory backdrop-blur-sm transition-colors hover:bg-accent"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 gap-0 px-0 pt-0 lg:grid-cols-2 lg:gap-10 lg:px-10 lg:pt-2 -mt-14">
          <div className="relative aspect-4/5 w-full overflow-hidden bg-ink/5 lg:aspect-auto lg:rounded-2xl">
            <Image
              src={dress.image}
              alt={`${dress.name} — ${dress.descriptor}`}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover object-top"
              priority
            />
          </div>

          <div className="px-6 pb-6 pt-6 sm:px-10 lg:px-0 lg:pb-10">
            <p className="mb-2 text-xs tracking-[0.3em] text-accent uppercase">
              {dress.productReference}
            </p>
            <h2 id={titleId} className="font-display text-4xl italic text-ink">
              {dress.name}
            </h2>
            <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
              <p className="text-base text-ink/70">{dress.descriptor}</p>
              <ShareButton dressId={dress.id} />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="text-lg text-ink">{dress.price}</span>
              <span
                className={`rounded-full px-3 py-1 text-xs tracking-wide uppercase ${
                  dress.availability === "Limited availability"
                    ? "bg-accent/10 text-accent"
                    : "bg-ink/5 text-ink/60"
                }`}
              >
                {dress.availability}
              </span>
            </div>
            {dress.availabilityNote && (
              <p className="mt-2 text-sm text-ink/60">{dress.availabilityNote}</p>
            )}

            <div className="mt-6">
              <p className="mb-2 text-xs tracking-wide text-ink/50 uppercase">Size</p>
              <div className="flex flex-wrap gap-2">
                {dress.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => selectSize(size)}
                    aria-pressed={selectedSize === size}
                    className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                      selectedSize === size
                        ? "border-ink bg-ink text-ivory"
                        : "border-ink/20 text-ink/70 hover:border-ink"
                    }`}
                  >
                    {size}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => selectSize("Not sure yet")}
                  aria-pressed={selectedSize === "Not sure yet"}
                  className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                    selectedSize === "Not sure yet"
                      ? "border-ink bg-ink text-ivory"
                      : "border-ink/20 text-ink/70 hover:border-ink"
                  }`}
                >
                  Not sure yet
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={scrollToOrderPanel}
              className="mt-7 w-full rounded-full bg-ink px-6 py-3.5 text-sm tracking-wide text-ivory transition-colors hover:bg-accent sm:w-auto"
            >
              Order via WhatsApp
            </button>

            <div className="mt-10 space-y-3 border-t border-ink/10 pt-6">
              <AccordionSection
                title="Description & craftsmanship"
                open={openSections.has("description")}
                onToggle={() => toggleSection("description")}
                reduceMotion={!!reduceMotion}
              >
                <dl className="space-y-4 text-sm text-ink/70">
                  <div>
                    <dt className="text-xs tracking-wide text-ink/40 uppercase">Fabric</dt>
                    <dd className="mt-1">{dress.fabric}</dd>
                  </div>
                  <div>
                    <dt className="text-xs tracking-wide text-ink/40 uppercase">Construction</dt>
                    <dd className="mt-1">{dress.construction}</dd>
                  </div>
                  <div>
                    <dt className="text-xs tracking-wide text-ink/40 uppercase">Fit &amp; silhouette</dt>
                    <dd className="mt-1">{dress.fit}</dd>
                  </div>
                  <div>
                    <dt className="text-xs tracking-wide text-ink/40 uppercase">Customisation</dt>
                    <dd className="mt-1">{CUSTOMISATION_NOTE}</dd>
                  </div>
                </dl>
              </AccordionSection>

              <AccordionSection
                title="Delivery & fulfilment"
                open={openSections.has("delivery")}
                onToggle={() => toggleSection("delivery")}
                reduceMotion={!!reduceMotion}
              >
                <dl className="space-y-4 text-sm text-ink/70">
                  <div>
                    <dt className="text-xs tracking-wide text-ink/40 uppercase">Preparation time</dt>
                    <dd className="mt-1">
                      {dress.leadTime}, made to order. Confirmed after your enquiry.
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs tracking-wide text-ink/40 uppercase">Delivery regions</dt>
                    <dd className="mt-1">{DELIVERY_INFO.regions}</dd>
                  </div>
                  <div>
                    <dt className="text-xs tracking-wide text-ink/40 uppercase">Method</dt>
                    <dd className="mt-1">{DELIVERY_INFO.method}</dd>
                  </div>
                  <div>
                    <dt className="text-xs tracking-wide text-ink/40 uppercase">Cost</dt>
                    <dd className="mt-1">{DELIVERY_INFO.cost}</dd>
                  </div>
                  <div>
                    <dt className="text-xs tracking-wide text-ink/40 uppercase">Returns &amp; alterations</dt>
                    <dd className="mt-1">{DELIVERY_INFO.returns}</dd>
                  </div>
                </dl>
              </AccordionSection>

              <AccordionSection
                title="Care instructions"
                open={openSections.has("care")}
                onToggle={() => toggleSection("care")}
                reduceMotion={!!reduceMotion}
              >
                <p className="text-sm text-ink/70">{dress.careNote}</p>
                <ul className="mt-3 space-y-2 text-sm text-ink/70">
                  {CARE_INSTRUCTIONS.map((line) => (
                    <li key={line} className="flex gap-2">
                      <span aria-hidden className="text-accent">•</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </AccordionSection>
            </div>

            <OrderPanel
              panelRef={orderPanelRef}
              dress={dress}
              selectedSize={selectedSize}
              orderReady={orderReady}
              quantity={quantity}
              onChangeQuantity={changeQuantity}
              handoffMode={handoffMode}
              orderLink={orderLink}
              enquiryLink={enquiryLink}
              orderMessage={orderMessage}
              enquiryMessage={enquiryMessage}
              onWhatsAppClick={handleWhatsAppClick}
              onChangeSelection={() => setHandoffMode(null)}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AccordionSection({
  title,
  open,
  onToggle,
  reduceMotion,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  reduceMotion: boolean;
  children: React.ReactNode;
}) {
  const contentId = useId();
  return (
    <div className="border-b border-ink/10 pb-3">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={contentId}
        className="flex w-full items-center justify-between py-2 text-left"
      >
        <span className="font-display text-lg italic text-ink">{title}</span>
        <ChevronDown
          aria-hidden
          size={18}
          className={`text-ink/50 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <motion.div
        id={contentId}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.35, ease: EASE }}
        className="overflow-hidden"
      >
        <div className="pt-3 pb-1">{children}</div>
      </motion.div>
    </div>
  );
}

function ShareButton({ dressId }: { dressId: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      trackEvent("product_shared", { dressId, channel: "copy_link" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — nothing to fall back to here.
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={copied ? "Link copied" : "Copy link to this piece"}
      className="mt-1 flex shrink-0 items-center gap-1.5 text-xs tracking-wide text-ink/50 transition-colors hover:text-ink"
    >
      {copied ? <Check size={13} /> : <Share2 size={13} />}
      {copied ? "Copied" : "Share"}
    </button>
  );
}

function CopyMessageButton({ message }: { message: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — the message is still visible for manual selection.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 text-sm text-ink/60 underline underline-offset-4 transition-colors hover:text-ink"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Copied" : "Copy message instead"}
    </button>
  );
}

function OrderPanel({
  panelRef,
  dress,
  selectedSize,
  orderReady,
  quantity,
  onChangeQuantity,
  handoffMode,
  orderLink,
  enquiryLink,
  orderMessage,
  enquiryMessage,
  onWhatsAppClick,
  onChangeSelection,
}: {
  panelRef: React.RefObject<HTMLDivElement | null>;
  dress: Dress;
  selectedSize: string | null;
  orderReady: boolean;
  quantity: number;
  onChangeQuantity: (next: number) => void;
  handoffMode: HandoffMode | null;
  orderLink: string;
  enquiryLink: string;
  orderMessage: string;
  enquiryMessage: string;
  onWhatsAppClick: (mode: HandoffMode) => void;
  onChangeSelection: () => void;
}) {
  const configured = isWhatsAppConfigured();

  if (handoffMode) {
    const link = handoffMode === "order" ? orderLink : enquiryLink;
    const message = handoffMode === "order" ? orderMessage : enquiryMessage;
    return (
      <div
        ref={panelRef}
        aria-live="polite"
        className="mt-10 scroll-mt-6 rounded-2xl border border-ink/10 bg-ink/3 p-6 sm:p-8"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-ivory">
          <Check size={18} />
        </div>
        <h3 className="mt-4 font-display text-2xl italic text-ink">
          Your {handoffMode === "order" ? "order details are" : "enquiry is"} ready in WhatsApp
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/70">
          Review the message, send it to the Atelier team, and they will confirm availability,
          delivery, and payment. Opening a WhatsApp link never confirms an order or payment by
          itself.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-ink px-6 py-3 text-sm tracking-wide text-ivory transition-colors hover:bg-accent"
          >
            Open WhatsApp again
          </a>
          <CopyMessageButton message={message} />
        </div>
        <button
          type="button"
          onClick={onChangeSelection}
          className="mt-5 block text-sm tracking-wide text-ink/50 underline underline-offset-4 hover:text-ink"
        >
          Change selection
        </button>
      </div>
    );
  }

  return (
    <div ref={panelRef} className="mt-10 scroll-mt-6 border-t border-ink/10 pt-8">
      <h3 className="font-display text-2xl italic text-ink">Order this piece</h3>
      <p className="mt-2 text-sm text-ink/60">
        Review your selection, then continue in WhatsApp — the Atelier team will confirm
        availability, delivery, and payment there.
      </p>

      <div className="mt-5">
        <p className="mb-2 text-xs tracking-wide text-ink/50 uppercase">Quantity</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onChangeQuantity(quantity - 1)}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:border-ink disabled:opacity-30"
          >
            <Minus size={14} />
          </button>
          <span className="w-6 text-center text-sm text-ink" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => onChangeQuantity(quantity + 1)}
            disabled={quantity >= 5}
            aria-label="Increase quantity"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:border-ink disabled:opacity-30"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 rounded-xl bg-ink/4 px-5 py-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs tracking-wide text-ink/40 uppercase">Product</dt>
          <dd className="mt-1 text-ink">{dress.name}</dd>
        </div>
        <div>
          <dt className="text-xs tracking-wide text-ink/40 uppercase">Reference</dt>
          <dd className="mt-1 text-ink">{dress.productReference}</dd>
        </div>
        <div>
          <dt className="text-xs tracking-wide text-ink/40 uppercase">Size</dt>
          <dd className="mt-1 text-ink">{selectedSize ?? "Not selected"}</dd>
        </div>
        <div>
          <dt className="text-xs tracking-wide text-ink/40 uppercase">Quantity</dt>
          <dd className="mt-1 text-ink">{quantity}</dd>
        </div>
        <div>
          <dt className="text-xs tracking-wide text-ink/40 uppercase">Price</dt>
          <dd className="mt-1 text-ink">{dress.price}</dd>
        </div>
        <div className="col-span-2 sm:col-span-3">
          <dt className="text-xs tracking-wide text-ink/40 uppercase">Delivery</dt>
          <dd className="mt-1 text-ink/70">
            Delivery and final availability confirmed in WhatsApp.
          </dd>
        </div>
      </dl>

      {!configured ? (
        <p className="mt-5 text-sm text-accent">
          WhatsApp ordering isn&rsquo;t connected yet. Please email{" "}
          <a href="mailto:atelier@floradahlia.example" className="underline underline-offset-4">
            atelier@floradahlia.example
          </a>{" "}
          with the piece reference {dress.productReference} and we&rsquo;ll help directly.
        </p>
      ) : (
        <>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href={orderReady ? orderLink : undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!orderReady}
              aria-describedby={!orderReady ? "order-disabled-hint" : undefined}
              onClick={(e) => {
                if (!orderReady) {
                  e.preventDefault();
                  return;
                }
                onWhatsAppClick("order");
              }}
              className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm tracking-wide transition-colors ${
                orderReady
                  ? "bg-ink text-ivory hover:bg-accent"
                  : "cursor-not-allowed bg-ink/20 text-ink/40"
              }`}
            >
              <MessageCircle size={16} />
              Order via WhatsApp
            </a>
            <a
              href={enquiryLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onWhatsAppClick("ask")}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ink px-6 py-3.5 text-sm tracking-wide text-ink transition-colors hover:border-accent hover:text-accent"
            >
              Ask About This Piece
            </a>
          </div>
          {!orderReady && (
            <p id="order-disabled-hint" className="mt-3 text-xs text-ink/50">
              Select a size above to enable direct ordering, or ask us about this piece first.
            </p>
          )}
          <p className="mt-4 text-xs leading-relaxed text-ink/40">
            You&rsquo;ll continue this conversation in WhatsApp with the Atelier team, who will
            confirm final availability, delivery, and payment there.
          </p>
        </>
      )}
    </div>
  );
}
