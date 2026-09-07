import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import type { SiteConfig } from "../../packages/template-core/src";
import artisanConfig from "../../templates/template-01/site.config.json";
import { ArtisanTemplate } from "../../templates/template-01/src/Template";

const availableTemplates = {
  "template-01": {
    name: "Artisan moderne",
    config: artisanConfig as SiteConfig,
    Component: ArtisanTemplate,
  },
};

export const Route = createFileRoute("/modeles/$templateId")({
  beforeLoad: ({ params }) => {
    if (!(params.templateId in availableTemplates)) throw notFound();
  },
  head: ({ params }) => {
    const template = availableTemplates[params.templateId as keyof typeof availableTemplates];
    return {
      meta: [
        { title: `${template.name} — Démonstration | VR Digital` },
        { name: "robots", content: "noindex, nofollow" },
      ],
    };
  },
  component: TemplateDemoPage,
});

function TemplateDemoPage() {
  const { templateId } = Route.useParams();
  const template = availableTemplates[templateId as keyof typeof availableTemplates];
  const Template = template.Component;

  return (
    <div>
      <div className="fixed inset-x-0 bottom-5 z-[100] mx-auto flex w-[calc(100%-2rem)] max-w-xl items-center justify-between gap-3 rounded-xl border border-white/15 bg-black/90 p-2 text-white shadow-2xl backdrop-blur-xl">
        <a
          href="/modeles"
          className="label-mono flex items-center gap-2 px-3 py-3 text-[0.65rem] transition-colors hover:text-neon"
        >
          <ArrowLeft className="size-4" />
          Retour aux modèles
        </a>
        <button
          type="button"
          disabled
          title="Disponible à l'étape suivante"
          className="label-mono flex cursor-not-allowed items-center gap-2 rounded-md bg-neon px-4 py-3 text-[0.65rem] text-primary-foreground opacity-60"
        >
          <LockKeyhole className="size-4" />
          Choisir ce modèle
        </button>
      </div>
      <Template config={template.config} />
    </div>
  );
}
