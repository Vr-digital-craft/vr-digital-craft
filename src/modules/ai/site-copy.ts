import type { SiteConfig } from "../../../packages/template-core/src";

export type GeneratedSiteCopy = {
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutDescription: string;
  contactTitle: string;
  contactDescription: string;
  footerTagline: string;
  services: Array<{ title: string; description: string }>;
  seoTitle: string;
  seoDescription: string;
};

export function applyGeneratedCopy(config: SiteConfig, copy: GeneratedSiteCopy): SiteConfig {
  const next = structuredClone(config);
  next.content.hero.title = copy.heroTitle;
  next.content.hero.subtitle = copy.heroSubtitle;
  next.content.about.title = copy.aboutTitle;
  next.content.about.description = copy.aboutDescription;
  next.content.contact.title = copy.contactTitle;
  next.content.contact.description = copy.contactDescription;
  next.content.footer.tagline = copy.footerTagline;
  next.content.services.items = copy.services.map((service, index) => ({
    id: `service-${index + 1}`,
    title: service.title,
    description: service.description,
  }));
  next.seo.title = copy.seoTitle;
  next.seo.description = copy.seoDescription;
  return next;
}
