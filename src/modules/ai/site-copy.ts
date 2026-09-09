import type { SiteConfig } from "../../../packages/template-core/src";

export type AiProviderName = "cloudflare" | "openai";

export type GeneratedSiteCopy = {
  businessFacts: {
    name: string;
    tagline: string;
    activity: string;
    description: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    openingHours: string;
  };
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutDescription: string;
  contactTitle: string;
  contactDescription: string;
  primaryCta: string;
  footerTagline: string;
  services: Array<{ title: string; description: string }>;
  faq: Array<{ question: string; answer: string }>;
  seoTitle: string;
  seoDescription: string;
};

export const generatedCopySchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    businessFacts: {
      type: "object",
      additionalProperties: false,
      properties: {
        name: { type: "string" },
        tagline: { type: "string" },
        activity: { type: "string" },
        description: { type: "string" },
        phone: { type: "string" },
        email: { type: "string" },
        address: { type: "string" },
        city: { type: "string" },
        openingHours: { type: "string" },
      },
      required: [
        "name",
        "tagline",
        "activity",
        "description",
        "phone",
        "email",
        "address",
        "city",
        "openingHours",
      ],
    },
    heroTitle: { type: "string" },
    heroSubtitle: { type: "string" },
    aboutTitle: { type: "string" },
    aboutDescription: { type: "string" },
    contactTitle: { type: "string" },
    contactDescription: { type: "string" },
    primaryCta: { type: "string" },
    footerTagline: { type: "string" },
    services: {
      type: "array",
      minItems: 1,
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string", minLength: 1 },
          description: { type: "string", minLength: 1 },
        },
        required: ["title", "description"],
      },
    },
    faq: {
      type: "array",
      maxItems: 6,
      items: {
        type: "object",
        additionalProperties: false,
        properties: { question: { type: "string" }, answer: { type: "string" } },
        required: ["question", "answer"],
      },
    },
    seoTitle: { type: "string" },
    seoDescription: { type: "string" },
  },
  required: [
    "businessFacts",
    "heroTitle",
    "heroSubtitle",
    "aboutTitle",
    "aboutDescription",
    "contactTitle",
    "contactDescription",
    "primaryCta",
    "footerTagline",
    "services",
    "faq",
    "seoTitle",
    "seoDescription",
  ],
} as const;

const clean = (value: unknown, fallback: string, maxLength: number) => {
  if (typeof value !== "string") return fallback;
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized ? normalized.slice(0, maxLength) : fallback;
};

export function parseAndSanitizeGeneratedCopy(raw: unknown, config: SiteConfig): GeneratedSiteCopy {
  let value: unknown = raw;
  if (typeof value === "string") {
    const withoutFences = value
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "");
    try {
      value = JSON.parse(withoutFences);
    } catch {
      throw new Error("La réponse IA n'est pas un JSON valide.");
    }
  }
  if (!value || typeof value !== "object") throw new Error("La réponse IA est invalide.");
  const candidate = value as Record<string, unknown>;
  const rawBusinessFacts =
    candidate["businessFacts"] && typeof candidate["businessFacts"] === "object"
      ? (candidate["businessFacts"] as Record<string, unknown>)
      : {};
  const services = Array.isArray(candidate["services"])
    ? candidate["services"].slice(0, 8).flatMap((item, index) => {
        if (!item || typeof item !== "object") return [];
        const current = config.content.services.items[index] ?? config.content.services.items[0];
        const service = item as Record<string, unknown>;
        const title = clean(service["title"], current?.title ?? "Service", 80);
        const description = clean(service["description"], current?.description ?? "", 320);
        return title && description ? [{ title, description }] : [];
      })
    : [];
  if (!services.length) throw new Error("La réponse IA ne contient aucun service valide.");
  const faq = Array.isArray(candidate["faq"])
    ? candidate["faq"].slice(0, 6).flatMap((item) => {
        if (!item || typeof item !== "object") return [];
        const entry = item as Record<string, unknown>;
        const question = clean(entry["question"], "", 140);
        const answer = clean(entry["answer"], "", 400);
        return question && answer ? [{ question, answer }] : [];
      })
    : [];

  return {
    businessFacts: {
      name: clean(rawBusinessFacts["name"], config.business.name, 100),
      tagline: clean(rawBusinessFacts["tagline"], config.business.tagline, 140),
      activity: clean(rawBusinessFacts["activity"], config.business.activity, 100),
      description: clean(rawBusinessFacts["description"], config.business.description, 600),
      phone: clean(rawBusinessFacts["phone"], config.business.phone, 40),
      email: clean(rawBusinessFacts["email"], config.business.email, 160),
      address: clean(rawBusinessFacts["address"], config.business.address, 200),
      city: clean(rawBusinessFacts["city"], config.business.city, 100),
      openingHours: clean(
        rawBusinessFacts["openingHours"],
        config.business.openingHours.join(" · "),
        200,
      ),
    },
    heroTitle: clean(candidate["heroTitle"], config.content.hero.title, 120),
    heroSubtitle: clean(candidate["heroSubtitle"], config.content.hero.subtitle, 280),
    aboutTitle: clean(candidate["aboutTitle"], config.content.about.title, 120),
    aboutDescription: clean(candidate["aboutDescription"], config.content.about.description, 600),
    contactTitle: clean(candidate["contactTitle"], config.content.contact.title, 120),
    contactDescription: clean(
      candidate["contactDescription"],
      config.content.contact.description,
      320,
    ),
    primaryCta: clean(candidate["primaryCta"], config.content.hero.primaryAction.label, 45),
    footerTagline: clean(candidate["footerTagline"], config.content.footer.tagline, 140),
    services,
    faq,
    seoTitle: clean(candidate["seoTitle"], config.seo.title, 65),
    seoDescription: clean(candidate["seoDescription"], config.seo.description, 160),
  };
}

export function applyGeneratedCopy(config: SiteConfig, copy: GeneratedSiteCopy): SiteConfig {
  const next = structuredClone(config);
  next.content.hero.title = copy.heroTitle;
  next.content.hero.subtitle = copy.heroSubtitle;
  next.content.hero.primaryAction.label = copy.primaryCta;
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
  if (copy.faq.length) {
    next.content.faq.enabled = true;
    next.content.faq.items = copy.faq.map((item, index) => ({ id: `faq-${index + 1}`, ...item }));
  }
  next.seo.title = copy.seoTitle;
  next.seo.description = copy.seoDescription;
  return next;
}

export function applyGeneratedCopyPreservingStructuredFacts(
  config: SiteConfig,
  copy: GeneratedSiteCopy,
): SiteConfig {
  const next = applyGeneratedCopy(config, copy);
  next.business = structuredClone(config.business);
  next.socialLinks = structuredClone(config.socialLinks);
  next.content.services.items = structuredClone(config.content.services.items);
  return next;
}
