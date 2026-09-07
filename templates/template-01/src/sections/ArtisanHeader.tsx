import type { SiteConfig } from "../../../../packages/template-core/src";

export function ArtisanHeader({ config }: { config: SiteConfig }) {
  return (
    <header className="artisan-header">
      <a className="artisan-brand" href="#accueil" aria-label={config.business.name}>
        {config.branding.logo ? (
          <img src={config.branding.logo.src} alt={config.branding.logo.alt} />
        ) : (
          <span>{config.business.name}</span>
        )}
      </a>
      <nav aria-label="Navigation principale">
        {config.navigation.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
      <a className="artisan-header-phone" href={`tel:${config.business.phone.replace(/\s/g, "")}`}>
        {config.business.phone}
      </a>
    </header>
  );
}
