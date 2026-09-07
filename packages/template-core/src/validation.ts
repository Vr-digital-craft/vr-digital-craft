import type { SiteConfig } from "./site-config.types";

export type ValidationResult =
  { success: true; data: SiteConfig } | { success: false; errors: string[] };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export function validateSiteConfig(value: unknown): ValidationResult {
  const errors: string[] = [];
  if (!isRecord(value)) return { success: false, errors: ["La configuration doit être un objet."] };

  if (value["schemaVersion"] !== 1) errors.push("schemaVersion doit être égal à 1.");
  if (!Array.isArray(value["navigation"])) errors.push("navigation doit être une liste.");
  for (const section of ["business", "branding", "content", "socialLinks", "seo"] as const) {
    if (!isRecord(value[section])) errors.push(`${section} doit être un objet.`);
  }

  const business = value["business"];
  if (isRecord(business)) {
    for (const field of [
      "name",
      "tagline",
      "activity",
      "description",
      "phone",
      "email",
      "address",
      "city",
    ] as const) {
      if (typeof business[field] !== "string") errors.push(`business.${field} doit être un texte.`);
    }
    if (!Array.isArray(business["openingHours"]))
      errors.push("business.openingHours doit être une liste.");
  }

  const branding = value["branding"];
  if (isRecord(branding)) {
    for (const field of ["primaryColor", "secondaryColor", "favicon"] as const) {
      if (typeof branding[field] !== "string") errors.push(`branding.${field} doit être un texte.`);
    }
  }

  const content = value["content"];
  if (isRecord(content)) {
    if (!isRecord(content["hero"])) errors.push("content.hero doit être un objet.");
    for (const field of [
      "services",
      "about",
      "gallery",
      "testimonials",
      "faq",
      "contact",
      "footer",
    ] as const) {
      if (!isRecord(content[field])) errors.push(`content.${field} doit être un objet.`);
    }
    if (isRecord(content["services"]) && !Array.isArray(content["services"]["items"]))
      errors.push("content.services.items doit être une liste.");
  }

  const seo = value["seo"];
  if (isRecord(seo)) {
    for (const field of ["title", "description", "socialImage"] as const) {
      if (typeof seo[field] !== "string") errors.push(`seo.${field} doit être un texte.`);
    }
  }

  return errors.length ? { success: false, errors } : { success: true, data: value as SiteConfig };
}
