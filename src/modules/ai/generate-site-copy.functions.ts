import { createServerFn } from "@tanstack/react-start";
import type { SiteConfig } from "../../../packages/template-core/src";
import { requireAdminSession } from "../admin/admin-session.server";
import { generateWithFallback } from "./providers.server";

export type GenerateInput = {
  config: SiteConfig;
  templateId?: string;
  interventionArea?: string;
  tone?: string;
  adminPrompt?: string;
  mode?: "structured" | "prompt" | "combined";
};

function validateInput(value: unknown): GenerateInput {
  if (!value || typeof value !== "object" || !("config" in value)) {
    throw new Error("Configuration du site invalide.");
  }
  const input = value as GenerateInput;
  if (input.mode === "prompt") {
    if (!input.adminPrompt || input.adminPrompt.trim().length < 20) {
      throw new Error("Décrivez le site à générer avec au moins 20 caractères.");
    }
  } else if (!input.config.business?.name || !input.config.business?.activity) {
    throw new Error("Le nom et l'activité de l'entreprise sont nécessaires.");
  }
  return input;
}

export const generateSiteCopy = createServerFn({ method: "POST" })
  .validator(validateInput)
  .handler(async ({ data }) => {
    await requireAdminSession();
    return generateWithFallback(data);
  });
