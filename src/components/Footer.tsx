import { Camera, Mail, MapPin } from "lucide-react";

const FOOTER_LINKS = [
  { href: "#story", label: "Story" },
  { href: "#collection", label: "Collection" },
  { href: "#showcase", label: "Showcase" },
  { href: "#contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="bg-ink py-16 text-ivory/60">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <p className="font-display text-xl tracking-[0.25em] text-ivory uppercase">
              Maison Verre
            </p>
            <p className="mt-3 max-w-xs text-sm">
              Dresses cut, draped, and finished by hand in a small studio.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="text-xs tracking-[0.3em] text-ivory/40 uppercase">Site</p>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm hover:text-ivory">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-xs tracking-[0.3em] text-ivory/40 uppercase">Connect</p>
            <div className="mt-4 flex gap-4">
              <a
                href="mailto:atelier@maisonverre.example"
                aria-label="Email"
                className="rounded-full border border-ivory/20 p-2.5 hover:border-ivory hover:text-ivory"
              >
                <Mail size={16} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="rounded-full border border-ivory/20 p-2.5 hover:border-ivory hover:text-ivory"
              >
                <Camera size={16} />
              </a>
              <a
                href="#"
                aria-label="Studio location"
                className="rounded-full border border-ivory/20 p-2.5 hover:border-ivory hover:text-ivory"
              >
                <MapPin size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-ivory/10 pt-6 text-xs text-ivory/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Maison Verre. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-ivory/70">Privacy</a>
            <a href="#" className="hover:text-ivory/70">Accessibility statement</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
