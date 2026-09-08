import { useState, type CSSProperties, type FormEvent } from "react";
import { ArrowRight, Clock3, Mail, MapPin, Menu, Phone, Star } from "lucide-react";
import type { SiteConfig } from "../../../packages/template-core/src";
import "./styles.css";
export function RealEstateTemplate({ config }: { config: SiteConfig }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(
    config.content.services.items[0]?.title ?? "Projet immobilier",
  );
  const style = {
    "--estate-gold": config.branding.primaryColor,
    "--estate-dark": config.branding.secondaryColor,
  } as CSSProperties;
  const tel = `tel:${config.business.phone.replace(/\s/g, "")}`;
  const locationLabel = `${config.business.address}, ${config.business.city}`;
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(locationLabel)}&output=embed`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationLabel)}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
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

  function handleEstimate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `Demande immobilière — ${String(data.get("requestType") || "Projet")}`;
    const body = [
      `Nom : ${String(data.get("name") || "")}`,
      `Téléphone : ${String(data.get("phone") || "")}`,
      `Demande : ${String(data.get("requestType") || "")}`,
      `Bien : ${String(data.get("property") || "")}`,
      `Ville / quartier : ${String(data.get("location") || "")}`,
      `Surface approximative : ${String(data.get("surface") || "")}`,
      "",
      String(data.get("message") || ""),
    ].join("\n");
    window.location.href = `mailto:${config.business.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  return (
    <div className="estate-site" style={style}>
      <header>
        <a className="estate-brand" href="#accueil" aria-label={`${config.business.name}, accueil`}>
          {config.branding.logo ? (
            <img src={config.branding.logo.src} alt={config.branding.logo.alt} />
          ) : (
            <>
              <strong>{config.business.name}</strong>
              <small>{config.business.activity}</small>
            </>
          )}
        </a>
        <nav
          id="estate-navigation"
          className={menuOpen ? "estate-nav-open" : ""}
          aria-label="Navigation principale"
        >
          {config.navigation.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>
        <a className="estate-call" href={tel}>
          <Phone />
          {config.business.phone}
        </a>
        <button
          className="estate-menu"
          type="button"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-controls="estate-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Menu aria-hidden="true" />
        </button>
      </header>
      <main>
        <section className="estate-hero" id="accueil">
          {config.content.hero.image && (
            <img src={config.content.hero.image.src} alt={config.content.hero.image.alt} />
          )}
          <div className="estate-shade" />
          <div className="estate-hero-copy">
            <p>{config.business.tagline}</p>
            <h1>{config.content.hero.title}</h1>
            <span>{config.content.hero.subtitle}</span>
            <a href={config.content.hero.primaryAction.href}>
              {config.content.hero.primaryAction.label}
              <ArrowRight />
            </a>
          </div>
        </section>
        <section className="estate-trust" aria-label="Les engagements de l'agence">
          {[
            "Estimation confidentielle",
            "Expertise locale",
            "Suivi personnalisé",
            "Interlocuteur dédié",
          ].map((item) => (
            <span key={item}>
              <MapPin aria-hidden="true" />
              {item}
            </span>
          ))}
        </section>
        <section className="estate-listings" id="biens">
          <div className="estate-heading">
            <p>{config.content.services.eyebrow}</p>
            <h2>{config.content.services.title}</h2>
            <span>{config.content.services.description}</span>
          </div>
          <div className="estate-cards">
            {config.content.services.items.map((s) => (
              <article key={s.id}>
                {s.image && <img src={s.image.src} alt={s.image.alt} loading="lazy" />}
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                  <a
                    href="#estate-inquiry"
                    onClick={() => setSelectedProperty(s.title)}
                    aria-label={`Demander des informations sur ${s.title}`}
                  >
                    Voir le bien <ArrowRight aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
        {config.content.about.enabled && (
          <section className="estate-about" id="agence">
            <div>
              <p>{config.content.about.eyebrow}</p>
              <h2>{config.content.about.title}</h2>
              <span>{config.content.about.description}</span>
              <a href="#contact">
                {config.content.contact.emailLabel}
                <ArrowRight />
              </a>
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
          <section className="estate-area" id="secteur">
            <div>
              <p>{config.business.city}</p>
              <h2>{config.content.gallery.title}</h2>
            </div>
            <div>
              {config.content.gallery.images.map((im, i) => (
                <img key={im.src + i} src={im.src} alt={im.alt} loading="lazy" />
              ))}
            </div>
          </section>
        )}
        {config.content.testimonials.enabled && (
          <section className="estate-reviews">
            <h2>{config.content.testimonials.title}</h2>
            <div>
              {config.content.testimonials.items.map((x) => (
                <blockquote key={x.id}>
                  <span>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star key={i} aria-hidden="true" />
                    ))}
                  </span>
                  <p>“{x.quote}”</p>
                  <footer>
                    {x.author} · {x.role}
                  </footer>
                </blockquote>
              ))}
            </div>
          </section>
        )}
        <section className="estate-contact" id="contact">
          <div>
            <p>{config.content.contact.eyebrow}</p>
            <h2>{config.content.contact.title}</h2>
            <span>{config.content.contact.description}</span>
            <a href={`mailto:${config.business.email}`}>
              {config.content.contact.emailLabel}
              <ArrowRight />
            </a>
          </div>
          <address>
            <div>
              <MapPin />
              <span>
                <small>{config.content.contact.addressLabel}</small>
                <strong>
                  {config.business.address}, {config.business.city}
                </strong>
              </span>
            </div>
            <div>
              <Clock3 />
              <span>
                <small>{config.content.contact.hoursLabel}</small>
                {config.business.openingHours.map((h) => (
                  <strong key={h}>{h}</strong>
                ))}
              </span>
            </div>
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
                <small>Email</small>
                <strong>{config.business.email}</strong>
              </span>
            </a>
          </address>
        </section>
        <section
          className="estate-inquiry"
          id="estate-inquiry"
          aria-label="Estimation et localisation"
        >
          <form onSubmit={handleEstimate}>
            <p>Votre projet immobilier</p>
            <h2>Recevez un premier avis confidentiel.</h2>
            <span>
              Votre demande sera préparée dans votre application e-mail. L'agence vous recontactera
              pour préciser votre projet.
            </span>
            <div className="estate-form-grid">
              <label>
                Nom et prénom
                <input name="name" autoComplete="name" required />
              </label>
              <label>
                Téléphone
                <input name="phone" type="tel" autoComplete="tel" required />
              </label>
              <label>
                Votre demande
                <select name="requestType" defaultValue="Estimer mon bien">
                  <option>Estimer mon bien</option>
                  <option>Vendre un bien</option>
                  <option>Acheter un bien</option>
                  <option>Obtenir des informations</option>
                </select>
              </label>
              <label>
                Bien concerné
                <select
                  name="property"
                  value={selectedProperty}
                  onChange={(event) => setSelectedProperty(event.target.value)}
                >
                  <option>Mon propre bien</option>
                  {config.content.services.items.map((property) => (
                    <option key={property.id}>{property.title}</option>
                  ))}
                </select>
              </label>
              <label>
                Ville ou quartier
                <input name="location" autoComplete="address-level2" required />
              </label>
              <label>
                Surface approximative
                <input name="surface" inputMode="numeric" placeholder="Ex. 95 m²" />
              </label>
              <label className="estate-form-message">
                Votre projet
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Décrivez le bien, votre recherche ou votre calendrier"
                />
              </label>
              <label className="estate-consent">
                <input name="consent" type="checkbox" required /> J'accepte que mes informations
                soient utilisées pour répondre à cette demande.
              </label>
            </div>
            <button type="submit">
              Envoyer ma demande <ArrowRight />
            </button>
          </form>
          <div className="estate-location">
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
      <footer>
        <strong>{config.business.name}</strong>
        <p>{config.content.footer.tagline}</p>
        <small>{config.content.footer.copyright}</small>
      </footer>
      <div className="estate-mobile-actions" aria-label="Actions rapides">
        <a href={tel}>
          <Phone aria-hidden="true" /> Appeler
        </a>
        <a href="#estate-inquiry">
          <MapPin aria-hidden="true" /> Estimer
        </a>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </div>
  );
}
