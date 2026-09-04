import { ArrowRight, MessageSquare } from "lucide-react";
import { Reveal } from "./Reveal";
import { useText } from "./content";

export function Hero() {
  const t = useText();

  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-16 sm:pt-40 lg:pt-48">
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-16%] left-1/2 h-[380px] w-[min(90vw,900px)] -translate-x-1/2 rounded-full opacity-[0.07] blur-[130px]"
        style={{ background: "var(--neon)" }}
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="text-center">
          <p className="eyebrow">{t("hero_eyebrow", "Création de sites web")}</p>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="font-display mt-8 text-center text-[clamp(2.75rem,12vw,9rem)] leading-[0.92] font-bold tracking-[-0.04em]">
            <span className="sr-only">Création de sites internet pour professionnels. </span>
            <span className="block">{t("hero_title_line1", "Besoin d'un")}</span>
            <span className="text-neon block">{t("hero_title_line2", "site web ?")}</span>
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="text-muted-foreground mx-auto mt-8 max-w-2xl text-center text-base leading-relaxed sm:mt-10 sm:text-lg">
            {t(
              "hero_subtitle",
              "Je crée des sites modernes, rapides et efficaces pour les entreprises, artisans, restaurants et commerces.",
            )}
          </p>
        </Reveal>

        <Reveal delay={240}>
          <a
            href="#contact"
            className="group glow-neon mx-auto mt-10 flex w-full max-w-3xl items-center justify-between gap-4 rounded-xl border border-[var(--neon-dim)] bg-background px-5 py-5 transition-all duration-500 hover:shadow-[var(--shadow-neon-strong)] sm:mt-14 sm:px-8 sm:py-7"
          >
            <MessageSquare className="text-neon size-5 shrink-0 sm:size-6" aria-hidden />
            <span className="label-mono text-center text-[0.8rem] sm:text-sm">
              {t("hero_cta", "Contactez-moi")}
            </span>
            <ArrowRight
              className="text-neon size-5 shrink-0 transition-transform duration-500 group-hover:translate-x-1.5 sm:size-6"
              aria-hidden
            />
          </a>
        </Reveal>
      </div>

      <Reveal delay={200} className="relative mx-auto mt-16 max-w-6xl px-2 sm:mt-24 sm:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-8 top-1/4 h-1/2 opacity-20 blur-[100px]"
          style={{ background: "var(--neon)" }}
        />
        <img
          src={t("hero_image_url", "/img/hero-devices.jpg")}
          width={1600}
          height={1008}
          alt={t(
            "hero_image_alt",
            "Site internet responsive affiché sur un ordinateur portable, une tablette et un smartphone",
          )}
          fetchPriority="high"
          decoding="async"
          className="relative w-full"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent"
        />
      </Reveal>
    </section>
  );
}
