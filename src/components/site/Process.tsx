import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { Icon, useSiteContent, useText } from "./content";

export function Process() {
  const t = useText();
  const { steps } = useSiteContent();

  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-36">
      <SectionHeading
        eyebrow={t("process_eyebrow", "Comment ça marche ?")}
        title={t("process_title", "Cinq étapes, zéro surprise.")}
      />

      <ol className="mt-14 grid gap-4 sm:mt-20 lg:grid-cols-5 lg:gap-3">
        {steps.map((s, i) => (
          <Reveal as="li" key={s.id} delay={i * 90} className="relative">
            <div className="group relative h-full overflow-hidden rounded-xl border border-border bg-card p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-[var(--neon-dim)]">
              <span
                aria-hidden
                className="font-display pointer-events-none absolute -top-4 right-3 text-7xl font-bold text-foreground/[0.06]"
              >
                {s.step_number}
              </span>
              <Icon name={s.icon} className="text-neon size-6" />
              <h3 className="label-mono mt-8 text-xs">{s.title}</h3>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{s.description}</p>
            </div>
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className="mx-auto block h-6 w-px bg-border lg:absolute lg:top-1/2 lg:-right-2 lg:h-px lg:w-4"
              />
            )}
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
