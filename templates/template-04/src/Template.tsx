import { useState, type CSSProperties, type FormEvent } from "react";
import { ArrowRight, Clock3, Mail, MapPin, Menu, Phone, Sparkles, Star } from "lucide-react";
import { getDirectionsUrl, type SiteConfig } from "../../../packages/template-core/src";
import "./styles.css";

export function BeautyTemplate({ config }: { config: SiteConfig }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const theme = {
    "--beauty-accent": config.branding.primaryColor,
    "--beauty-dark": config.branding.secondaryColor,
  } as CSSProperties;
  const tel = `tel:${config.business.phone.replace(/\s/g, "")}`;
  const locationLabel = `${config.business.address}, ${config.business.city}`;
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(locationLabel)}&output=embed`;
  const directionsUrl = getDirectionsUrl(config.socialLinks.google, locationLabel);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
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
    const subject = `Demande de rendez-vous — ${String(data.get("service") || "Institut")}`;
    const body = [
      `Nom : ${String(data.get("name") || "")}`,
      `Téléphone : ${String(data.get("phone") || "")}`,
      `Soin : ${String(data.get("service") || "")}`,
      `Date souhaitée : ${String(data.get("date") || "")}`,
      `Créneau souhaité : ${String(data.get("time") || "")}`,
      "",
      String(data.get("message") || ""),
    ].join("\n");
    window.location.href = `mailto:${config.business.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  return (
    <div className="beauty-site" style={theme}>
      <header className="beauty-header">
        <a className="beauty-brand" href="#accueil" aria-label={`${config.business.name}, accueil`}>
          {config.branding.logo ? (
            <img src={config.branding.logo.src} alt={config.branding.logo.alt} />
          ) : (
            <>
              <Sparkles aria-hidden="true" />
              <span>
                {config.business.name}
                <small>{config.business.activity}</small>
              </span>
            </>
          )}
        </a>
        <nav
          id="beauty-navigation"
          className={menuOpen ? "beauty-nav-open" : ""}
          aria-label="Navigation principale"
        >
          {config.navigation.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>
        <a className="beauty-book" href={config.content.hero.primaryAction.href}>
          {config.content.hero.primaryAction.label}
        </a>
        <button
          className="beauty-menu"
          type="button"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-controls="beauty-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Menu aria-hidden="true" />
        </button>
      </header>
      <main>
        <section className="beauty-hero" id="accueil">
          {config.content.hero.image && (
            <img src={config.content.hero.image.src} alt={config.content.hero.image.alt} />
          )}
          <div className="beauty-hero-wash" />
          <div className="beauty-hero-copy">
            <p>{config.business.tagline}</p>
            <h1>{config.content.hero.title}</h1>
            <span>{config.content.hero.subtitle}</span>
            <a href={config.content.hero.primaryAction.href}>
              {config.content.hero.primaryAction.label}
              <ArrowRight />
            </a>
          </div>
        </section>
        <section className="beauty-trust" aria-label="Nos engagements">
          {[
            "Soins personnalisés",
            "Tarifs transparents",
            "Gestes experts",
            "Accueil attentionné",
          ].map((item) => (
            <span key={item}>
              <Sparkles aria-hidden="true" />
              {item}
            </span>
          ))}
        </section>
        {config.content.about.enabled && (
          <section className="beauty-about" id="a-propos">
            <div>
              <p className="beauty-label">{config.content.about.eyebrow}</p>
              <h2>{config.content.about.title}</h2>
              <p>{config.content.about.description}</p>
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
        <section className="beauty-services" id="services">
          <div className="beauty-title">
            <p className="beauty-label">{config.content.services.eyebrow}</p>
            <h2>{config.content.services.title}</h2>
            <span>{config.content.services.description}</span>
          </div>
          <div className="beauty-service-grid">
            {config.content.services.items.map((service, index) => (
              <article key={service.id}>
                {service.image && (
                  <img src={service.image.src} alt={service.image.alt} loading="lazy" />
                )}
                <div>
                  <small>0{index + 1}</small>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        {config.content.gallery.enabled && (
          <section className="beauty-gallery" id="galerie">
            <div>
              <p className="beauty-label">{config.content.gallery.title}</p>
              <h2>{config.business.description}</h2>
            </div>
            <div className="beauty-images">
              {config.content.gallery.images.map((image, index) => (
                <figure key={image.src + index}>
                  <img src={image.src} alt={image.alt} loading="lazy" />
                </figure>
              ))}
            </div>
          </section>
        )}
        {config.content.testimonials.enabled && (
          <section className="beauty-reviews">
            <p className="beauty-label">{config.content.testimonials.title}</p>
            <div>
              {config.content.testimonials.items.map((item) => (
                <blockquote key={item.id}>
                  <span>
                    {[0, 1, 2, 3, 4].map((n) => (
                      <Star key={n} aria-hidden="true" />
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
        <section className="beauty-contact" id="contact">
          <div>
            <p className="beauty-label">{config.content.contact.eyebrow}</p>
            <h2>{config.content.contact.title}</h2>
            <p>{config.content.contact.description}</p>
            <a href={tel}>
              <Phone />
              {config.content.contact.phoneLabel}
            </a>
          </div>
          <address>
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
                {config.business.openingHours.map((h) => (
                  <strong key={h}>{h}</strong>
                ))}
              </span>
            </div>
            <a href={`mailto:${config.business.email}`}>
              <Mail />
              <span>
                <small>{config.content.contact.emailLabel}</small>
                <strong>{config.business.email}</strong>
              </span>
            </a>
          </address>
        </section>
        <section className="beauty-booking" aria-label="Rendez-vous et localisation">
          <form onSubmit={handleAppointment}>
            <p className="beauty-label">Demande de rendez-vous</p>
            <h2>Choisissez votre parenthèse.</h2>
            <p className="beauty-form-intro">
              Votre demande sera préparée dans votre application e-mail. L'institut vous
              recontactera pour confirmer le créneau.
            </p>
            <div className="beauty-form-grid">
              <label>
                Nom et prénom
                <input name="name" autoComplete="name" required />
              </label>
              <label>
                Téléphone
                <input name="phone" type="tel" autoComplete="tel" required />
              </label>
              <label>
                Soin souhaité
                <select name="service" defaultValue={config.content.services.items[0]?.title}>
                  {config.content.services.items.map((service) => (
                    <option key={service.id}>{service.title}</option>
                  ))}
                </select>
              </label>
              <label>
                Date souhaitée
                <input name="date" type="date" required />
              </label>
              <label>
                Créneau souhaité
                <input name="time" type="time" required />
              </label>
              <label className="beauty-form-message">
                Message
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Précisez vos attentes ou contraintes"
                />
              </label>
              <label className="beauty-consent">
                <input name="consent" type="checkbox" required /> J'accepte que mes informations
                soient utilisées pour répondre à cette demande.
              </label>
            </div>
            <button type="submit">
              Envoyer ma demande <ArrowRight />
            </button>
          </form>
          <div className="beauty-location">
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
      <footer className="beauty-footer">
        <strong>{config.business.name}</strong>
        <p>{config.content.footer.tagline}</p>
        <small>{config.content.footer.copyright}</small>
      </footer>
      <div className="beauty-mobile-actions" aria-label="Actions rapides">
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
