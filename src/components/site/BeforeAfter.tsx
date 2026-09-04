import { Check, X } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { useSiteContent, useText } from "./content";

export function BeforeAfter() {
  const t = useText();
  const { comparison } = useSiteContent();
  const before = comparison.filter((c) => c.side === "before");
  const after = comparison.filter((c) => c.side === "after");

  return (
    <section className="border-y border-border bg-surface/40">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-36">
        <SectionHeading
          eyebrow={t("ba_eyebrow", "Avant / Après")}
          title={
            <>
              {t("ba_title_line1", "Votre activité mérite mieux")}
              <br />
              <span className="text-muted-foreground">
                {t("ba_title_line2", "qu'une simple présence en ligne.")}
              </span>
            </>
          }
        />

        <div className="mt-14 grid gap-4 sm:mt-20 lg:grid-cols-2 lg:gap-6">
          <Reveal className="rounded-xl border border-border bg-card p-7 sm:p-9">
            <p className="label-mono text-muted-foreground text-xs">
              {t("ba_before_label", "Avant")}
            </p>
            <img
              src={t("ba_before_image", "/img/before-old.jpg")}
              alt="Ancien site amateur, mal organisé et difficile à lire"
              width={1000}
              height={750}
              loading="lazy"
              decoding="async"
              className="mt-6 aspect-[4/3] w-full rounded-md border border-border object-cover opacity-60 grayscale"
            />
            <ul className="mt-8 space-y-4">
              {before.map((b) => (
                <li key={b.id} className="text-muted-foreground flex items-start gap-3 text-sm">
                  <X className="mt-0.5 size-4 shrink-0" aria-hidden />
                  {b.label}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal
            delay={120}
            className="rounded-xl border border-[var(--neon-dim)] bg-card p-7 shadow-[var(--shadow-neon)] sm:p-9"
          >
            <p className="label-mono text-neon text-xs">{t("ba_after_label", "Après")}</p>
            <img
              src={t("ba_after_image", "/img/after-new.jpg")}
              alt="Nouveau site professionnel, moderne et épuré"
              width={1000}
              height={750}
              loading="lazy"
              decoding="async"
              className="mt-6 aspect-[4/3] w-full rounded-md border border-border object-cover"
            />
            <ul className="mt-8 space-y-4">
              {after.map((a) => (
                <li key={a.id} className="flex items-start gap-3 text-sm">
                  <Check className="text-neon mt-0.5 size-4 shrink-0" aria-hidden />
                  {a.label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
