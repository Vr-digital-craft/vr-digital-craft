import type { CSSProperties } from "react";
import type { SiteConfig } from "../../../packages/template-core/src";
import { ArtisanHeader } from "./sections/ArtisanHeader";
import { ArtisanHero } from "./sections/ArtisanHero";
import { ArtisanServices } from "./sections/ArtisanServices";
import { ArtisanAbout } from "./sections/ArtisanAbout";
import { ArtisanContact } from "./sections/ArtisanContact";
import "./styles.css";

export type ArtisanTemplateProps = { config: SiteConfig };

export function ArtisanTemplate({ config }: ArtisanTemplateProps) {
  const colors = {
    "--artisan-primary": config.branding.primaryColor,
    "--artisan-secondary": config.branding.secondaryColor,
  } as CSSProperties;

  return (
    <div className="artisan-site" style={colors}>
      <ArtisanHeader config={config} />
      <main>
        <ArtisanHero config={config} />
        <ArtisanServices config={config} />
        {config.content.about.enabled && <ArtisanAbout config={config} />}
        <ArtisanContact config={config} />
      </main>
    </div>
  );
}
