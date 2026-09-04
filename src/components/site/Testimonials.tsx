import { Star } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { useSiteContent, useText } from "./content";

export function Testimonials() {
  const t = useText();
  const { testimonials } = useSiteContent();

  return (
    <section className="border-y border-border bg-surface/40">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-36">
        <SectionHeading
          eyebrow={t("testimonials_eyebrow", "Témoignages")}
          title={t("testimonials_title", "Ils en parlent mieux que moi.")}
        />

        <div className="mt-14 grid gap-4 sm:mt-20 lg:grid-cols-3 lg:gap-6">
          {testimonials.map((item, i) => (
            <Reveal
              as="article"
              key={item.id}
              delay={i * 100}
              className="flex h-full flex-col rounded-xl border border-border bg-card p-7 transition-all duration-500 hover:border-[var(--neon-dim)] sm:p-9"
            >
              <div className="flex gap-1" aria-label={`Note ${item.rating} sur 5`}>
                {Array.from({ length: item.rating }).map((_, s) => (
                  <Star key={s} className="text-neon size-4 fill-current" aria-hidden />
                ))}
              </div>
              <blockquote className="mt-7 flex-1 text-base leading-relaxed">
                “{item.quote}”
              </blockquote>
              <footer className="mt-8 border-t border-border pt-6">
                <p className="label-mono text-xs">{item.author}</p>
                <p className="text-muted-foreground mt-2 text-sm">{item.role}</p>
              </footer>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
