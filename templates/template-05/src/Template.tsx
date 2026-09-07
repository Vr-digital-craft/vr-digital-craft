import type { CSSProperties } from "react";
import { ArrowRight, Clock3, Mail, MapPin, Menu, Phone, ShoppingBag, Star } from "lucide-react";
import type { SiteConfig } from "../../../packages/template-core/src";
import "./styles.css";
export function CommerceTemplate({ config }: { config: SiteConfig }) {
  const theme = {
    "--shop-red": config.branding.primaryColor,
    "--shop-blue": config.branding.secondaryColor,
  } as CSSProperties;
  const tel = `tel:${config.business.phone.replace(/\s/g, "")}`;
  return (
    <div className="shop-site" style={theme}>
      <header className="shop-header">
        <a className="shop-brand" href="#accueil">
          {config.branding.logo ? (
            <img src={config.branding.logo.src} alt={config.branding.logo.alt} />
          ) : (
            <>
              <ShoppingBag />
              <strong>{config.business.name}</strong>
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
        <a className="shop-visit" href="#contact">
          Nous trouver
          <ArrowRight />
        </a>
        <Menu className="shop-menu" />
      </header>
      <main>
        <section className="shop-hero" id="accueil">
          <div className="shop-copy">
            <p>
              {config.business.activity} · {config.business.city}
            </p>
            <h1>{config.content.hero.title}</h1>
            <span>{config.content.hero.subtitle}</span>
            <a href={config.content.hero.primaryAction.href}>
              {config.content.hero.primaryAction.label}
              <ArrowRight />
            </a>
          </div>
          {config.content.hero.image && (
            <figure>
              <img src={config.content.hero.image.src} alt={config.content.hero.image.alt} />
              <figcaption>{config.business.tagline}</figcaption>
            </figure>
          )}
        </section>
        {config.content.about.enabled && (
          <section className="shop-about" id="a-propos">
            {config.content.about.image && (
              <img
                src={config.content.about.image.src}
                alt={config.content.about.image.alt}
                loading="lazy"
              />
            )}
            <div>
              <p className="shop-label">{config.content.about.eyebrow}</p>
              <h2>{config.content.about.title}</h2>
              <p>{config.content.about.description}</p>
            </div>
          </section>
        )}
        <section className="shop-products" id="produits">
          <div className="shop-heading">
            <p className="shop-label">{config.content.services.eyebrow}</p>
            <h2>{config.content.services.title}</h2>
            <span>{config.content.services.description}</span>
          </div>
          <div className="shop-grid">
            {config.content.services.items.map((s, i) => (
              <article key={s.id}>
                {s.image && <img src={s.image.src} alt={s.image.alt} loading="lazy" />}
                <small>0{i + 1}</small>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
              </article>
            ))}
          </div>
        </section>
        {config.content.gallery.enabled && (
          <section className="shop-news" id="nouveautes">
            <div>
              <p className="shop-label">{config.content.gallery.title}</p>
              <h2>{config.business.tagline}</h2>
            </div>
            <div className="shop-gallery">
              {config.content.gallery.images.map((im, i) => (
                <img key={im.src + i} src={im.src} alt={im.alt} loading="lazy" />
              ))}
            </div>
          </section>
        )}
        {config.content.testimonials.enabled && (
          <section className="shop-reviews">
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
        <section className="shop-contact" id="contact">
          <div>
            <p className="shop-label">{config.content.contact.eyebrow}</p>
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
      <footer className="shop-footer">
        <strong>{config.business.name}</strong>
        <p>{config.content.footer.tagline}</p>
        <small>{config.content.footer.copyright}</small>
      </footer>
    </div>
  );
}
