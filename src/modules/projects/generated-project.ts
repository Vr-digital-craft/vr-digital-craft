import type { SiteConfig } from "../../../packages/template-core/src";
import type { ClientBriefDraft } from "./client-brief";

export type ProjectStatus =
  | "nouveau"
  | "informations_recues"
  | "generation_ia"
  | "a_controler"
  | "modification_demandee"
  | "valide"
  | "publie";

export type GeneratedProject = {
  id: string;
  slug: string;
  templateId: string;
  templateVersion: number;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
  config: SiteConfig;
};

export type ProjectAssets = {
  logo: File | null;
  photos: File[];
};

export function slugify(value: string) {
  return (
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "nouveau-site"
  );
}

export function generateProject(
  brief: ClientBriefDraft,
  baseConfig: SiteConfig,
  templateVersion: number,
): GeneratedProject {
  const now = new Date().toISOString();
  const slug = slugify(brief.companyName);
  const config = structuredClone(baseConfig);
  const serviceItems = brief.services.length
    ? brief.services.map((line, index) => {
        const [rawTitle, ...rawDescription] = line.split("|");
        const title = rawTitle?.trim() || `Service ${index + 1}`;
        return {
          id: slugify(title),
          title,
          description:
            rawDescription.join("|").trim() ||
            `${title}, réalisé avec soin par ${brief.companyName} à ${brief.city}.`,
        };
      })
    : config.content.services.items;

  config.business = {
    name: brief.companyName,
    tagline: brief.tagline,
    activity: brief.activity,
    description: brief.description,
    phone: brief.phone,
    email: brief.email,
    address: brief.address,
    city: brief.city,
    openingHours: brief.openingHours ? [brief.openingHours] : [],
  };
  config.branding.primaryColor = brief.colors.primary || config.branding.primaryColor;
  config.branding.secondaryColor = brief.colors.secondary || config.branding.secondaryColor;
  config.content.hero.title = brief.tagline || `${brief.activity} à ${brief.city}.`;
  config.content.hero.subtitle = brief.description;
  config.content.services.items = serviceItems;
  config.content.about.title = `${brief.companyName}, votre partenaire à ${brief.city}.`;
  config.content.about.description = brief.companyStory;
  config.content.contact.title = `Parlons de votre projet avec ${brief.companyName}.`;
  config.content.contact.description = brief.description;
  config.content.footer.tagline = `${brief.activity} à ${brief.city}.`;
  config.content.footer.copyright = `© ${brief.companyName} — Tous droits réservés`;
  config.socialLinks = brief.socialLinks;
  config.seo.title = `${brief.activity} à ${brief.city} | ${brief.companyName}`;
  config.seo.description = brief.description.slice(0, 160);

  return {
    id: slug,
    slug,
    templateId: brief.templateId,
    templateVersion,
    status: "a_controler",
    createdAt: now,
    updatedAt: now,
    archived: false,
    config,
  };
}

export function applyLocalAssets(project: GeneratedProject, assets: ProjectAssets) {
  const config = structuredClone(project.config);
  const objectUrls: string[] = [];
  const assetUrl = (file: File) => {
    const url = URL.createObjectURL(file);
    objectUrls.push(url);
    return url;
  };

  if (assets.logo) {
    config.branding.logo = { src: assetUrl(assets.logo), alt: `Logo ${config.business.name}` };
  }
  if (assets.photos[0]) {
    config.content.hero.image = {
      src: assetUrl(assets.photos[0]),
      alt: `${config.business.activity} — ${config.business.name}`,
    };
  }
  if (assets.photos[1]) {
    config.content.about.image = {
      src: assetUrl(assets.photos[1]),
      alt: `${config.business.name} à ${config.business.city}`,
    };
  }

  return { config, revoke: () => objectUrls.forEach((url) => URL.revokeObjectURL(url)) };
}
