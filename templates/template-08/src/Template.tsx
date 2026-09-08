import { useState, type CSSProperties, type FormEvent } from "react";
import { ArrowRight, Check, Mail, MapPin, Menu, Phone, Star } from "lucide-react";
import type { SiteConfig } from "../../../packages/template-core/src";
import "./styles.css";
export function PremiumDarkTemplate({ config }: { config: SiteConfig }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const s = {
    "--gold": config.branding.primaryColor,
    "--black": config.branding.secondaryColor,
  } as CSSProperties;
  const tel = `tel:${config.business.phone.replace(/\s/g, "")}`;
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
    image: config.seo.socialImage,
  };

  function handleProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `Projet d'architecture intérieure — ${String(data.get("projectType") || "Projet")}`;
    const body = [
      `Nom : ${String(data.get("name") || "")}`,
      `Téléphone : ${String(data.get("phone") || "")}`,
      `Type de projet : ${String(data.get("projectType") || "")}`,
      `Lieu : ${String(data.get("location") || "")}`,
      `Budget indicatif : ${String(data.get("budget") || "")}`,
      "",
      String(data.get("message") || ""),
    ].join("\n");
    window.location.href = `mailto:${config.business.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  return (
    <div className="dark" style={s}>
      <header>
        <a className="dark-brand" href="#accueil" aria-label={`${config.business.name}, accueil`}>
          <strong>{config.business.name}</strong>
        </a>
        <nav
          id="dark-navigation"
          className={menuOpen ? "dark-nav-open" : ""}
          aria-label="Navigation principale"
        >
          {config.navigation.map((x) => (
            <a key={x.href} href={x.href} onClick={() => setMenuOpen(false)}>
              {x.label}
            </a>
          ))}
        </nav>
        <button
          className="dark-menu"
          type="button"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-controls="dark-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Menu aria-hidden="true" />
        </button>
      </header>
      <main>
        <section className="dark-hero" id="accueil">
          <img src={config.content.hero.image?.src} alt={config.content.hero.image?.alt} />
          <div>
            <p>{config.business.activity}</p>
            <h1>{config.content.hero.title}</h1>
            <span>{config.content.hero.subtitle}</span>
            <a href={config.content.hero.primaryAction.href}>
              {config.content.hero.primaryAction.label}
              <ArrowRight />
            </a>
          </div>
        </section>
        <section className="dark-trust" aria-label="Engagements du studio">
          {[
            "Conception sur mesure",
            "Matières sélectionnées",
            "Suivi de réalisation",
            "Échange confidentiel",
          ].map((item) => (
            <span key={item}>
              <Check aria-hidden="true" />
              {item}
            </span>
          ))}
        </section>
        <section className="dark-services" id="services">
          <p>{config.content.services.eyebrow}</p>
          <h2>{config.content.services.title}</h2>
          <div>
            {config.content.services.items.map((x, i) => (
              <article key={x.id}>
                <small>0{i + 1}</small>
                <h3>{x.title}</h3>
                <span>{x.description}</span>
              </article>
            ))}
          </div>
        </section>
        {config.content.about.enabled && (
          <section className="dark-about" id="a-propos">
            <div>
              <p>{config.content.about.eyebrow}</p>
              <h2>{config.content.about.title}</h2>
              <span>{config.content.about.description}</span>
            </div>
            {config.content.about.image && (
              <img
                src={config.content.about.image.src}
                alt={config.content.about.image.alt}
                loading="lazy"
              />
            )}
          </section>
        )}
        {config.content.gallery.enabled && (
          <section className="dark-work" id="realisations">
            <p>Portfolio</p>
            <h2>{config.content.gallery.title}</h2>
            <div>
              {config.content.gallery.images.map((image, index) => (
                <figure key={`${image.src}-${index}`}>
                  <img src={image.src} alt={image.alt} loading="lazy" />
                  <figcaption>Projet {String(index + 1).padStart(2, "0")}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}
        {config.content.testimonials.enabled && (
          <section className="dark-reviews">
            <p>Témoignage</p>
            <h2>{config.content.testimonials.title}</h2>
            {config.content.testimonials.items.map((item) => (
              <blockquote key={item.id}>
                <span aria-label="5 étoiles">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <Star key={star} aria-hidden="true" />
                  ))}
                </span>
                <p>“{item.quote}”</p>
                <footer>
                  {item.author} · {item.role}
                </footer>
              </blockquote>
            ))}
          </section>
        )}
        <section className="dark-contact" id="contact">
          <p>{config.content.contact.eyebrow}</p>
          <h2>{config.content.contact.title}</h2>
          <a href={`mailto:${config.business.email}`}>
            {config.content.contact.emailLabel}
            <ArrowRight />
          </a>
          <div className="dark-details">
            <a href={tel}>
              <Phone aria-hidden="true" />
              {config.business.phone}
            </a>
            <span>
              <MapPin aria-hidden="true" />
              {config.business.address}, {config.business.city}
            </span>
          </div>
        </section>
        <section className="dark-inquiry" aria-label="Présentation du projet">
          <div>
            <p>Premier échange</p>
            <h2>Présentez-nous votre projet.</h2>
            <span>
              Votre demande sera préparée dans votre application e-mail. Le studio vous recontactera
              pour organiser un échange confidentiel.
            </span>
          </div>
          <form onSubmit={handleProject}>
            <label>
              Nom et prénom
              <input name="name" autoComplete="name" required />
            </label>
            <label>
              Téléphone
              <input name="phone" type="tel" autoComplete="tel" required />
            </label>
            <label>
              Type de projet
              <select name="projectType" defaultValue="Résidence privée">
                <option>Résidence privée</option>
                <option>Appartement</option>
                <option>Commerce ou hôtel</option>
                <option>Bureau</option>
                <option>Autre projet</option>
              </select>
            </label>
            <label>
              Ville ou lieu
              <input name="location" required />
            </label>
            <label>
              Budget indicatif
              <select name="budget" defaultValue="À définir">
                <option>À définir</option>
                <option>Moins de 50 000 €</option>
                <option>50 000 à 150 000 €</option>
                <option>Plus de 150 000 €</option>
              </select>
            </label>
            <label className="dark-message">
              Votre ambition
              <textarea
                name="message"
                rows={5}
                placeholder="Surface, usages, calendrier et atmosphère recherchée"
              />
            </label>
            <label className="dark-consent">
              <input name="consent" type="checkbox" required /> J'accepte que mes informations
              soient utilisées pour répondre à cette demande.
            </label>
            <button type="submit">
              Envoyer ma demande <ArrowRight />
            </button>
          </form>
        </section>
      </main>
      <footer>{config.content.footer.copyright}</footer>
      <div className="dark-mobile-actions" aria-label="Actions rapides">
        <a href={tel}>
          <Phone aria-hidden="true" />
          Appeler
        </a>
        <a href="#contact">
          <Mail aria-hidden="true" />
          Un projet
        </a>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </div>
  );
}
