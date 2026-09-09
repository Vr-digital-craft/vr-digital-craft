import { useState, type CSSProperties, type FormEvent } from "react";
import { ArrowRight, Check, Clock3, Mail, MapPin, Menu, Phone, Star } from "lucide-react";
import { getDirectionsUrl, type SiteConfig } from "../../../packages/template-core/src";
import "./styles.css";

export function GarageTemplate({ config }: { config: SiteConfig }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const colors = {
    "--garage-accent": config.branding.primaryColor,
    "--garage-dark": config.branding.secondaryColor,
  } as CSSProperties;
  const tel = `tel:${config.business.phone.replace(/\s/g, "")}`;
  const locationLabel = `${config.business.address}, ${config.business.city}`;
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(locationLabel)}&output=embed`;
  const directionsUrl = getDirectionsUrl(config.socialLinks.google, locationLabel);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
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

  function handleAppointment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `Demande de rendez-vous — ${String(data.get("vehicle") || "véhicule")}`;
    const body = [
      `Nom : ${String(data.get("name") || "")}`,
      `Téléphone : ${String(data.get("phone") || "")}`,
      `Véhicule : ${String(data.get("vehicle") || "")}`,
      `Prestation : ${String(data.get("service") || "")}`,
      "",
      String(data.get("message") || ""),
    ].join("\n");
    window.location.href = `mailto:${config.business.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <div className="garage-site" style={colors}>
      <header className="garage-header">
        <a className="garage-brand" href="#accueil" aria-label={`${config.business.name}, accueil`}>
          {config.branding.logo ? (
            <img src={config.branding.logo.src} alt={config.branding.logo.alt} />
          ) : (
            <>
              <span>G//</span>
              {config.business.name}
            </>
          )}
        </a>
        <nav
          id="garage-navigation"
          className={menuOpen ? "garage-nav-open" : ""}
          aria-label="Navigation principale"
        >
          {config.navigation.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>
        <a className="garage-header-call" href={tel}>
          <Phone />
          {config.business.phone}
        </a>
        <button
          className="garage-menu"
          type="button"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-controls="garage-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Menu aria-hidden="true" />
        </button>
      </header>

      <main>
        <section className="garage-hero" id="accueil">
          {config.content.hero.image && (
            <img src={config.content.hero.image.src} alt={config.content.hero.image.alt} />
          )}
          <div className="garage-hero-shade" />
          <div className="garage-hero-copy">
            <p className="garage-overline">
              {config.business.activity} · {config.business.city}
            </p>
            <h1>{config.content.hero.title}</h1>
            <p className="garage-lead">{config.content.hero.subtitle}</p>
            <div className="garage-actions">
              <a
                className="garage-button garage-button-primary"
                href={config.content.hero.primaryAction.href}
              >
                {config.content.hero.primaryAction.label}
                <ArrowRight />
              </a>
              <a className="garage-button garage-button-ghost" href={tel}>
                <Phone /> Appeler
              </a>
            </div>
          </div>
          <div className="garage-hero-data">
            <span>
              <Clock3 />
              {config.business.openingHours[0]}
            </span>
            <span>
              <MapPin />
              {config.business.city}
            </span>
          </div>
        </section>

        <section className="garage-trust" aria-label="Prestations principales">
          {[
            "Toutes marques",
            "Devis avant intervention",
            "Diagnostic précis",
            "Suivi transparent",
          ].map((label) => (
            <span key={label}>
              <Check />
              {label}
            </span>
          ))}
        </section>

        <section className="garage-services" id="services">
          <div className="garage-heading">
            <p>{config.content.services.eyebrow}</p>
            <h2>{config.content.services.title}</h2>
            <span>{config.content.services.description}</span>
          </div>
          <div className="garage-service-grid">
            {config.content.services.items.map((service, index) => (
              <article key={service.id} className={service.image ? "garage-service-featured" : ""}>
                {service.image && (
                  <img src={service.image.src} alt={service.image.alt} loading="lazy" />
                )}
                <div>
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="garage-services-cta">
            <p>Un voyant s'allume ou un bruit vous inquiète ?</p>
            <a className="garage-button garage-button-primary" href="#contact">
              Prendre rendez-vous <ArrowRight />
            </a>
          </div>
        </section>

        {config.content.about.enabled && (
          <section className="garage-about" id="a-propos">
            <div className="garage-about-copy">
              <p className="garage-overline">{config.content.about.eyebrow}</p>
              <h2>{config.content.about.title}</h2>
              <p>{config.content.about.description}</p>
              <ul>
                {config.content.services.items.slice(0, 3).map((service) => (
                  <li key={service.id}>
                    <Check />
                    {service.title}
                  </li>
                ))}
              </ul>
            </div>
            {config.content.about.image && (
              <figure>
                <img
                  src={config.content.about.image.src}
                  alt={config.content.about.image.alt}
                  loading="lazy"
                />
                <figcaption>{config.business.tagline}</figcaption>
              </figure>
            )}
          </section>
        )}

        {config.content.gallery.enabled && (
          <section className="garage-gallery" id="realisations">
            <div className="garage-heading">
              <p>Réalisations</p>
              <h2>{config.content.gallery.title}</h2>
            </div>
            <div className="garage-gallery-grid">
              {config.content.gallery.images.map((image, index) => (
                <figure key={`${image.src}-${index}`}>
                  <img src={image.src} alt={image.alt} loading="lazy" />
                </figure>
              ))}
            </div>
          </section>
        )}

        {config.content.testimonials.enabled && (
          <section className="garage-testimonials" id="avis">
            <div className="garage-heading">
              <p>Avis clients</p>
              <h2>{config.content.testimonials.title}</h2>
            </div>
            <div className="garage-review-grid">
              {config.content.testimonials.items.map((item) => (
                <blockquote key={item.id}>
                  <div aria-label="5 étoiles">
                    {[0, 1, 2, 3, 4].map((star) => (
                      <Star key={star} aria-hidden="true" />
                    ))}
                  </div>
                  <p>“{item.quote}”</p>
                  <footer>
                    <strong>{item.author}</strong>
                    <span>{item.role}</span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </section>
        )}

        <section className="garage-contact" id="contact">
          <div>
            <p className="garage-overline">{config.content.contact.eyebrow}</p>
            <h2>{config.content.contact.title}</h2>
            <p>{config.content.contact.description}</p>
          </div>
          <address>
            <a href={tel}>
              <Phone />
              <span>
                <small>{config.content.contact.phoneLabel}</small>
                <strong>{config.business.phone}</strong>
              </span>
            </a>
            <a href={`mailto:${config.business.email}`}>
              <Mail />
              <span>
                <small>{config.content.contact.emailLabel}</small>
                <strong>{config.business.email}</strong>
              </span>
            </a>
            <a href={directionsUrl} target="_blank" rel="noreferrer">
              <MapPin />
              <span>
                <small>{config.content.contact.addressLabel}</small>
                <strong>
                  {config.business.address}, {config.business.city}
                </strong>
              </span>
            </a>
            <div>
              <Clock3 />
              <span>
                <small>{config.content.contact.hoursLabel}</small>
                {config.business.openingHours.map((hours) => (
                  <strong key={hours}>{hours}</strong>
                ))}
              </span>
            </div>
          </address>
        </section>
        <section className="garage-booking" aria-label="Demande de rendez-vous et localisation">
          <form onSubmit={handleAppointment}>
            <div className="garage-heading">
              <p>Demande de rendez-vous</p>
              <h2>Décrivez votre besoin.</h2>
              <span>
                Votre demande sera préparée dans votre application e-mail. Le garage vous
                recontactera pour confirmer le créneau.
              </span>
            </div>
            <div className="garage-form-grid">
              <label>
                Nom et prénom
                <input name="name" autoComplete="name" required />
              </label>
              <label>
                Téléphone
                <input name="phone" type="tel" autoComplete="tel" required />
              </label>
              <label>
                Véhicule
                <input name="vehicle" placeholder="Marque, modèle, année" required />
              </label>
              <label>
                Prestation
                <select name="service" defaultValue="Entretien et révision">
                  <option>Entretien et révision</option>
                  <option>Diagnostic électronique</option>
                  <option>Freinage</option>
                  <option>Pneumatiques</option>
                  <option>Autre demande</option>
                </select>
              </label>
              <label className="garage-form-message">
                Message
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Précisez le problème ou vos disponibilités"
                />
              </label>
              <label className="garage-consent">
                <input name="consent" type="checkbox" required /> J'accepte que mes informations
                soient utilisées pour répondre à cette demande.
              </label>
            </div>
            <button className="garage-button garage-button-primary" type="submit">
              Envoyer ma demande <ArrowRight />
            </button>
          </form>
          <div className="garage-location">
            <iframe
              title={`Localisation de ${config.business.name}`}
              src={mapUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div>
              <MapPin aria-hidden="true" />
              <p>
                <strong>{config.business.name}</strong>
                <span>{locationLabel}</span>
              </p>
              <a href={directionsUrl} target="_blank" rel="noreferrer">
                Obtenir l'itinéraire <ArrowRight />
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="garage-footer">
        <div className="garage-brand">
          <span>G//</span>
          {config.business.name}
        </div>
        <p>{config.content.footer.tagline}</p>
        <small>{config.content.footer.copyright}</small>
      </footer>
      <div className="garage-mobile-actions" aria-label="Actions rapides">
        <a href={tel}>
          <Phone aria-hidden="true" /> Appeler
        </a>
        <a href="#contact">
          <Clock3 aria-hidden="true" /> Rendez-vous
        </a>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </div>
  );
}
