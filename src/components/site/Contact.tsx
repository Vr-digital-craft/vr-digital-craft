import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { Reveal } from "./Reveal";
import { useText } from "./content";

export function Contact() {
  const t = useText();
  const phone = t("contact_phone", "06 00 00 00 00");
  const phoneLink = t("contact_phone_link", "+33600000000");
  const email = t("contact_email", "contact@vrstudio.fr");

  return (
    <section id="contact" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 h-[380px] w-[min(90vw,800px)] -translate-x-1/2 rounded-full opacity-[0.1] blur-[130px]"
        style={{ background: "var(--neon)" }}
      />
      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-36">
        <Reveal>
          <p className="eyebrow">{t("contact_eyebrow", "Contact")}</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display mt-6 text-[clamp(2rem,7vw,4.5rem)] leading-[1] font-bold tracking-[-0.04em]">
            {t("contact_title", "Vous avez un projet ?")}
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="font-display text-neon mt-2 text-[clamp(3rem,14vw,10rem)] leading-[0.9] font-bold tracking-[-0.05em]">
            {t("contact_title_neon", "Parlons-en.")}
          </p>
        </Reveal>
        <Reveal delay={200}>
          <p className="text-muted-foreground mt-8 max-w-xl text-base sm:text-lg">
            Contactez-moi directement par téléphone ou par e-mail. Je vous répondrai rapidement.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <Reveal delay={120}>
            <a
              href={`tel:${phoneLink}`}
              className="group flex min-h-48 flex-col justify-between rounded-xl border border-border bg-card p-7 transition-colors hover:border-neon sm:p-9"
            >
              <Phone className="text-neon size-7" aria-hidden />
              <span className="mt-10">
                <span className="label-mono text-muted-foreground block text-[0.65rem]">
                  Téléphone
                </span>
                <span className="mt-3 flex items-center justify-between gap-4 text-xl sm:text-2xl">
                  {phone}
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-1.5" />
                </span>
              </span>
            </a>
          </Reveal>
          <Reveal delay={180}>
            <a
              href={`mailto:${email}`}
              className="group flex min-h-48 flex-col justify-between rounded-xl border border-border bg-card p-7 transition-colors hover:border-neon sm:p-9"
            >
              <Mail className="text-neon size-7" aria-hidden />
              <span className="mt-10">
                <span className="label-mono text-muted-foreground block text-[0.65rem]">
                  E-mail
                </span>
                <span className="mt-3 flex items-center justify-between gap-4 text-lg break-all sm:text-xl">
                  {email}
                  <ArrowRight className="size-5 shrink-0 transition-transform group-hover:translate-x-1.5" />
                </span>
              </span>
            </a>
          </Reveal>
        </div>

        <Reveal delay={230} className="mt-7 flex items-start gap-4">
          <MapPin className="text-neon mt-1 size-5 shrink-0" aria-hidden />
          <span className="text-muted-foreground">
            {t("contact_zone", "Toulouse et alentours")} ·{" "}
            {t("contact_zone_note", "France à distance")}
          </span>
        </Reveal>
      </div>
    </section>
  );
}
