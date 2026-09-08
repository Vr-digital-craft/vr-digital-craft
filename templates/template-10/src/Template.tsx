import type { CSSProperties, FormEvent } from "react";
import { ArrowDown, ArrowRight, Check, Clock3, Mail, MapPin, Phone } from "lucide-react";
import type { SiteConfig } from "../../../packages/template-core/src";
import "./styles.css";

export function OnePageTemplate({ config }: { config: SiteConfig }) {
  const style = {
    "--one-pop": config.branding.primaryColor,
    "--one-dark": config.branding.secondaryColor,
  } as CSSProperties;
  const phoneHref = `tel:${config.business.phone.replace(/\s/g, "")}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: config.business.name,
    description: config.business.description,
    telephone: config.business.phone,
    email: config.business.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: config.business.address,
      addressLocality: config.business.city,
      addressCountry: "FR",
    },
  };

  function prepareMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `Nouveau projet — ${String(data.get("name") || "Demande de contact")}`;
    const body = [
      `Nom : ${String(data.get("name") || "")}`,
      `Entreprise : ${String(data.get("company") || "")}`,
      `Téléphone : ${String(data.get("phone") || "")}`,
      `Besoin : ${String(data.get("service") || "")}`,
      "",
      String(data.get("message") || ""),
    ].join("\n");
    window.location.href = `mailto:${config.business.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <div className="one" style={style}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <header>
        <a className="one-brand" href="#accueil" aria-label={`${config.business.name}, accueil`}>
          <strong>{config.business.name}</strong>
          <small>{config.business.activity}</small>
        </a>
        <nav aria-label="Navigation principale">
          {config.navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="one-header-phone" href={phoneHref}>
          <Phone /> <span>{config.business.phone}</span>
        </a>
      </header>
      <main>
        <section className="one-hero" id="accueil">
          <p>
            {config.business.activity} · {config.business.city}
          </p>
          <h1>{config.content.hero.title}</h1>
          <span>{config.content.hero.subtitle}</span>
          <div className="one-hero-actions">
            <a href={config.content.hero.primaryAction.href}>
              {config.content.hero.primaryAction.label}
              <ArrowRight />
            </a>
            <a href="#services">
              <ArrowDown /> Découvrir
            </a>
          </div>
          <aside aria-label="Nos engagements">
            <span>
              <Check /> Interlocuteur unique
            </span>
            <span>
              <Check /> Réponse rapide
            </span>
            <span>
              <Check /> Accompagnement local
            </span>
          </aside>
        </section>
        <section className="one-services" id="services">
          <div>
            <p>{config.content.services.eyebrow}</p>
            <h2>{config.content.services.title}</h2>
            <span>{config.content.services.description}</span>
          </div>
          {config.content.services.items.map((item, index) => (
            <article key={item.id}>
              <small>0{index + 1}</small>
              <h3>{item.title}</h3>
              <span>{item.description}</span>
              <a href="#contact" aria-label={`Parler de la prestation ${item.title}`}>
                En parler <ArrowRight />
              </a>
            </article>
          ))}
        </section>
        {config.content.about.enabled && (
          <section className="one-about" id="a-propos">
            <div>
              <p>{config.content.about.eyebrow}</p>
              <h2>{config.content.about.title}</h2>
              <span>{config.content.about.description}</span>
            </div>
            <ol>
              <li>
                <b>01</b>
                <span>On écoute</span>
                <small>Votre besoin, vos enjeux, vos délais.</small>
              </li>
              <li>
                <b>02</b>
                <span>On construit</span>
                <small>Une réponse claire, sans complexité inutile.</small>
              </li>
              <li>
                <b>03</b>
                <span>On avance</span>
                <small>Un suivi direct jusqu’au résultat.</small>
              </li>
            </ol>
          </section>
        )}
        {config.content.testimonials.enabled && (
          <section className="one-review" id="avis">
            <p>La preuve par l’expérience</p>
            <h2>{config.content.testimonials.title}</h2>
            {config.content.testimonials.items.map((item) => (
              <blockquote key={item.id}>
                “{item.quote}”
                <footer>
                  {item.author}
                  <small>{item.role}</small>
                </footer>
              </blockquote>
            ))}
          </section>
        )}
        <section className="one-contact" id="contact">
          <div>
            <p>{config.content.contact.eyebrow}</p>
            <h2>{config.content.contact.title}</h2>
            <span>{config.content.contact.description}</span>
            <address>
              <a href={phoneHref}>
                <Phone />
                <span>
                  <b>{config.content.contact.phoneLabel}</b>
                  {config.business.phone}
                </span>
              </a>
              <a href={`mailto:${config.business.email}`}>
                <Mail />
                <span>
                  <b>{config.content.contact.emailLabel}</b>
                  {config.business.email}
                </span>
              </a>
              <span>
                <MapPin />
                <span>
                  <b>{config.content.contact.addressLabel}</b>
                  {config.business.address}, {config.business.city}
                </span>
              </span>
              <span>
                <Clock3 />
                <span>
                  <b>{config.content.contact.hoursLabel}</b>
                  {config.business.openingHours.join(" · ")}
                </span>
              </span>
            </address>
          </div>
          <form onSubmit={prepareMessage}>
            <label>
              Nom et prénom
              <input name="name" autoComplete="name" required />
            </label>
            <label>
              Entreprise
              <input name="company" autoComplete="organization" />
            </label>
            <label>
              Téléphone
              <input name="phone" type="tel" autoComplete="tel" required />
            </label>
            <label>
              Votre besoin
              <select name="service" defaultValue="" required>
                <option value="" disabled>
                  Choisir un service
                </option>
                {config.content.services.items.map((item) => (
                  <option key={item.id}>{item.title}</option>
                ))}
              </select>
            </label>
            <label className="one-wide">
              Parlez-nous du projet
              <textarea name="message" rows={4} required />
            </label>
            <label className="one-consent one-wide">
              <input type="checkbox" required /> J’accepte d’être recontacté au sujet de cette
              demande.
            </label>
            <button className="one-wide" type="submit">
              Préparer mon message <ArrowRight />
            </button>
            <small className="one-wide">
              Votre application e-mail préparera le message. Aucune donnée n’est envoyée
              automatiquement.
            </small>
          </form>
        </section>
      </main>
      <footer>
        <span>{config.content.footer.copyright}</span>
        <span>{config.content.footer.tagline}</span>
      </footer>
      <div className="one-mobile-actions">
        <a href={phoneHref}>
          <Phone /> Appeler
        </a>
        <a href="#contact">Démarrer</a>
      </div>
    </div>
  );
}
