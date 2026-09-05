import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteContent, useText } from "./content";

const allLinks = [
  { label: "Home", href: "/", section: "hero" },
  { label: "Réalisations", href: "/realisations", section: "work" },
  { label: "Services", href: "/services", section: "services" },
  { label: "À propos", href: "/#a-propos", section: "why" },
  { label: "Tarifs", href: "/#tarifs", section: "pricing" },
  { label: "FAQ", href: "/#faq", section: "faq" },
];

export function Header() {
  const t = useText();
  const { sections } = useSiteContent();
  const hidden = new Set(sections.filter((s) => !s.visible).map((s) => s.key));
  const links = allLinks.filter((l) => !hidden.has(l.section));

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const brand = t("brand_name", "VR");
  const suffix = t("brand_suffix", "Digital");

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-border bg-background/70 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:py-5">
        <a
          href="/"
          className="group flex items-baseline gap-2"
          aria-label={`${brand} ${suffix}, accueil`}
        >
          <span className="font-display text-xl font-bold tracking-tight sm:text-2xl">{brand}</span>
          <span className="label-mono text-muted-foreground transition-colors group-hover:text-neon">
            {suffix}
          </span>
        </a>

        <nav className="hidden items-center gap-9 lg:flex" aria-label="Navigation principale">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="label-mono text-muted-foreground transition-colors hover:text-neon"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          className="flex size-11 items-center justify-center rounded-md border border-border text-foreground transition-all hover:border-neon hover:text-neon"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl transition-all duration-500",
          open ? "max-h-[70vh]" : "max-h-0 border-transparent",
        )}
      >
        <nav className="mx-auto flex max-w-7xl flex-col px-5 py-4 sm:px-8" aria-label="Menu">
          {[...links, { label: "Contact", href: "/#contact", section: "contact" }]
            .filter((l) => !hidden.has(l.section))
            .map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-display border-b border-border py-4 text-2xl font-medium tracking-tight transition-colors last:border-0 hover:text-neon"
              >
                {l.label}
              </a>
            ))}
        </nav>
      </div>
    </header>
  );
}
