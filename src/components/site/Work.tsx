import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { useSiteContent, useText } from "./content";

export function Work() {
  const t = useText();
  const { projects } = useSiteContent();

  return (
    <section id="realisations" className="py-24 lg:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={t("work_eyebrow", "Réalisations")}
          title={t("work_title", "Ils m'ont fait confiance")}
        />
      </div>

      <div className="hide-scrollbar mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mt-20 sm:gap-6 sm:px-8">
        {projects.map((p, i) => (
          <Reveal
            as="article"
            key={p.id}
            delay={i * 80}
            className="w-[82vw] max-w-[520px] shrink-0 snap-start sm:w-[46vw] lg:w-[38vw]"
          >
            <a
              href={p.url}
              className="group block h-full overflow-hidden rounded-xl border border-border bg-card transition-all duration-500 hover:border-[var(--neon-dim)] hover:shadow-[var(--shadow-neon)]"
            >
              <div className="overflow-hidden bg-background">
                <img
                  src={p.image_url}
                  alt={p.image_alt || `Site internet réalisé pour ${p.name} — ${p.category}`}
                  width={1200}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex items-start justify-between gap-4 p-6">
                <div>
                  <p className="eyebrow">{p.category}</p>
                  <h3 className="font-display mt-3 text-2xl font-semibold tracking-tight">
                    {p.name}
                  </h3>
                  <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                    {p.description}
                  </p>
                </div>
                <ArrowUpRight className="text-muted-foreground size-5 shrink-0 transition-all duration-500 group-hover:-translate-y-1 group-hover:text-neon" />
              </div>
            </a>
          </Reveal>
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mt-8">
          <a
            href="/realisations"
            className="group label-mono inline-flex items-center gap-3 border-b border-border pb-2 text-xs transition-colors hover:border-neon hover:text-neon"
          >
            Voir toutes les réalisations
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
