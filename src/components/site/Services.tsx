import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { Icon, useSiteContent, useText } from "./content";

export function Services() {
  const t = useText();
  const { services } = useSiteContent();

  return (
    <section id="services" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-36">
      <SectionHeading
        eyebrow={t("services_eyebrow", "Mes services")}
        title={
          <>
            <span className="block">{t("services_title_line1", "Des solutions web")}</span>
            <span className="text-muted-foreground block">
              {t("services_title_line2", "adaptées à votre activité")}
            </span>
          </>
        }
      />

      <ul className="mt-14 grid gap-4 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s, i) => (
          <Reveal as="li" key={s.id} delay={i * 90}>
            <article className="group h-full rounded-xl border border-border bg-card p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-[var(--neon-dim)] hover:shadow-[var(--shadow-neon)]">
              <Icon name={s.icon} className="text-neon size-7" />
              <h3 className="label-mono mt-8 text-sm">{s.title}</h3>
              <p className="text-muted-foreground mt-4 text-sm leading-relaxed">{s.description}</p>
            </article>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={120} className="mt-12">
        <a
          href="/services"
          className="group label-mono inline-flex items-center gap-3 border-b border-border pb-2 text-xs transition-colors hover:border-neon hover:text-neon"
        >
          {t("services_link_label", "Découvrir tous les services")}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </a>
      </Reveal>
    </section>
  );
}
