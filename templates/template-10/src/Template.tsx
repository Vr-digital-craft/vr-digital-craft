import type { CSSProperties } from "react";
import { ArrowDown, ArrowRight, Phone } from "lucide-react";
import type { SiteConfig } from "../../../packages/template-core/src";
import "./styles.css";
export function OnePageTemplate({ config }: { config: SiteConfig }) {
  const s = {
    "--one-pop": config.branding.primaryColor,
    "--one-dark": config.branding.secondaryColor,
  } as CSSProperties;
  return (
    <div className="one" style={s}>
      <header>
        <strong>{config.business.name}</strong>
        <a href={`tel:${config.business.phone.replace(/\s/g, "")}`}>
          <Phone />
          {config.business.phone}
        </a>
      </header>
      <main>
        <section className="one-hero" id="accueil">
          <p>
            {config.business.activity} · {config.business.city}
          </p>
          <h1>{config.content.hero.title}</h1>
          <span>{config.content.hero.subtitle}</span>
          <a href="#services">
            <ArrowDown />
            Découvrir
          </a>
        </section>
        <section className="one-services" id="services">
          <div>
            <p>{config.content.services.eyebrow}</p>
            <h2>{config.content.services.title}</h2>
          </div>
          {config.content.services.items.map((x, i) => (
            <article key={x.id}>
              <small>0{i + 1}</small>
              <h3>{x.title}</h3>
              <span>{x.description}</span>
            </article>
          ))}
        </section>
        <section className="one-about" id="a-propos">
          <p>{config.content.about.eyebrow}</p>
          <h2>{config.content.about.title}</h2>
          <span>{config.content.about.description}</span>
        </section>
        <section className="one-review" id="avis">
          <h2>{config.content.testimonials.title}</h2>
          <blockquote>
            “{config.content.testimonials.items[0]?.quote}”
            <footer>{config.content.testimonials.items[0]?.author}</footer>
          </blockquote>
        </section>
        <section className="one-contact" id="contact">
          <p>{config.content.contact.eyebrow}</p>
          <h2>{config.content.contact.title}</h2>
          <a href={`mailto:${config.business.email}`}>
            {config.content.contact.emailLabel}
            <ArrowRight />
          </a>
          <strong>{config.business.phone}</strong>
        </section>
      </main>
      <footer>{config.content.footer.copyright}</footer>
    </div>
  );
}
