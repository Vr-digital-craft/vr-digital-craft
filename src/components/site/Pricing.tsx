import { Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { useSiteContent, useText } from "./content";

export function Pricing() {
  const t = useText();
  const { pricing } = useSiteContent();

  return (
    <section id="tarifs" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-36">
      <SectionHeading
        eyebrow={t("pricing_eyebrow", "Tarifs")}
        title={t("pricing_title", "Des offres simples et transparentes.")}
      />

      <div className="mt-14 grid gap-4 sm:mt-20 lg:grid-cols-3 lg:gap-6">
        {pricing.map((p, i) => (
          <Reveal
            as="article"
            key={p.id}
            delay={i * 100}
            className={cn(
              "relative flex flex-col rounded-xl border bg-card p-7 transition-all duration-500 hover:-translate-y-1.5 sm:p-9",
              p.featured
                ? "border-[var(--neon-dim)] shadow-[var(--shadow-neon)] lg:-translate-y-3 lg:hover:-translate-y-4"
                : "border-border hover:border-border-strong",
            )}
          >
            {p.featured && (
              <span className="label-mono absolute -top-3 left-7 rounded-full bg-neon px-3 py-1 text-[0.6rem] text-primary-foreground">
                {t("pricing_badge", "Populaire")}
              </span>
            )}
            <h3 className="label-mono text-sm">{p.name}</h3>
            <p className="font-display mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
              {p.price}
            </p>
            <ul className="mt-8 flex-1 space-y-4">
              {p.features.map((f) => (
                <li key={f} className="text-muted-foreground flex items-start gap-3 text-sm">
                  <Check className="text-neon mt-0.5 size-4 shrink-0" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
            {p.id === "essentiel" ? (
              <Link
                to="/modeles"
                className="label-mono mt-10 flex items-center justify-center rounded-md border border-border px-5 py-4 text-[0.7rem] transition-all duration-300 hover:border-neon hover:text-neon"
              >
                {p.cta}
              </Link>
            ) : (
              <a
                href="#contact"
                className={cn(
                  "label-mono mt-10 flex items-center justify-center rounded-md px-5 py-4 text-[0.7rem] transition-all duration-300",
                  p.featured
                    ? "bg-neon text-primary-foreground hover:shadow-[var(--shadow-neon-strong)]"
                    : "border border-border hover:border-neon hover:text-neon",
                )}
              >
                {p.cta}
              </a>
            )}
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <p className="text-muted-foreground mt-12 max-w-2xl text-sm">
          {t(
            "pricing_note",
            "Chaque projet étant différent, un devis personnalisé est réalisé avant le début de la création.",
          )}
        </p>
      </Reveal>
    </section>
  );
}
