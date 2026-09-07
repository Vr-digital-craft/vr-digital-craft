import type { CSSProperties } from "react";
import { ArrowDown, ArrowRight, Clock3, Mail, MapPin, Menu, Phone, Star } from "lucide-react";
import type { SiteConfig } from "../../../packages/template-core/src";
import "./styles.css";

export function RestaurantTemplate({ config }: { config: SiteConfig }) {
  const colors = {
    "--restaurant-wine": config.branding.primaryColor,
    "--restaurant-green": config.branding.secondaryColor,
  } as CSSProperties;
  const tel = `tel:${config.business.phone.replace(/\s/g, "")}`;

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
        <nav aria-label="Navigation principale">
          {config.navigation.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <a className="restaurant-book" href={config.content.hero.primaryAction.href}>
          {config.content.hero.primaryAction.label}
          <ArrowRight />
        </a>
        <Menu className="restaurant-menu-icon" aria-hidden="true" />
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
                      <Star key={star} />
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
      </main>

      <footer className="restaurant-footer">
        <div className="restaurant-brand">
          <small>Restaurant</small>
          <strong>{config.business.name}</strong>
        </div>
        <p>{config.content.footer.tagline}</p>
        <small>{config.content.footer.copyright}</small>
      </footer>
    </div>
  );
}
