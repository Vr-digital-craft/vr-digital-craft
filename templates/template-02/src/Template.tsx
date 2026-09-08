import { useState, type CSSProperties, type FormEvent } from "react";
import { ArrowDown, ArrowRight, Clock3, Mail, MapPin, Menu, Phone, Star } from "lucide-react";
import type { SiteConfig } from "../../../packages/template-core/src";
import "./styles.css";

export function RestaurantTemplate({ config }: { config: SiteConfig }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const colors = {
    "--restaurant-wine": config.branding.primaryColor,
    "--restaurant-green": config.branding.secondaryColor,
  } as CSSProperties;
  const tel = `tel:${config.business.phone.replace(/\s/g, "")}`;
  const locationLabel = `${config.business.address}, ${config.business.city}`;
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(locationLabel)}&output=embed`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationLabel)}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: config.business.name,
    description: config.business.description,
    telephone: config.business.phone,
    email: config.business.email,
    servesCuisine: "Cuisine française de saison",
    address: {
      "@type": "PostalAddress",
      streetAddress: config.business.address,
      addressLocality: config.business.city,
      addressCountry: "FR",
    },
    image: config.seo.socialImage,
  };

  function handleReservation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `Demande de réservation — ${String(data.get("date") || "Restaurant")}`;
    const body = [
      `Nom : ${String(data.get("name") || "")}`,
      `Téléphone : ${String(data.get("phone") || "")}`,
      `Date : ${String(data.get("date") || "")}`,
      `Heure : ${String(data.get("time") || "")}`,
      `Nombre de personnes : ${String(data.get("guests") || "")}`,
      "",
      String(data.get("message") || ""),
    ].join("\n");
    window.location.href = `mailto:${config.business.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <div className="restaurant-site" style={colors}>
      <header className="restaurant-header">
        <a
          className="restaurant-brand"
          href="#accueil"
          aria-label={`${config.business.name}, accueil`}
        >
          {config.branding.logo ? (
            <img src={config.branding.logo.src} alt={config.branding.logo.alt} />
          ) : (
            <>
              <small>Restaurant</small>
              <strong>{config.business.name}</strong>
            </>
          )}
        </a>
        <nav
          id="restaurant-navigation"
          className={menuOpen ? "restaurant-nav-open" : ""}
          aria-label="Navigation principale"
        >
          {config.navigation.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>
        <a className="restaurant-book" href={config.content.hero.primaryAction.href}>
          {config.content.hero.primaryAction.label}
          <ArrowRight />
        </a>
        <button
          className="restaurant-menu-icon"
          type="button"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-controls="restaurant-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Menu aria-hidden="true" />
        </button>
      </header>

      <main>
        <section className="restaurant-hero" id="accueil">
          <div className="restaurant-hero-copy">
            <p className="restaurant-kicker">
              {config.business.activity} · {config.business.city}
            </p>
            <h1>{config.content.hero.title}</h1>
            <p>{config.content.hero.subtitle}</p>
            <div className="restaurant-hero-actions">
              <a className="restaurant-solid-button" href={config.content.hero.primaryAction.href}>
                {config.content.hero.primaryAction.label}
                <ArrowRight />
              </a>
              <a className="restaurant-text-link" href="#menu">
                Découvrir la carte
                <ArrowDown />
              </a>
            </div>
          </div>
          <figure>
            {config.content.hero.image && (
              <img src={config.content.hero.image.src} alt={config.content.hero.image.alt} />
            )}
            <figcaption>{config.business.tagline}</figcaption>
          </figure>
        </section>

        {config.content.about.enabled && (
          <section className="restaurant-about" id="a-propos">
            <div className="restaurant-about-image">
              {config.content.about.image && (
                <img
                  src={config.content.about.image.src}
                  alt={config.content.about.image.alt}
                  loading="lazy"
                />
              )}
              <span>{config.business.city}</span>
            </div>
            <div className="restaurant-about-copy">
              <p className="restaurant-kicker">{config.content.about.eyebrow}</p>
              <h2>{config.content.about.title}</h2>
              <p>{config.content.about.description}</p>
              <blockquote>“{config.business.tagline}”</blockquote>
            </div>
          </section>
        )}

        <section className="restaurant-menu" id="menu">
          <div className="restaurant-section-heading">
            <p className="restaurant-kicker">{config.content.services.eyebrow}</p>
            <h2>{config.content.services.title}</h2>
            <span>{config.content.services.description}</span>
          </div>
          <div className="restaurant-menu-list">
            {config.content.services.items.map((item, index) => (
              <article key={item.id}>
                <small>{String(index + 1).padStart(2, "0")}</small>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <span aria-hidden="true">✦</span>
              </article>
            ))}
          </div>
        </section>

        {config.content.gallery.enabled && (
          <section className="restaurant-gallery" id="galerie">
            <div className="restaurant-section-heading">
              <p className="restaurant-kicker">En images</p>
              <h2>{config.content.gallery.title}</h2>
            </div>
            <div className="restaurant-gallery-grid">
              {config.content.gallery.images.map((image, index) => (
                <figure key={`${image.src}-${index}`}>
                  <img src={image.src} alt={image.alt} loading="lazy" />
                </figure>
              ))}
            </div>
          </section>
        )}

        {config.content.testimonials.enabled && (
          <section className="restaurant-testimonials">
            <p className="restaurant-kicker">Vos mots</p>
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
                    <strong>{item.author}</strong> · {item.role}
                  </footer>
                </blockquote>
              ))}
            </div>
          </section>
        )}

        <section className="restaurant-contact" id="contact">
          <div className="restaurant-contact-lead">
            <p className="restaurant-kicker">{config.content.contact.eyebrow}</p>
            <h2>{config.content.contact.title}</h2>
            <p>{config.content.contact.description}</p>
            <a className="restaurant-light-button" href={tel}>
              <Phone />
              {config.content.contact.phoneLabel}
            </a>
          </div>
          <address>
            <div>
              <MapPin />
              <span>
                <small>{config.content.contact.addressLabel}</small>
                <strong>
                  {config.business.address}
                  <br />
                  {config.business.city}
                </strong>
              </span>
            </div>
            <div>
              <Clock3 />
              <span>
                <small>{config.content.contact.hoursLabel}</small>
                {config.business.openingHours.map((hours) => (
                  <strong key={hours}>{hours}</strong>
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
            <a href={tel}>
              <Phone />
              <span>
                <small>Téléphone</small>
                <strong>{config.business.phone}</strong>
              </span>
            </a>
          </address>
        </section>
        <section className="restaurant-reservation" aria-label="Réservation et localisation">
          <form onSubmit={handleReservation}>
            <p className="restaurant-kicker">Demande de réservation</p>
            <h2>Préparez votre venue.</h2>
            <p className="restaurant-form-intro">
              Votre demande sera préparée dans votre application e-mail. La table reste à confirmer
              par le restaurant.
            </p>
            <div className="restaurant-form-grid">
              <label>
                Nom et prénom
                <input name="name" autoComplete="name" required />
              </label>
              <label>
                Téléphone
                <input name="phone" type="tel" autoComplete="tel" required />
              </label>
              <label>
                Date souhaitée
                <input name="date" type="date" required />
              </label>
              <label>
                Heure souhaitée
                <input name="time" type="time" required />
              </label>
              <label>
                Nombre de personnes
                <input name="guests" type="number" min="1" max="30" required />
              </label>
              <label className="restaurant-form-message">
                Message
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Allergies, poussette, occasion particulière…"
                />
              </label>
              <label className="restaurant-consent">
                <input name="consent" type="checkbox" required /> J'accepte que mes informations
                soient utilisées pour répondre à cette demande.
              </label>
            </div>
            <button className="restaurant-solid-button" type="submit">
              Envoyer ma demande <ArrowRight />
            </button>
          </form>
          <div className="restaurant-location">
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

      <footer className="restaurant-footer">
        <div className="restaurant-brand">
          <small>Restaurant</small>
          <strong>{config.business.name}</strong>
        </div>
        <p>{config.content.footer.tagline}</p>
        <small>{config.content.footer.copyright}</small>
      </footer>
      <div className="restaurant-mobile-actions" aria-label="Actions rapides">
        <a href={tel}>
          <Phone aria-hidden="true" /> Appeler
        </a>
        <a href="#contact">
          <Clock3 aria-hidden="true" /> Réserver
        </a>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </div>
  );
}
