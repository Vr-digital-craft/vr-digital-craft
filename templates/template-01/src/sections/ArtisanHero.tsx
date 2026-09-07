import { ArrowUpRight } from "lucide-react";
import type { SiteConfig } from "../../../../packages/template-core/src";

export function ArtisanHero({ config }: { config: SiteConfig }) {
  const { hero } = config.content;
  return (
    <section className="artisan-hero" id="accueil">
      <div className="artisan-hero-copy">
        <p className="artisan-kicker">{config.business.activity}</p>
        <h1>{hero.title}</h1>
        <p className="artisan-lead">{hero.subtitle}</p>
        <a className="artisan-button" href={hero.primaryAction.href}>
          {hero.primaryAction.label}
          <ArrowUpRight aria-hidden />
        </a>
      </div>
      {hero.image && (
        <figure className="artisan-hero-image">
          <img src={hero.image.src} alt={hero.image.alt} />
          <figcaption>{config.business.tagline}</figcaption>
        </figure>
      )}
    </section>
  );
}
