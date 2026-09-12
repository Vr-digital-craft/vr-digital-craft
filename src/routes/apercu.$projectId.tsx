import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  LoaderCircle,
  LockKeyhole,
  PackageCheck,
  Send,
} from "lucide-react";
import type { SiteConfig } from "../../packages/template-core/src";
import { runtimeTemplates } from "../../templates/runtime";
import {
  applyLocalAssets,
  type GeneratedProject,
  type ProjectAssets,
} from "@/modules/projects/generated-project";
import { getAdminSession } from "@/modules/admin/admin-auth.functions";
import { getLocalProject, updateLocalProject } from "@/modules/projects/browser-project-store";
import { exportProjectPackage } from "@/modules/projects/export-project";
import { sendReviewNotification } from "@/modules/projects/send-review-notification.functions";

export const Route = createFileRoute("/apercu/$projectId")({
  loader: () => getAdminSession(),
  head: () => ({
    meta: [
      { title: "Prévisualisation du site | VR Digital" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ProjectPreviewPage,
});

function ProjectPreviewPage() {
  const adminSession = Route.useLoaderData();
  const isAdmin = adminSession.authenticated && adminSession.role === "admin";
  const { projectId } = Route.useParams();
  const [project, setProject] = useState<GeneratedProject | null>(null);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [assets, setAssets] = useState<ProjectAssets>({ logo: null, photos: [] });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [validating, setValidating] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [prepared, setPrepared] = useState(false);

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
        setAssets(stored.assets);
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

  async function sendForReview() {
    if (!project || sending) return;
    setSending(true);
    const submittedProject = { ...project, status: "informations_recues" as const };
    try {
      await sendReviewNotification({
        data: {
          projectId: project.id,
          templateId: project.templateId,
          companyName: project.config.business.name,
          activity: project.config.business.activity,
          city: project.config.business.city,
          clientEmail: project.config.business.email,
        },
      });
      await updateLocalProject(submittedProject);
      setProject(submittedProject);
      setSent(true);
    } catch (notificationError) {
      setError(
        notificationError instanceof Error
          ? notificationError.message
          : "La notification n'a pas pu être envoyée.",
      );
    } finally {
      setSending(false);
    }
  }

  async function prepareSite() {
    if (!project || !isAdmin || project.status !== "valide" || preparing) return;
    setPreparing(true);
    setError("");
    try {
      await exportProjectPackage(project, assets);
      setPrepared(true);
    } catch {
      setError("Le dossier complet du site n'a pas pu être préparé.");
    } finally {
      setPreparing(false);
    }
  }

  async function validateProject() {
    if (!project || !isAdmin || validating) return;
    setValidating(true);
    setError("");
    try {
      const validatedProject = { ...project, status: "valide" as const };
      await updateLocalProject(validatedProject);
      setProject(validatedProject);
    } catch {
      setError("Le projet n'a pas pu être validé.");
    } finally {
      setValidating(false);
    }
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
        {isAdmin ? (
          <>
            <span className="label-mono flex items-center gap-2 text-[0.6rem] text-neon">
              <CheckCircle2 className="size-4" />
              {project.status === "valide" ? "Validé" : "À contrôler"}
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={downloadConfig}
                className="label-mono flex items-center gap-2 rounded-md border border-white/20 px-3 py-3 text-[0.6rem] hover:border-neon"
              >
                <Download className="size-4" />
                Configuration
              </button>
              {project.status !== "valide" && (
                <button
                  type="button"
                  onClick={validateProject}
                  disabled={validating}
                  className="label-mono flex items-center gap-2 rounded-md border border-neon px-3 py-3 text-[0.6rem] text-neon disabled:opacity-60"
                >
                  {validating ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="size-4" />
                  )}
                  {validating ? "Validation…" : "Valider le projet"}
                </button>
              )}
              <button
                type="button"
                onClick={prepareSite}
                disabled={project.status !== "valide" || preparing}
                title={
                  project.status === "valide"
                    ? "Télécharger le site prêt à héberger"
                    : "Validez d'abord le projet depuis l'administration"
                }
                className="label-mono flex items-center gap-2 rounded-md bg-neon px-3 py-3 text-[0.6rem] text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                {preparing ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <PackageCheck className="size-4" />
                )}
                {preparing ? "Préparation…" : prepared ? "Site téléchargé" : "Préparer le site"}
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={sendForReview}
            disabled={sending || sent}
            className="label-mono flex items-center gap-2 rounded-md bg-neon px-4 py-3 text-[0.6rem] text-primary-foreground disabled:opacity-70"
          >
            {sent ? <CheckCircle2 className="size-4" /> : <Send className="size-4" />}
            {sending ? "Envoi…" : sent ? "Envoyé pour contrôle" : "Envoyer pour validation"}
          </button>
        )}
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
