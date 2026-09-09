import { useState, type CSSProperties, type FormEvent } from "react";
import { ArrowRight, Clock3, Mail, MapPin, Menu, Phone, ShoppingBag, Star } from "lucide-react";
import { getDirectionsUrl, type SiteConfig } from "../../../packages/template-core/src";
import "./styles.css";
export function CommerceTemplate({ config }: { config: SiteConfig }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(
    config.content.services.items[0]?.title ?? "Produit en boutique",
  );
  const theme = {
    "--shop-red": config.branding.primaryColor,
    "--shop-blue": config.branding.secondaryColor,
  } as CSSProperties;
  const tel = `tel:${config.business.phone.replace(/\s/g, "")}`;
  const locationLabel = `${config.business.address}, ${config.business.city}`;
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(locationLabel)}&output=embed`;
  const directionsUrl = getDirectionsUrl(config.socialLinks.google, locationLabel);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
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

  function handleProductRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `Disponibilité en boutique — ${String(data.get("product") || "Produit")}`;
    const body = [
      `Nom : ${String(data.get("name") || "")}`,
      `Téléphone : ${String(data.get("phone") || "")}`,
      `Produit recherché : ${String(data.get("product") || "")}`,
      "",
      String(data.get("message") || ""),
    ].join("\n");
    window.location.href = `mailto:${config.business.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  return (
    <div className="shop-site" style={theme}>
      <header className="shop-header">
        <a className="shop-brand" href="#accueil" aria-label={`${config.business.name}, accueil`}>
          {config.branding.logo ? (
            <img src={config.branding.logo.src} alt={config.branding.logo.alt} />
          ) : (
            <>
              <ShoppingBag aria-hidden="true" />
              <strong>{config.business.name}</strong>
            </>
          )}
        </a>
        <nav
          id="shop-navigation"
          className={menuOpen ? "shop-nav-open" : ""}
          aria-label="Navigation principale"
        >
          {config.navigation.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>
        <a className="shop-visit" href="#contact">
          Nous trouver
          <ArrowRight />
        </a>
        <button
          className="shop-menu"
          type="button"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-controls="shop-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Menu aria-hidden="true" />
        </button>
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
        <section className="shop-trust" aria-label="Les atouts de la boutique">
          {[
            "Sélection indépendante",
            "Créateurs locaux",
            "Petites séries",
            config.business.openingHours[0] ?? "Accueil en boutique",
          ].map((item) => (
            <span key={item}>
              <ShoppingBag aria-hidden="true" />
              {item}
            </span>
          ))}
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
                <a href="#product-inquiry" onClick={() => setSelectedProduct(s.title)}>
                  Vérifier la disponibilité <ArrowRight aria-hidden="true" />
                </a>
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
        <section
          className="shop-inquiry"
          id="product-inquiry"
          aria-label="Disponibilité et localisation"
        >
          <form onSubmit={handleProductRequest}>
            <p className="shop-label">Disponibilité en boutique</p>
            <h2>Vous recherchez un produit ?</h2>
            <p className="shop-form-intro">
              Préparez votre demande : votre application e-mail s'ouvrira avec les informations
              utiles pour la boutique.
            </p>
            <div className="shop-form-grid">
              <label>
                Nom et prénom
                <input name="name" autoComplete="name" required />
              </label>
              <label>
                Téléphone
                <input name="phone" type="tel" autoComplete="tel" required />
              </label>
              <label className="shop-form-product">
                Produit ou catégorie
                <select
                  name="product"
                  value={selectedProduct}
                  onChange={(event) => setSelectedProduct(event.target.value)}
                >
                  {config.content.services.items.map((product) => (
                    <option key={product.id}>{product.title}</option>
                  ))}
                </select>
              </label>
              <label className="shop-form-message">
                Votre demande
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Couleur, quantité, référence ou date souhaitée"
                />
              </label>
              <label className="shop-consent">
                <input name="consent" type="checkbox" required /> J'accepte que mes informations
                soient utilisées pour répondre à cette demande.
              </label>
            </div>
            <button type="submit">
              Envoyer ma demande <ArrowRight />
            </button>
          </form>
          <div className="shop-location">
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
      <footer className="shop-footer">
        <strong>{config.business.name}</strong>
        <p>{config.content.footer.tagline}</p>
        <small>{config.content.footer.copyright}</small>
      </footer>
      <div className="shop-mobile-actions" aria-label="Actions rapides">
        <a href={tel}>
          <Phone aria-hidden="true" /> Appeler
        </a>
        <a href={directionsUrl} target="_blank" rel="noreferrer">
          <MapPin aria-hidden="true" /> Itinéraire
        </a>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </div>
  );
}
