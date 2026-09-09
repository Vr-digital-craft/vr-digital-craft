import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Archive,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FilePenLine,
  FolderKanban,
  Globe2,
  LoaderCircle,
  RotateCcw,
  LockKeyhole,
  LogOut,
  Sparkles,
} from "lucide-react";
import { getAdminSession, loginAdmin, logoutAdmin } from "@/modules/admin/admin-auth.functions";
import { generateSiteCopy } from "@/modules/ai/generate-site-copy.functions";
import { applyGeneratedCopy } from "@/modules/ai/site-copy";
import { getAllLocalProjects, updateLocalProject } from "@/modules/projects/browser-project-store";
import type { GeneratedProject, ProjectStatus } from "@/modules/projects/generated-project";

export const Route = createFileRoute("/admin")({
  loader: () => getAdminSession(),
  head: () => ({
    meta: [
      { title: "Administration locale | VR Digital" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const statusLabels: Record<ProjectStatus, string> = {
  nouveau: "Nouveau",
  informations_recues: "Informations reçues",
  generation_ia: "Génération IA",
  a_controler: "À contrôler",
  modification_demandee: "Modification demandée",
  valide: "Validé",
  publie: "Publié",
};

type Filter = "actifs" | "a_controler" | "valides" | "publies" | "archives";

function AdminPage() {
  const adminSession = Route.useLoaderData();

  if (!adminSession.authenticated) {
    return <AdminLogin configured={adminSession.configured} />;
  }

  return <AdminDashboard />;
}

function AdminLogin({ configured }: { configured: boolean }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const result = await loginAdmin({ data: { password } });
      if (!result.success) {
        setError(result.error);
        return;
      }
      window.location.reload();
    } catch {
      setError("Connexion impossible pour le moment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <section className="w-full max-w-md rounded-xl border border-border bg-card p-7 shadow-2xl sm:p-9">
        <div className="flex size-12 items-center justify-center rounded-lg bg-neon text-primary-foreground">
          <LockKeyhole className="size-6" />
        </div>
        <p className="eyebrow mt-7">Espace privé VR Digital</p>
        <h1 className="font-display mt-3 text-4xl font-bold">Administration</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Saisissez votre mot de passe pour accéder aux projets clients.
        </p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <div>
            <label htmlFor="admin-password" className="label-mono text-xs text-muted-foreground">
              Mot de passe
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoFocus
              className="mt-2 w-full rounded-md border border-border bg-background px-4 py-3.5 outline-none transition-colors focus:border-neon"
            />
          </div>
          {(!configured || error) && (
            <p role="alert" className="text-sm text-red-300">
              {error || "La protection doit être configurée avant la mise en ligne."}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting || !configured}
            className="label-mono flex w-full items-center justify-center rounded-md bg-neon px-4 py-4 text-xs text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "CONNEXION…" : "SE CONNECTER"}
          </button>
        </form>
        <a
          href="/"
          className="mt-6 block text-center text-sm text-muted-foreground hover:text-foreground"
        >
          Retour au site
        </a>
      </section>
    </main>
  );
}

function AdminDashboard() {
  const [projects, setProjects] = useState<GeneratedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("actifs");

  useEffect(() => {
    getAllLocalProjects()
      .then(setProjects)
      .catch(() => setError("Les projets locaux n'ont pas pu être chargés."))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(
    () => ({
      actifs: projects.filter((project) => !project.archived).length,
      a_controler: projects.filter(
        (project) => !project.archived && project.status === "a_controler",
      ).length,
      valides: projects.filter((project) => !project.archived && project.status === "valide")
        .length,
      publies: projects.filter((project) => !project.archived && project.status === "publie")
        .length,
      archives: projects.filter((project) => project.archived).length,
    }),
    [projects],
  );

  const visibleProjects = projects.filter((project) => {
    if (filter === "archives") return project.archived;
    if (project.archived) return false;
    if (filter === "actifs") return true;
    if (filter === "a_controler") return project.status === "a_controler";
    if (filter === "valides") return project.status === "valide";
    return project.status === "publie";
  });

  async function changeProject(project: GeneratedProject, changes: Partial<GeneratedProject>) {
    const updated = { ...project, ...changes, updatedAt: new Date().toISOString() };
    await updateLocalProject(updated);
    setProjects((current) => current.map((item) => (item.id === project.id ? updated : item)));
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-8 lg:px-12 lg:py-10">
      <header className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 border-b border-border pb-7">
        <div>
          <p className="eyebrow">Espace de travail local</p>
          <h1 className="font-display mt-3 text-4xl font-bold sm:text-6xl">Administration</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/modeles"
            className="label-mono flex items-center gap-2 rounded-md border border-border px-4 py-3 text-xs hover:border-neon"
          >
            <ArrowLeft className="size-4" /> Retour au site
          </a>
          <button
            type="button"
            onClick={async () => {
              await logoutAdmin();
              window.location.reload();
            }}
            className="label-mono flex items-center gap-2 rounded-md border border-border px-4 py-3 text-xs text-muted-foreground hover:border-neon hover:text-foreground"
          >
            <LogOut className="size-4" /> Déconnexion
          </button>
        </div>
      </header>

      <div className="mx-auto mt-8 grid max-w-7xl gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside className="space-y-2 lg:sticky lg:top-8 lg:self-start">
          <p className="label-mono mb-4 px-3 text-[0.65rem] text-muted-foreground">Navigation</p>
          <AdminFilter
            icon={FolderKanban}
            label="Tous les projets"
            count={counts.actifs}
            active={filter === "actifs"}
            onClick={() => setFilter("actifs")}
          />
          <AdminFilter
            icon={Clock3}
            label="À contrôler"
            count={counts.a_controler}
            active={filter === "a_controler"}
            onClick={() => setFilter("a_controler")}
          />
          <AdminFilter
            icon={CheckCircle2}
            label="Validés"
            count={counts.valides}
            active={filter === "valides"}
            onClick={() => setFilter("valides")}
          />
          <AdminFilter
            icon={Globe2}
            label="Publiés"
            count={counts.publies}
            active={filter === "publies"}
            onClick={() => setFilter("publies")}
          />
          <AdminFilter
            icon={Archive}
            label="Archives"
            count={counts.archives}
            active={filter === "archives"}
            onClick={() => setFilter("archives")}
          />
          <div className="mt-6 rounded-lg border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
            Les projets sont enregistrés uniquement dans ce navigateur. Votre session privée expire
            automatiquement après 8 heures.
          </div>
        </aside>

        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Suivi des sites</p>
              <h2 className="font-display mt-2 text-3xl font-semibold">
                {visibleProjects.length} projet{visibleProjects.length > 1 ? "s" : ""}
              </h2>
            </div>
            <a href="/modeles" className="label-mono text-xs text-neon">
              + Nouveau site
            </a>
          </div>

          {loading ? (
            <div className="flex min-h-72 items-center justify-center rounded-xl border border-border bg-card">
              <LoaderCircle className="size-8 animate-spin text-neon" />
            </div>
          ) : error ? (
            <div
              role="alert"
              className="rounded-xl border border-red-400/30 bg-red-400/10 p-6 text-red-200"
            >
              {error}
            </div>
          ) : visibleProjects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center sm:p-16">
              <FolderKanban className="mx-auto size-10 text-neon" />
              <h3 className="font-display mt-5 text-2xl font-semibold">Aucun projet ici</h3>
              <p className="mt-2 text-muted-foreground">
                Créez un site depuis la bibliothèque de modèles pour le retrouver dans cet espace.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {visibleProjects.map((project) => (
                <ProjectCard key={project.id} project={project} onChange={changeProject} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function AdminFilter({
  icon: Icon,
  label,
  count,
  active,
  onClick,
}: {
  icon: typeof FolderKanban;
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-3.5 text-left text-sm transition-colors ${active ? "bg-neon text-primary-foreground" : "text-muted-foreground hover:bg-card hover:text-foreground"}`}
    >
      <Icon className="size-4" />
      <span className="flex-1">{label}</span>
      <span className="font-display text-xs font-bold">{count}</span>
    </button>
  );
}

function ProjectCard({
  project,
  onChange,
}: {
  project: GeneratedProject;
  onChange: (project: GeneratedProject, changes: Partial<GeneratedProject>) => Promise<void>;
}) {
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const date = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(
    new Date(project.updatedAt),
  );

  async function regenerateWithAi() {
    setAiLoading(true);
    setAiMessage("");
    try {
      const result = await generateSiteCopy({
        data: { config: project.config, templateId: project.templateId },
      });
      await onChange(project, {
        config: applyGeneratedCopy(project.config, result.copy),
        status: "a_controler",
        lastAiProvider: result.provider,
        lastAiModel: result.model,
      });
      setAiMessage(
        `Textes générés avec ${result.provider === "cloudflare" ? "Cloudflare AI" : "OpenAI"}.`,
      );
    } catch (error) {
      setAiMessage(
        error instanceof Error
          ? error.message
          : "L'IA est indisponible. Vous pouvez continuer manuellement.",
      );
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <article className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-border-strong sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label-mono text-[0.6rem] text-neon">{statusLabels[project.status]}</p>
          <h3 className="font-display mt-3 text-2xl font-semibold">
            {project.config.business.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {project.config.business.activity} · {project.config.business.city}
          </p>
          {project.lastAiProvider && (
            <p className="label-mono mt-2 text-[0.6rem] text-muted-foreground">
              IA · {project.lastAiProvider === "cloudflare" ? "Cloudflare AI" : "OpenAI"}
            </p>
          )}
        </div>
        <span className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground">
          {project.templateId}
        </span>
      </div>
      <p className="mt-6 border-t border-border pt-4 text-sm text-muted-foreground">
        Mis à jour le {date}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <a
          href={`/apercu/${project.id}`}
          className="flex items-center gap-2 rounded-md bg-neon px-3 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          <ExternalLink className="size-4" /> Voir le site
        </a>
        <a
          href={`/creer-mon-site?template=${project.templateId}&project=${project.id}`}
          className="flex items-center gap-2 rounded-md border border-border px-3 py-2.5 text-sm hover:border-neon"
        >
          <FilePenLine className="size-4" /> Modifier
        </a>
        {!project.archived && (
          <button
            type="button"
            onClick={regenerateWithAi}
            disabled={aiLoading}
            className="flex items-center gap-2 rounded-md border border-border px-3 py-2.5 text-sm hover:border-neon disabled:cursor-wait disabled:opacity-60"
          >
            {aiLoading ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {aiLoading ? "Génération…" : "Générer avec l'IA"}
          </button>
        )}
        {!project.archived && project.status !== "valide" && (
          <button
            type="button"
            onClick={() => onChange(project, { status: "valide" })}
            className="flex items-center gap-2 rounded-md border border-border px-3 py-2.5 text-sm hover:border-neon"
          >
            <CheckCircle2 className="size-4" /> Valider
          </button>
        )}
        <button
          type="button"
          onClick={() => onChange(project, { archived: !project.archived })}
          className="flex items-center gap-2 rounded-md border border-border px-3 py-2.5 text-sm text-muted-foreground hover:border-neon hover:text-foreground"
        >
          {project.archived ? <RotateCcw className="size-4" /> : <Archive className="size-4" />}
          {project.archived ? "Restaurer" : "Archiver"}
        </button>
      </div>
      {aiMessage && (
        <p role="status" className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {aiMessage}
        </p>
      )}
    </article>
  );
}
