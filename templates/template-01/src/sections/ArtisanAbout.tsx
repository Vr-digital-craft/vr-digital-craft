import type { SiteConfig } from "../../../../packages/template-core/src";

export function ArtisanAbout({ config }: { config: SiteConfig }) {
  const { about } = config.content;
  return (
    <section className="artisan-section artisan-about" id="a-propos">
      {about.image && <img src={about.image.src} alt={about.image.alt} />}
      <div>
        <p className="artisan-kicker">{about.eyebrow}</p>
        <h2>{about.title}</h2>
        <p>{about.description}</p>
        <blockquote>{config.business.tagline}</blockquote>
      </div>
    </section>
  );
}
