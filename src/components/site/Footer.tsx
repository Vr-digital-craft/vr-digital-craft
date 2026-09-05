import { ArrowRight, Facebook, Instagram, Linkedin } from "lucide-react";
import { useSiteContent, useText } from "./content";

const allQuickLinks = [
  { label: "Accueil", href: "/", section: "hero" },
  { label: "Réalisations", href: "/realisations", section: "work" },
  { label: "Services", href: "/services", section: "services" },
  { label: "Tarifs", href: "/#tarifs", section: "pricing" },
  { label: "À propos", href: "/#a-propos", section: "why" },
  { label: "FAQ", href: "/#faq", section: "faq" },
];

export function Footer() {
  const t = useText();
  const { sections, services } = useSiteContent();
  const hidden = new Set(sections.filter((s) => !s.visible).map((s) => s.key));
  const quickLinks = allQuickLinks.filter((l) => !hidden.has(l.section));

  const socials = [
    { label: "Instagram", icon: Instagram, href: t("social_instagram") },
    { label: "Facebook", icon: Facebook, href: t("social_facebook") },
    { label: "LinkedIn", icon: Linkedin, href: t("social_linkedin") },
  ].filter((s) => s.href !== "");

  const phone = t("contact_phone", "0786181786");
  const email = t("contact_email", "vrdigital.contact@gmail.com");

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold tracking-tight">
                {t("brand_name", "VR")}
              </span>
              <span className="label-mono text-muted-foreground">
                {t("brand_suffix", "Digital")}
              </span>
            </p>
            <p className="text-muted-foreground mt-5 max-w-xs text-sm leading-relaxed">
              {t("footer_tagline", "Créateur de sites web pour les professionnels.")}
            </p>
            <ul className="mt-7 flex gap-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={s.label}
                    className="flex size-10 items-center justify-center rounded-md border border-border transition-all hover:border-neon hover:text-neon"
                  >
                    <s.icon className="size-4" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Liens rapides">
            <h2 className="label-mono text-neon text-[0.65rem]">Liens rapides</h2>
            <ul className="mt-6 space-y-3">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Services">
            <h2 className="label-mono text-neon text-[0.65rem]">Services</h2>
            <ul className="mt-6 space-y-3">
              {services.map((s) => (
                <li key={s.id}>
                  <a
                    href="/services"
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="label-mono text-neon text-[0.65rem]">Contact</h2>
            <ul className="text-muted-foreground mt-6 space-y-3 text-sm">
              <li>
                <a
                  href={`tel:${t("contact_phone_link", "+33786181786")}`}
                  className="transition-colors hover:text-foreground"
                >
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="break-all transition-colors hover:text-foreground"
                >
                  {email}
                </a>
              </li>
              <li>{t("contact_zone", "Toulouse & alentours")}</li>
            </ul>
            <a
              href="/#contact"
              className="group label-mono mt-8 inline-flex items-center gap-3 rounded-md bg-neon px-5 py-4 text-[0.65rem] text-primary-foreground transition-all hover:shadow-[var(--shadow-neon-strong)]"
            >
              {t("footer_cta", "Demander un devis")}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        <div className="text-muted-foreground mt-16 flex flex-col gap-4 border-t border-border pt-8 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>{t("footer_legal", "© VR Digital — Tous droits réservés")}</p>
          <ul className="flex flex-wrap gap-6">
            <li>
              <a href="/#contact" className="transition-colors hover:text-foreground">
                Mentions légales
              </a>
            </li>
            <li>
              <a href="/#contact" className="transition-colors hover:text-foreground">
                Politique de confidentialité
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
