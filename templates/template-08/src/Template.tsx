import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import type { SiteConfig } from "../../../packages/template-core/src";
import "./styles.css";
export function PremiumDarkTemplate({ config }: { config: SiteConfig }) {
  const s = {
    "--gold": config.branding.primaryColor,
    "--black": config.branding.secondaryColor,
  } as CSSProperties;
  return (
    <div className="dark" style={s}>
      <header>
        <strong>{config.business.name}</strong>
        <nav>
          {config.navigation.map((x) => (
            <a key={x.href} href={x.href}>
              {x.label}
            </a>
          ))}
        </nav>
      </header>
      <main>
        <section className="dark-hero" id="accueil">
          <img src={config.content.hero.image?.src} alt={config.content.hero.image?.alt} />
          <div>
            <p>{config.business.activity}</p>
            <h1>{config.content.hero.title}</h1>
            <span>{config.content.hero.subtitle}</span>
            <a href={config.content.hero.primaryAction.href}>
              {config.content.hero.primaryAction.label}
              <ArrowRight />
            </a>
          </div>
        </section>
        <section className="dark-services" id="services">
          <p>{config.content.services.eyebrow}</p>
          <h2>{config.content.services.title}</h2>
          <div>
            {config.content.services.items.map((x, i) => (
              <article key={x.id}>
                <small>0{i + 1}</small>
                <h3>{x.title}</h3>
                <span>{x.description}</span>
              </article>
            ))}
          </div>
        </section>
        <section className="dark-about" id="a-propos">
          <p>{config.content.about.eyebrow}</p>
          <h2>{config.content.about.title}</h2>
          <span>{config.content.about.description}</span>
        </section>
        <section className="dark-contact" id="contact">
          <p>{config.content.contact.eyebrow}</p>
          <h2>{config.content.contact.title}</h2>
          <a href={`mailto:${config.business.email}`}>
            {config.content.contact.emailLabel}
            <ArrowRight />
          </a>
        </section>
      </main>
      <footer>{config.content.footer.copyright}</footer>
    </div>
  );
}
