import { useState, type CSSProperties, type FormEvent } from "react";
import { ArrowRight, Check, Mail, MapPin, Menu, Phone, Star } from "lucide-react";
import type { SiteConfig } from "../../../packages/template-core/src";
import "./styles.css";
export function CorporateTemplate({ config }: { config: SiteConfig }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const s = {
    "--corp-accent": config.branding.primaryColor,
    "--corp-dark": config.branding.secondaryColor,
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

  function handleProjectRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `Nouveau projet — ${String(data.get("company") || "Entreprise")}`;
    const body = [
      `Nom : ${String(data.get("name") || "")}`,
      `Entreprise : ${String(data.get("company") || "")}`,
      `Téléphone : ${String(data.get("phone") || "")}`,
      `Expertise recherchée : ${String(data.get("expertise") || "")}`,
      `Échéance : ${String(data.get("timeline") || "")}`,
      "",
      String(data.get("message") || ""),
    ].join("\n");
    window.location.href = `mailto:${config.business.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  return (
    <div className="corp" style={s}>
      <header>
        <a className="corp-brand" href="#accueil" aria-label={`${config.business.name}, accueil`}>
          <strong>{config.business.name}</strong>
        </a>
        <nav
          id="corp-navigation"
          className={menuOpen ? "corp-nav-open" : ""}
          aria-label="Navigation principale"
        >
          {config.navigation.map((x) => (
            <a key={x.href} href={x.href} onClick={() => setMenuOpen(false)}>
              {x.label}
            </a>
          ))}
        </nav>
        <button
          className="corp-menu"
          type="button"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-controls="corp-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Menu aria-hidden="true" />
        </button>
      </header>
      <main>
        <section className="corp-hero" id="accueil">
          <div>
            <p>{config.business.activity}</p>
            <h1>{config.content.hero.title}</h1>
            <span>{config.content.hero.subtitle}</span>
            <a href={config.content.hero.primaryAction.href}>
              {config.content.hero.primaryAction.label}
              <ArrowRight />
            </a>
          </div>
          {config.content.hero.image && (
            <img src={config.content.hero.image.src} alt={config.content.hero.image.alt} />
          )}
        </section>
        <section className="corp-trust" aria-label="Nos engagements">
          {[
            "Approche documentée",
            "Pilotage mesurable",
            "Transfert de compétences",
            "Interlocuteur dédié",
          ].map((item) => (
            <span key={item}>
              <Check aria-hidden="true" />
              {item}
            </span>
          ))}
        </section>
        <section className="corp-services" id="services">
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
          <section className="corp-about" id="a-propos">
            <div>
              <p>{config.content.about.eyebrow}</p>
              <h2>{config.content.about.title}</h2>
              <span>{config.content.about.description}</span>
            </div>
            {config.content.about.image && (
              <img src={config.content.about.image.src} alt={config.content.about.image.alt} />
            )}
          </section>
        )}
        {config.content.gallery.enabled && (
          <section className="corp-work" id="realisations">
            <div className="corp-work-heading">
              <p>Réalisations</p>
              <h2>{config.content.gallery.title}</h2>
              <span>
                Des missions conduites avec méthode, en collaboration étroite avec les équipes
                clientes.
              </span>
            </div>
            <div className="corp-work-grid">
              {config.content.gallery.images.map((image, index) => (
                <figure key={`${image.src}-${index}`}>
                  <img src={image.src} alt={image.alt} loading="lazy" />
                  <figcaption>
                    {config.content.services.items[index]?.title ?? "Transformation accompagnée"}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}
        {config.content.testimonials.enabled && (
          <section className="corp-reviews" aria-label="Avis clients">
            <p>Ils nous font confiance</p>
            <h2>{config.content.testimonials.title}</h2>
            <div>
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
            </div>
          </section>
        )}
        <section className="corp-contact" id="contact">
          <p>{config.content.contact.eyebrow}</p>
          <h2>{config.content.contact.title}</h2>
          <span>{config.content.contact.description}</span>
          <a href={`mailto:${config.business.email}`}>
            {config.content.contact.emailLabel}
            <ArrowRight />
          </a>
          <div className="corp-contact-details">
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
        <section className="corp-inquiry" aria-label="Formulaire de projet">
          <div>
            <p>Premier échange</p>
            <h2>Parlez-nous de votre enjeu.</h2>
            <span>
              Votre demande sera préparée dans votre application e-mail. L'équipe vous recontactera
              pour organiser un premier échange.
            </span>
          </div>
          <form onSubmit={handleProjectRequest}>
            <label>
              Nom et prénom
              <input name="name" autoComplete="name" required />
            </label>
            <label>
              Entreprise
              <input name="company" autoComplete="organization" required />
            </label>
            <label>
              Téléphone
              <input name="phone" type="tel" autoComplete="tel" required />
            </label>
            <label>
              Expertise recherchée
              <select name="expertise" defaultValue={config.content.services.items[0]?.title}>
                {config.content.services.items.map((service) => (
                  <option key={service.id}>{service.title}</option>
                ))}
              </select>
            </label>
            <label>
              Échéance
              <select name="timeline" defaultValue="Dans les 3 mois">
                <option>Dès que possible</option>
                <option>Dans les 3 mois</option>
                <option>Dans les 6 mois</option>
                <option>Projet exploratoire</option>
              </select>
            </label>
            <label className="corp-message">
              Contexte
              <textarea
                name="message"
                rows={5}
                placeholder="Objectifs, contraintes et résultats attendus"
              />
            </label>
            <label className="corp-consent">
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
      <div className="corp-mobile-actions" aria-label="Actions rapides">
        <a href={tel}>
          <Phone aria-hidden="true" /> Appeler
        </a>
        <a href="#contact">
          <Mail aria-hidden="true" /> Votre projet
        </a>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </div>
  );
}
