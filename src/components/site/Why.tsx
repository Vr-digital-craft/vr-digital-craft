import { Check } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { useSiteContent, useText } from "./content";

export function Why() {
  const t = useText();
  const { whyPoints, stats } = useSiteContent();

  return (
    <section id="a-propos" className="border-y border-border bg-surface/40">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-36">
        <SectionHeading
          eyebrow={t("why_eyebrow", "À propos")}
          title={t("why_title", "Un site pensé pour votre activité.")}
        />

        <ul className="mt-14 grid gap-x-8 gap-y-5 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
          {whyPoints.map((p, i) => (
            <Reveal as="li" key={p.id} delay={i * 60} className="flex items-center gap-3">
              <Check className="text-neon size-4 shrink-0" aria-hidden />
              <span className="text-sm">{p.label}</span>
            </Reveal>
          ))}
        </ul>

        <dl className="mt-16 grid gap-4 border-t border-border pt-12 sm:mt-24 sm:grid-cols-3">
          {stats.map((s, i) => (
            <Reveal key={s.id} delay={i * 100}>
              <dt className="font-display text-neon text-[clamp(2.5rem,7vw,4.5rem)] leading-none font-bold tracking-[-0.04em]">
                {s.value}
              </dt>
              <dd className="text-muted-foreground mt-4 text-sm">{s.label}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
