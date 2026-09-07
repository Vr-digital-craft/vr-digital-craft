import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, LayoutTemplate } from "lucide-react";
import { runtimeTemplates } from "../../templates/runtime";

export const Route = createFileRoute("/modeles/$templateId")({
  beforeLoad: ({ params }) => {
    if (!(params.templateId in runtimeTemplates)) throw notFound();
  },
  head: ({ params }) => {
    const template = runtimeTemplates[params.templateId];
    if (!template) throw notFound();
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
  const template = runtimeTemplates[templateId];
  if (!template) return null;
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
        <a
          href={`/creer-mon-site?template=${templateId}`}
          className="label-mono flex items-center gap-2 rounded-md bg-neon px-4 py-3 text-[0.65rem] text-primary-foreground"
        >
          <LayoutTemplate className="size-4" />
          Choisir ce modèle
        </a>
      </div>
      <Template config={template.config} />
    </div>
  );
}
