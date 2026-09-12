import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";

type ReviewNotificationInput = {
  projectId: string;
  templateId: string;
  companyName: string;
  activity: string;
  city: string;
  clientEmail: string;
};

function cleanText(value: unknown, label: string, maxLength = 160): string {
  if (typeof value !== "string") throw new Error(`${label} est manquant.`);
  const cleaned = value.trim().replace(/[\r\n]+/g, " ").slice(0, maxLength);
  if (!cleaned) throw new Error(`${label} est manquant.`);
  return cleaned;
}

function validateInput(value: unknown): ReviewNotificationInput {
  if (!value || typeof value !== "object") throw new Error("Projet invalide.");
  const input = value as Record<string, unknown>;
  const clientEmail = cleanText(input["clientEmail"], "L'adresse e-mail", 254);
  if (!/^\S+@\S+\.\S+$/.test(clientEmail)) throw new Error("L'adresse e-mail est invalide.");

  return {
    projectId: cleanText(input["projectId"], "La référence du projet", 100),
    templateId: cleanText(input["templateId"], "Le modèle", 100),
    companyName: cleanText(input["companyName"], "Le nom de l'entreprise"),
    activity: cleanText(input["activity"], "L'activité"),
    city: cleanText(input["city"], "La ville"),
    clientEmail,
  };
}

export const sendReviewNotification = createServerFn({ method: "POST" })
  .validator(validateInput)
  .handler(async ({ data }) => {
    const apiKey = (env as unknown as { RESEND_API_KEY?: string }).RESEND_API_KEY;
    if (!apiKey) throw new Error("L'envoi d'e-mail n'est pas encore configuré.");

    const subject = `Nouveau site à contrôler — ${data.companyName}`;
    const text = [
      "Un nouveau projet vient d'être envoyé pour contrôle.",
      "",
      `Entreprise : ${data.companyName}`,
      `Activité : ${data.activity}`,
      `Ville : ${data.city}`,
      `E-mail du client : ${data.clientEmail}`,
      `Modèle : ${data.templateId}`,
      `Référence : ${data.projectId}`,
    ].join("\n");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "VR Digital <onboarding@resend.dev>",
        to: ["vrdigital.contact@gmail.com"],
        reply_to: data.clientEmail,
        subject,
        text,
      }),
    });

    if (!response.ok) {
      console.error("Resend notification failed", response.status, await response.text());
      throw new Error("La notification n'a pas pu être envoyée.");
    }

    return { sent: true };
  });
