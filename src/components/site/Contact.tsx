import { useState } from "react";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "./Reveal";
import { useText } from "./content";
import { supabase } from "@/integrations/supabase/client";

const projectTypes = [
  "Site vitrine",
  "Restaurant",
  "Artisan / Commerce",
  "Refonte de site",
  "Web App",
  "Autre",
];

const budgets = ["Moins de 500 €", "500 – 1 000 €", "1 000 – 2 000 €", "2 000 € et +"];

const fieldClass =
  "mt-3 w-full rounded-md border border-border bg-background px-4 py-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-neon";

export function Contact() {
  const t = useText();
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    if (data["website"]) return;

    const name = data["nom"]?.trim() ?? "";
    const emailAddress = data["email"]?.trim().toLowerCase() ?? "";
    const message = data["message"]?.trim() ?? "";
    if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(emailAddress) || message.length < 20) {
      toast.error("Vérifiez le formulaire", {
        description: "Indiquez un nom, un e-mail valide et un message d'au moins 20 caractères.",
      });
      return;
    }
    setSending(true);
    try {
      const { error } = await supabase.from("contact_requests").insert({
        name,
        company: data["entreprise"]?.trim() || null,
        email: emailAddress,
        phone: data["telephone"]?.trim() || null,
        project_type: data["type"] || null,
        budget: data["budget"] || null,
        message,
      });
      if (error) throw error;
      toast.success("Demande envoyée", {
        description: t("contact_success", "Merci ! Je vous réponds très rapidement."),
      });
      form.reset();
    } catch {
      toast.error("L'envoi a échoué", { description: "Réessayez ou écrivez-moi par e-mail." });
    } finally {
      setSending(false);
    }
  }

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
            {t("contact_subtitle", "Expliquez-moi votre projet et je vous répondrai rapidement.")}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <Reveal delay={120}>
            <form onSubmit={handleSubmit} className="grid gap-7 sm:grid-cols-2" noValidate>
              <label className="sr-only" aria-hidden="true">
                Ne pas remplir ce champ
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
              <label className="block">
                <span className="label-mono text-muted-foreground text-[0.65rem]">Nom</span>
                <input
                  name="nom"
                  required
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                  className={fieldClass}
                />
              </label>
              <label className="block">
                <span className="label-mono text-muted-foreground text-[0.65rem]">Entreprise</span>
                <input
                  name="entreprise"
                  maxLength={120}
                  autoComplete="organization"
                  className={fieldClass}
                />
              </label>
              <label className="block">
                <span className="label-mono text-muted-foreground text-[0.65rem]">Email</span>
                <input
                  name="email"
                  type="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  className={fieldClass}
                />
              </label>
              <label className="block">
                <span className="label-mono text-muted-foreground text-[0.65rem]">Téléphone</span>
                <input
                  name="telephone"
                  type="tel"
                  maxLength={30}
                  autoComplete="tel"
                  className={fieldClass}
                />
              </label>
              <label className="block">
                <span className="label-mono text-muted-foreground text-[0.65rem]">
                  Type de projet
                </span>
                <select name="type" required defaultValue="" className={fieldClass}>
                  <option value="" disabled>
                    Sélectionner
                  </option>
                  {projectTypes.map((tp) => (
                    <option key={tp} value={tp}>
                      {tp}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="label-mono text-muted-foreground text-[0.65rem]">
                  Budget estimé
                </span>
                <select name="budget" defaultValue="" className={fieldClass}>
                  <option value="" disabled>
                    Sélectionner
                  </option>
                  {budgets.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="label-mono text-muted-foreground text-[0.65rem]">Message</span>
                <textarea
                  name="message"
                  rows={5}
                  required
                  minLength={20}
                  maxLength={3000}
                  className={fieldClass}
                />
              </label>

              <button
                type="submit"
                disabled={sending}
                className="group label-mono flex w-full items-center justify-center gap-3 rounded-md bg-neon px-6 py-5 text-xs text-primary-foreground transition-all duration-300 hover:shadow-[var(--shadow-neon-strong)] disabled:opacity-60 sm:col-span-2"
              >
                {sending ? "Envoi..." : t("contact_button", "Envoyer ma demande")}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1.5" />
              </button>
            </form>
          </Reveal>

          <Reveal delay={200} className="space-y-8 lg:pt-4">
            <a
              href={`tel:${phoneLink}`}
              className="group flex items-start gap-4 transition-colors hover:text-neon"
            >
              <Phone className="text-neon mt-1 size-5 shrink-0" aria-hidden />
              <span>
                <span className="label-mono text-muted-foreground block text-[0.65rem]">
                  Téléphone
                </span>
                <span className="mt-2 block text-lg">{phone}</span>
              </span>
            </a>
            <a
              href={`mailto:${email}`}
              className="group flex items-start gap-4 transition-colors hover:text-neon"
            >
              <Mail className="text-neon mt-1 size-5 shrink-0" aria-hidden />
              <span>
                <span className="label-mono text-muted-foreground block text-[0.65rem]">Email</span>
                <span className="mt-2 block text-lg break-all">{email}</span>
              </span>
            </a>
            <div className="flex items-start gap-4">
              <MapPin className="text-neon mt-1 size-5 shrink-0" aria-hidden />
              <span>
                <span className="label-mono text-muted-foreground block text-[0.65rem]">Zone</span>
                <span className="mt-2 block text-lg">
                  {t("contact_zone", "Toulouse et alentours")}
                  <span className="text-muted-foreground block text-sm">
                    {t("contact_zone_note", "France à distance")}
                  </span>
                </span>
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
