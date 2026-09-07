import type { CSSProperties } from "react";
import { ArrowRight, Clock3, Mail, MapPin, Menu, Phone, Star } from "lucide-react";
import type { SiteConfig } from "../../../packages/template-core/src";
import "./styles.css";
export function RealEstateTemplate({ config }: { config: SiteConfig }) {
  const style = {
    "--estate-gold": config.branding.primaryColor,
    "--estate-dark": config.branding.secondaryColor,
  } as CSSProperties;
  const tel = `tel:${config.business.phone.replace(/\s/g, "")}`;
  return (
    <div className="estate-site" style={style}>
      <header>
        <a className="estate-brand" href="#accueil">
          {config.branding.logo ? (
            <img src={config.branding.logo.src} alt={config.branding.logo.alt} />
          ) : (
            <>
              <strong>{config.business.name}</strong>
              <small>{config.business.activity}</small>
            </>
          )}
        </a>
        <nav>
          {config.navigation.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <a className="estate-call" href={tel}>
          <Phone />
          {config.business.phone}
        </a>
        <Menu className="estate-menu" />
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
                  <ArrowRight />
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
                      <Star key={i} />
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
      </main>
      <footer>
        <strong>{config.business.name}</strong>
        <p>{config.content.footer.tagline}</p>
        <small>{config.content.footer.copyright}</small>
      </footer>
    </div>
  );
}
