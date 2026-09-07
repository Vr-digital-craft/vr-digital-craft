import { ArrowRight } from "lucide-react";
import type { SiteConfig } from "../../../../packages/template-core/src";

export function ArtisanServices({ config }: { config: SiteConfig }) {
  const { services } = config.content;
  return (
    <section className="artisan-section artisan-services" id="services">
      <div className="artisan-section-heading">
        <p className="artisan-kicker">{services.eyebrow}</p>
        <h2>{services.title}</h2>
        <p>{services.description}</p>
      </div>
      <div className="artisan-service-list">
        {services.items.map((service, index) => (
          <article key={service.id}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
            <ArrowRight aria-hidden />
          </article>
        ))}
      </div>
    </section>
  );
}
