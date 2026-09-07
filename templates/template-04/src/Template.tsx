import type { CSSProperties } from "react";
import { ArrowRight, Clock3, Mail, MapPin, Menu, Phone, Sparkles, Star } from "lucide-react";
import type { SiteConfig } from "../../../packages/template-core/src";
import "./styles.css";

export function BeautyTemplate({ config }: { config: SiteConfig }) {
  const theme = {
    "--beauty-accent": config.branding.primaryColor,
    "--beauty-dark": config.branding.secondaryColor,
  } as CSSProperties;
  const tel = `tel:${config.business.phone.replace(/\s/g, "")}`;
  return (
    <div className="beauty-site" style={theme}>
      <header className="beauty-header">
        <a className="beauty-brand" href="#accueil">
          {config.branding.logo ? (
            <img src={config.branding.logo.src} alt={config.branding.logo.alt} />
          ) : (
            <>
              <Sparkles />
              <span>
                {config.business.name}
                <small>{config.business.activity}</small>
              </span>
            </>
          )}
        </a>
        <nav>
          {config.navigation.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <a className="beauty-book" href={config.content.hero.primaryAction.href}>
          {config.content.hero.primaryAction.label}
        </a>
        <Menu className="beauty-menu" />
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
          <section className="beauty-gallery" id="equipe">
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
                      <Star key={n} />
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
            <a href={`mailto:${config.business.email}`}>
              <Mail />
              <span>
                <small>{config.content.contact.emailLabel}</small>
                <strong>{config.business.email}</strong>
              </span>
            </a>
          </address>
        </section>
      </main>
      <footer className="beauty-footer">
        <strong>{config.business.name}</strong>
        <p>{config.content.footer.tagline}</p>
        <small>{config.content.footer.copyright}</small>
      </footer>
    </div>
  );
}
