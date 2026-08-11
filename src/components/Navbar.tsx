"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "#story", label: "Story" },
  { href: "#collection", label: "Collection" },
  { href: "#showcase", label: "Showcase" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 backdrop-blur-md transition-colors duration-500 ${
        scrolled
          ? "border-b border-ink/10 bg-ivory/85"
          : "border-b border-ivory/10 bg-ink/15"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-10">
        <a
          href="#top"
          className={`font-display text-xl tracking-[0.25em] uppercase transition-colors duration-500 ${
            scrolled ? "text-ink" : "text-ivory"
          }`}
        >
          Maison Verre
        </a>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-10 md:flex"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm tracking-wide transition-colors hover:text-accent ${
                scrolled ? "text-ink/80" : "text-ivory/85"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className={`rounded-full px-5 py-2.5 text-sm tracking-wide transition-colors ${
              scrolled
                ? "bg-ink text-ivory hover:bg-accent"
                : "bg-ivory text-ink hover:bg-accent hover:text-ivory"
            }`}
          >
            Book a fitting
          </a>
        </nav>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
          className={`flex h-10 w-10 items-center justify-center transition-colors duration-500 md:hidden ${
            scrolled ? "text-ink" : "text-ivory"
          }`}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="border-b border-ink/10 bg-ivory md:hidden"
          >
            <nav
              aria-label="Mobile"
              className="flex flex-col gap-1 px-6 py-6"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-2 py-3 text-lg text-ink transition-colors hover:bg-ink/5"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="mt-3 rounded-full bg-ink px-5 py-3 text-center text-sm tracking-wide text-ivory"
              >
                Book a fitting
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
