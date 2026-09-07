import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Download, LoaderCircle, LockKeyhole } from "lucide-react";
import type { SiteConfig } from "../../packages/template-core/src";
import { runtimeTemplates } from "../../templates/runtime";
import { applyLocalAssets, type GeneratedProject } from "@/modules/projects/generated-project";
import { getLocalProject } from "@/modules/projects/browser-project-store";

export const Route = createFileRoute("/apercu/$projectId")({
  head: () => ({
    meta: [
      { title: "Prévisualisation du site | VR Digital" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ProjectPreviewPage,
});

function ProjectPreviewPage() {
  const { projectId } = Route.useParams();
  const [project, setProject] = useState<GeneratedProject | null>(null);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let dispose = () => {};
    getLocalProject(projectId)
      .then((stored) => {
        if (!stored) {
          setError("Cette prévisualisation locale est introuvable dans ce navigateur.");
          return;
        }
        if (!runtimeTemplates[stored.project.templateId]) {
          setError("Le modèle associé à ce projet n'est pas disponible.");
          return;
        }
        const materialized = applyLocalAssets(stored.project, stored.assets);
        dispose = materialized.revoke;
        setProject(stored.project);
        setConfig(materialized.config);
      })
      .catch(() => setError("La prévisualisation locale n'a pas pu être chargée."));
    return () => dispose();
  }, [projectId]);

  function downloadConfig() {
    if (!project) return;
    const blob = new Blob([JSON.stringify(project.config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "site.config.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  if (error) return <PreviewMessage title="Prévisualisation indisponible" description={error} />;
  if (!project || !config)
    return (
      <PreviewMessage
        title="Création de la prévisualisation"
        description="Chargement du projet enregistré dans votre navigateur."
        loading
      />
    );
  const Template = runtimeTemplates[project.templateId]?.Component;
  if (!Template)
    return (
      <PreviewMessage
        title="Modèle indisponible"
        description="Le modèle associé à ce projet n'est plus disponible."
      />
    );

  return (
    <div>
      <div className="fixed inset-x-0 bottom-4 z-[100] mx-auto flex w-[calc(100%-1.5rem)] max-w-4xl flex-wrap items-center justify-between gap-2 rounded-xl border border-white/15 bg-black/90 p-2 text-white shadow-2xl backdrop-blur-xl">
        <a
          href={`/creer-mon-site?template=${project.templateId}&project=${project.id}`}
          className="label-mono flex items-center gap-2 px-3 py-3 text-[0.65rem] hover:text-neon"
        >
          <ArrowLeft className="size-4" />
          Modifier
        </a>
        <span className="label-mono flex items-center gap-2 text-[0.6rem] text-neon">
          <CheckCircle2 className="size-4" />À contrôler
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={downloadConfig}
            className="label-mono flex items-center gap-2 rounded-md border border-white/20 px-3 py-3 text-[0.6rem] hover:border-neon"
          >
            <Download className="size-4" />
            Configuration
          </button>
          <button
            type="button"
            disabled
            title="Publication disponible après validation humaine"
            className="label-mono flex cursor-not-allowed items-center gap-2 rounded-md bg-neon px-3 py-3 text-[0.6rem] text-primary-foreground opacity-60"
          >
            <LockKeyhole className="size-4" />
            Publier
          </button>
        </div>
      </div>
      <Template config={config} />
    </div>
  );
}

function PreviewMessage({
  title,
  description,
  loading = false,
}: {
  title: string;
  description: string;
  loading?: boolean;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="max-w-xl text-center">
        {loading ? (
          <LoaderCircle className="mx-auto size-9 animate-spin text-neon" />
        ) : (
          <LockKeyhole className="mx-auto size-9 text-neon" />
        )}
        <h1 className="font-display mt-6 text-4xl font-bold">{title}</h1>
        <p className="mt-4 text-muted-foreground">{description}</p>
        <a
          href="/modeles"
          className="label-mono mt-7 inline-flex items-center gap-2 text-xs text-neon"
        >
          <ArrowLeft className="size-4" />
          Retour aux modèles
        </a>
      </div>
    </main>
  );
}
