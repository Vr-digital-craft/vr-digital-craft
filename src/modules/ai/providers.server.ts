import { env } from "cloudflare:workers";
import type { GenerateInput } from "./generate-site-copy.functions";
import {
  generatedCopySchema,
  parseAndSanitizeGeneratedCopy,
  type AiProviderName,
  type GeneratedSiteCopy,
} from "./site-copy";

const DEFAULT_CLOUDFLARE_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const DEFAULT_OPENAI_MODEL = "gpt-5.4-mini";
const TIMEOUT_MS = 30_000;

type ProviderResult = {
  copy: GeneratedSiteCopy;
  provider: AiProviderName;
  model: string;
};

type AiBinding = {
  run: (model: string, input: Record<string, unknown>) => Promise<unknown>;
};

type AiProvider = {
  name: AiProviderName;
  configured: () => boolean;
  generate: (input: GenerateInput) => Promise<ProviderResult>;
};

function buildPrompt(input: GenerateInput) {
  const { config } = input;
  return JSON.stringify({
    entreprise: {
      nom: config.business.name,
      activite: config.business.activity,
      ville: config.business.city,
      zoneIntervention: input.interventionArea || config.business.city,
      descriptionFournie: config.business.description,
      sloganFourni: config.business.tagline,
    },
    modele: input.templateId || "site-vitrine",
    tonSouhaite: input.tone || "professionnel, naturel, précis et rassurant",
    servicesFournis: config.content.services.items.map(({ title, description }) => ({
      titre: title,
      description,
    })),
    contenuActuel: {
      hero: config.content.hero,
      presentation: config.content.about,
      contact: config.content.contact,
      seo: config.seo,
    },
  });
}

const systemPrompt = `Tu es le rédacteur web de VR Digital. Rédige en français naturel pour un site vitrine professionnel local.
Respecte strictement les faits fournis. N'invente jamais de certification, ancienneté, avis, garantie, tarif, adresse, prestation ou résultat.
Évite les formules génériques, les répétitions et le bourrage de mots-clés. Localise sobrement le SEO selon l'activité, la ville et la zone d'intervention.
Les appels à l'action doivent être courts et adaptés à l'activité. Les FAQ doivent uniquement répondre à partir des informations fournies.
Retourne exclusivement un objet conforme au schéma JSON demandé.`;

async function withTimeout<T>(promise: Promise<T>, provider: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error(`${provider} n'a pas répondu dans le délai prévu.`)),
          TIMEOUT_MS,
        );
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function cloudflareBinding(): AiBinding | null {
  return (env as unknown as { AI?: AiBinding }).AI ?? null;
}

const cloudflareProvider: AiProvider = {
  name: "cloudflare",
  configured: () => cloudflareBinding() !== null,
  async generate(input) {
    const ai = cloudflareBinding();
    if (!ai) throw new Error("La liaison Cloudflare Workers AI n'est pas disponible.");
    const model = process.env["CLOUDFLARE_AI_MODEL"] || DEFAULT_CLOUDFLARE_MODEL;
    const result = await withTimeout(
      ai.run(model, {
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: buildPrompt(input) },
        ],
        temperature: 0.35,
        max_tokens: 2_200,
        response_format: { type: "json_schema", json_schema: generatedCopySchema },
      }),
      "Cloudflare AI",
    );
    const response = (result as { response?: unknown }).response ?? result;
    return {
      copy: parseAndSanitizeGeneratedCopy(response, input.config),
      provider: "cloudflare",
      model,
    };
  },
};

const openAiProvider: AiProvider = {
  name: "openai",
  configured: () => Boolean(process.env["OPENAI_API_KEY"]),
  async generate(input) {
    const apiKey = process.env["OPENAI_API_KEY"];
    if (!apiKey) throw new Error("OpenAI n'est pas configuré.");
    const model = process.env["OPENAI_MODEL"] || DEFAULT_OPENAI_MODEL;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        signal: controller.signal,
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          store: false,
          instructions: systemPrompt,
          input: buildPrompt(input),
          reasoning: { effort: "low" },
          text: {
            verbosity: "low",
            format: {
              type: "json_schema",
              name: "vr_digital_site_copy",
              strict: true,
              schema: generatedCopySchema,
            },
          },
        }),
      });
      if (!response.ok) throw new Error(`OpenAI a répondu avec le statut ${response.status}.`);
      const result = (await response.json()) as {
        output_text?: string;
        output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
      };
      const outputText =
        result.output_text ??
        result.output
          ?.flatMap((item) => item.content ?? [])
          .find((item) => item.type === "output_text")?.text;
      if (!outputText) throw new Error("OpenAI n'a renvoyé aucun contenu.");
      return {
        copy: parseAndSanitizeGeneratedCopy(outputText, input.config),
        provider: "openai",
        model,
      };
    } finally {
      clearTimeout(timeout);
    }
  },
};

export async function generateWithFallback(input: GenerateInput): Promise<ProviderResult> {
  const preferred = process.env["AI_PROVIDER"] === "openai" ? "openai" : "cloudflare";
  const providers =
    preferred === "openai"
      ? [openAiProvider, cloudflareProvider]
      : [cloudflareProvider, openAiProvider];
  const failures: string[] = [];

  for (const provider of providers) {
    if (!provider.configured()) continue;
    try {
      return await provider.generate(input);
    } catch (error) {
      console.error(`${provider.name} generation failed`, error);
      failures.push(provider.name);
    }
  }

  throw new Error(
    failures.length
      ? "La génération IA est temporairement indisponible. Vous pouvez continuer et modifier les textes manuellement."
      : "Aucun fournisseur IA n'est configuré. Vous pouvez continuer et modifier les textes manuellement.",
  );
}
