import { createServerFn } from "@tanstack/react-start";
import type { SiteConfig } from "../../../packages/template-core/src";
import type { GeneratedSiteCopy } from "./site-copy";

type GenerateInput = { config: SiteConfig };

const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    heroTitle: { type: "string" },
    heroSubtitle: { type: "string" },
    aboutTitle: { type: "string" },
    aboutDescription: { type: "string" },
    contactTitle: { type: "string" },
    contactDescription: { type: "string" },
    footerTagline: { type: "string" },
    services: {
      type: "array",
      minItems: 1,
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          description: { type: "string" },
        },
        required: ["title", "description"],
      },
    },
    seoTitle: { type: "string" },
    seoDescription: { type: "string" },
  },
  required: [
    "heroTitle",
    "heroSubtitle",
    "aboutTitle",
    "aboutDescription",
    "contactTitle",
    "contactDescription",
    "footerTagline",
    "services",
    "seoTitle",
    "seoDescription",
  ],
} as const;

function validateInput(value: unknown): GenerateInput {
  if (!value || typeof value !== "object" || !("config" in value)) {
    throw new Error("Configuration du site invalide.");
  }
  return value as GenerateInput;
}

export const generateSiteCopy = createServerFn({ method: "POST" })
  .validator(validateInput)
  .handler(async ({ data }) => {
    const apiKey = process.env["OPENAI_API_KEY"];
    if (!apiKey) {
      throw new Error("La génération IA n'est pas encore configurée.");
    }

    const { config } = data;
    const input = {
      businessName: config.business.name,
      activity: config.business.activity,
      city: config.business.city,
      description: config.business.description,
      currentContent: {
        hero: config.content.hero,
        about: config.content.about,
        services: config.content.services.items,
      },
    };

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env["OPENAI_MODEL"] || "gpt-5.4-mini",
        store: false,
        instructions:
          "Tu es le rédacteur web de VR Digital. Rédige en français naturel, précis et crédible pour un site vitrine local. N'invente jamais de certification, d'ancienneté, de tarif, d'avis client ou de promesse non fournie. Garde les coordonnées et les faits inchangés. Produis des textes concis, différenciés et optimisés pour la ville et l'activité indiquées.",
        input: JSON.stringify(input),
        reasoning: { effort: "low" },
        text: {
          verbosity: "low",
          format: {
            type: "json_schema",
            name: "vr_digital_site_copy",
            strict: true,
            schema: outputSchema,
          },
        },
      }),
    });

    if (!response.ok) {
      console.error("OpenAI response error", response.status);
      throw new Error("Le service de génération IA est momentanément indisponible.");
    }

    const result = (await response.json()) as {
      output_text?: string;
      output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
    };
    const outputText =
      result.output_text ??
      result.output
        ?.flatMap((item) => item.content ?? [])
        .find((item) => item.type === "output_text")?.text;
    if (!outputText) throw new Error("La génération IA n'a renvoyé aucun contenu.");
    return JSON.parse(outputText) as GeneratedSiteCopy;
  });
