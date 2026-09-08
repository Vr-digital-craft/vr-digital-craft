import type { CSSProperties } from "react";
import { ArrowRight, Check, Plus } from "lucide-react";
import type { SiteConfig } from "../../../packages/template-core/src";
import "./styles.css";
export function ProfessionalTemplate({ config }: { config: SiteConfig }) {
  const s = {
    "--pro-main": config.branding.primaryColor,
    "--pro-dark": config.branding.secondaryColor,
  } as CSSProperties;
  return (
    <div className="pro" style={s}>
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
        <section className="pro-hero" id="accueil">
          <div>
            <p>{config.business.activity}</p>
            <h1>{config.content.hero.title}</h1>
            <span>{config.content.hero.subtitle}</span>
            <a href={config.content.hero.primaryAction.href}>
              {config.content.hero.primaryAction.label}
              <ArrowRight />
            </a>
          </div>
          <img src={config.content.hero.image?.src} alt={config.content.hero.image?.alt} />
        </section>
        <section className="pro-services" id="services">
          <p>{config.content.services.eyebrow}</p>
          <h2>{config.content.services.title}</h2>
          <div>
            {config.content.services.items.map((x) => (
              <article key={x.id}>
                <Check />
                <h3>{x.title}</h3>
                <span>{x.description}</span>
              </article>
            ))}
          </div>
        </section>
        <section className="pro-method" id="methode">
          <p>{config.content.about.eyebrow}</p>
          <h2>{config.content.about.title}</h2>
          <span>{config.content.about.description}</span>
        </section>
        {config.content.faq.enabled && (
          <section className="pro-faq" id="faq">
            <h2>{config.content.faq.title}</h2>
            {config.content.faq.items.map((x) => (
              <details key={x.id}>
                <summary>
                  {x.question}
                  <Plus />
                </summary>
                <p>{x.answer}</p>
              </details>
            ))}
          </section>
        )}
        <section className="pro-contact" id="contact">
          <p>{config.content.contact.eyebrow}</p>
          <h2>{config.content.contact.title}</h2>
          <span>{config.content.contact.description}</span>
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
