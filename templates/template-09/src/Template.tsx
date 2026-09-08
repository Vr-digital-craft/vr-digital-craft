import { useState, type CSSProperties, type FormEvent } from "react";
import { ArrowRight, Check, Clock3, MapPin, Menu, Phone, Plus, X } from "lucide-react";
import type { SiteConfig } from "../../../packages/template-core/src";
import "./styles.css";

export function ProfessionalTemplate({ config }: { config: SiteConfig }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const style = {
    "--pro-main": config.branding.primaryColor,
    "--pro-dark": config.branding.secondaryColor,
  } as CSSProperties;
  const phoneHref = `tel:${config.business.phone.replace(/\s/g, "")}`;
  const structuredData = {
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

  function prepareRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `Demande de rendez-vous — ${String(data.get("name") || "Nouveau contact")}`;
    const body = [
      `Nom : ${String(data.get("name") || "")}`,
      `Téléphone : ${String(data.get("phone") || "")}`,
      `Besoin : ${String(data.get("service") || "")}`,
      `Format préféré : ${String(data.get("format") || "")}`,
      "",
      String(data.get("message") || ""),
    ].join("\n");
    window.location.href = `mailto:${config.business.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <div className="pro" style={style}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <header>
        <a className="pro-brand" href="#accueil" aria-label={`${config.business.name}, accueil`}>
          <strong>{config.business.name}</strong>
          <span>{config.business.activity}</span>
        </a>
        <button
          className="pro-menu-button"
          type="button"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-controls="pro-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav id="pro-navigation" className={menuOpen ? "is-open" : ""}>
          {config.navigation.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          ))}
          <a className="pro-nav-cta" href="#contact" onClick={() => setMenuOpen(false)}>
            Rendez-vous
          </a>
        </nav>
      </header>
      <main>
        <section className="pro-hero" id="accueil">
          <div>
            <p>{config.business.activity}</p>
            <h1>{config.content.hero.title}</h1>
            <span>{config.content.hero.subtitle}</span>
            <div className="pro-actions">
              <a href={config.content.hero.primaryAction.href}>
                {config.content.hero.primaryAction.label}
                <ArrowRight />
              </a>
              <a className="pro-action-secondary" href={phoneHref}>
                <Phone />
                {config.content.contact.phoneLabel}
              </a>
            </div>
          </div>
          <img src={config.content.hero.image?.src} alt={config.content.hero.image?.alt} />
        </section>
        <aside className="pro-trust" aria-label="Engagements du cabinet">
          <span>
            <Check /> Premier échange
          </span>
          <span>
            <Check /> Honoraires annoncés
          </span>
          <span>
            <Check /> Rendez-vous à distance
          </span>
          <span>
            <Check /> Suivi confidentiel
          </span>
        </aside>
        <section className="pro-services" id="services">
          <p>{config.content.services.eyebrow}</p>
          <h2>{config.content.services.title}</h2>
          <span className="pro-intro">{config.content.services.description}</span>
          <div>
            {config.content.services.items.map((item, index) => (
              <article key={item.id}>
                <span className="pro-number">0{index + 1}</span>
                <Check />
                <h3>{item.title}</h3>
                <span>{item.description}</span>
              </article>
            ))}
          </div>
        </section>
        {config.content.about.enabled && (
          <section className="pro-method" id="methode">
            <img src={config.content.about.image?.src} alt={config.content.about.image?.alt} />
            <div>
              <p>{config.content.about.eyebrow}</p>
              <h2>{config.content.about.title}</h2>
              <span>{config.content.about.description}</span>
              <ol>
                <li>
                  <b>01</b> Échange
                </li>
                <li>
                  <b>02</b> Diagnostic
                </li>
                <li>
                  <b>03</b> Recommandations
                </li>
                <li>
                  <b>04</b> Accompagnement
                </li>
              </ol>
            </div>
          </section>
        )}
        {config.content.testimonials.enabled && (
          <section className="pro-testimonials" aria-labelledby="pro-testimonials-title">
            <p>Ils nous font confiance</p>
            <h2 id="pro-testimonials-title">{config.content.testimonials.title}</h2>
            <div>
              {config.content.testimonials.items.map((item) => (
                <blockquote key={item.id}>
                  <span aria-hidden="true">“</span>
                  <p>{item.quote}</p>
                  <footer>
                    {item.author}
                    <small>{item.role}</small>
                  </footer>
                </blockquote>
              ))}
            </div>
          </section>
        )}
        {config.content.faq.enabled && (
          <section className="pro-faq" id="faq">
            <p>Informations pratiques</p>
            <h2>{config.content.faq.title}</h2>
            {config.content.faq.items.map((item) => (
              <details key={item.id}>
                <summary>
                  {item.question}
                  <Plus />
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </section>
        )}
        <section className="pro-contact" id="contact">
          <div className="pro-contact-copy">
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
          <form onSubmit={prepareRequest}>
            <label>
              Nom et prénom
              <input name="name" autoComplete="name" required />
            </label>
            <label>
              Téléphone
              <input name="phone" type="tel" autoComplete="tel" required />
            </label>
            <label>
              Type d’accompagnement
              <select name="service" required defaultValue="">
                <option value="" disabled>
                  Choisir une prestation
                </option>
                {config.content.services.items.map((item) => (
                  <option key={item.id}>{item.title}</option>
                ))}
              </select>
            </label>
            <label>
              Format préféré
              <select name="format" defaultValue="Au cabinet">
                <option>Au cabinet</option>
                <option>Sur site</option>
                <option>En visioconférence</option>
              </select>
            </label>
            <label className="pro-form-wide">
              Votre projet
              <textarea name="message" rows={4} required />
            </label>
            <label className="pro-consent pro-form-wide">
              <input type="checkbox" required /> J’accepte d’être recontacté au sujet de ma demande.
            </label>
            <button className="pro-form-wide" type="submit">
              Préparer ma demande <ArrowRight />
            </button>
            <small className="pro-form-wide">
              Aucune donnée n’est envoyée automatiquement. Votre application e-mail préparera le
              message.
            </small>
          </form>
        </section>
      </main>
      <footer>
        <span>{config.content.footer.copyright}</span>
        <a href={`mailto:${config.business.email}`}>{config.business.email}</a>
      </footer>
      <div className="pro-mobile-actions">
        <a href={phoneHref}>
          <Phone /> Appeler
        </a>
        <a href="#contact">Rendez-vous</a>
      </div>
    </div>
  );
}
