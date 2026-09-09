export type {
  SiteConfig,
  SiteImage,
  SiteLink,
  SiteService,
  TemplateMetadata,
  TemplateSector,
} from "./site-config.types";
export { validateSiteConfig, type ValidationResult } from "./validation";

export function getDirectionsUrl(googleMapsUrl: string, locationLabel: string) {
  const candidate = googleMapsUrl.trim();
  if (candidate) {
    try {
      const url = new URL(candidate);
      if (url.protocol === "https:" || url.protocol === "http:") return url.toString();
    } catch {
      // Une URL invalide utilise simplement le lien de secours construit avec l'adresse.
    }
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationLabel)}`;
}
