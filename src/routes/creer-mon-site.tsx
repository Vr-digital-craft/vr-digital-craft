import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, ImagePlus, ShieldCheck } from "lucide-react";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { SiteContentProvider } from "@/components/site/content";
import { getSiteContent } from "@/lib/site-content.functions";
import { createClientBriefDraft, type ClientBriefDraft } from "@/modules/projects/client-brief";
import { generateProject, type ProjectAssets } from "@/modules/projects/generated-project";
import { getLocalProject, saveLocalProject } from "@/modules/projects/browser-project-store";
import { templateRegistry } from "../../templates/registry";
import { runtimeTemplates } from "../../templates/runtime";

type Search = { template: string; project: string };

export const Route = createFileRoute("/creer-mon-site")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    template: typeof search["template"] === "string" ? search["template"] : "",
    project: typeof search["project"] === "string" ? search["project"] : "",
  }),
  loader: () => getSiteContent(),
  head: () => ({
    meta: [
      { title: "Créer mon site | VR Digital" },
      { name: "description", content: "Personnalisez votre futur site vitrine VR Digital." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CreateSitePage,
});

const fieldClass =
  "mt-2 w-full rounded-md border border-border bg-background px-4 py-3.5 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-neon";
const labelClass = "label-mono text-muted-foreground text-[0.65rem]";

function CreateSitePage() {
  const content = Route.useLoaderData();
  const { template: templateId, project: projectId } = Route.useSearch();
  const selectedTemplate = templateRegistry.find(
    (template) => template.id === templateId && template.enabled,
  );
  const selectedTemplateConfig = selectedTemplate
    ? runtimeTemplates[selectedTemplate.id]?.config
    : undefined;
  const servicePlaceholder =
    selectedTemplate?.id === "template-02"
      ? "Un élément par ligne : Nom | Description\nEntrée | Légumes du marché et crème aux herbes\nPlat | Poisson de la criée et légumes de saison\nDessert | Chocolat et noisette"
      : selectedTemplate?.id === "template-04"
        ? "Un soin par ligne : Nom | Durée, description et tarif\nSoin visage | 60 min · Soin personnalisé — 75 €\nMassage | 75 min · Massage relaxant — 90 €\nMise en beauté | 45 min · Maquillage naturel — 55 €"
        : selectedTemplate?.id === "template-05"
          ? "Une catégorie par ligne : Nom | Description\nMaison & décoration | Céramiques, bougies et textiles\nCadeaux | Des attentions originales pour toutes les occasions\nCréateurs locaux | Des pièces fabriquées près de chez nous"
          : selectedTemplate?.id === "template-06"
            ? "Un bien par ligne : Nom | Localisation, pièces, surface, prix, DPE et référence\nAppartement de caractère | Centre-ville · 4 pièces · 128 m² · 695 000 € · DPE C\nMaison familiale | Quartier résidentiel · 5 pièces · 165 m² · 845 000 € · DPE D"
            : selectedTemplate?.id === "template-07"
              ? "Une expertise par ligne : Nom | Description\nStratégie | Clarifier les priorités et construire une feuille de route\nTransformation | Faire évoluer l'organisation et les méthodes\nPerformance | Piloter les résultats avec des indicateurs utiles"
              : selectedTemplate?.id === "template-08"
                ? "Une expertise par ligne : Nom | Description\nConcept | Identité, volumes et matières\nDesign intérieur | Espaces, mobilier et lumière\nRéalisation | Coordination et suivi exigeant"
                : selectedTemplate?.id === "template-09"
                  ? "Un accompagnement par ligne : Nom | Description\nDiagnostic | Analyser la situation, les besoins et les contraintes\nConseil stratégique | Comparer les options et construire une direction solide\nMission complète | Piloter le projet et sécuriser chaque décision"
                  : selectedTemplate?.id === "template-10"
                    ? "Un service par ligne : Nom | Description\nConseil | Cadrer le besoin et choisir la bonne direction\nCréation | Transformer l’idée en solution claire et attractive\nSuivi | Mesurer, ajuster et rester disponible dans la durée"
                    : "Un service par ligne : Nom | Description\nConstruction | Murs, extensions et dalles\nRénovation | Transformation de bâtiments anciens";
  const [errors, setErrors] = useState<string[]>([]);
  const [draft, setDraft] = useState<ClientBriefDraft | null>(null);
  const [formDefaults, setFormDefaults] = useState<ClientBriefDraft | null>(null);
  const [logoName, setLogoName] = useState("");
  const [photoNames, setPhotoNames] = useState<string[]>([]);
  const [assets, setAssets] = useState<ProjectAssets>({ logo: null, photos: [] });
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");

  useEffect(() => {
    if (!selectedTemplate) return;
    const savedBrief = localStorage.getItem(`vr-digital:brief:${selectedTemplate.id}`);
    if (savedBrief) {
      try {
        const parsed = JSON.parse(savedBrief) as ClientBriefDraft;
        setFormDefaults(parsed);
        setLogoName(parsed.logoName);
        setPhotoNames(parsed.photoNames);
      } catch {
        localStorage.removeItem(`vr-digital:brief:${selectedTemplate.id}`);
      }
    }

    if (projectId) {
      getLocalProject(projectId)
        .then((stored) => {
          if (!stored) return;
          setAssets(stored.assets);
          setLogoName(stored.assets.logo?.name ?? "");
          setPhotoNames(stored.assets.photos.map((photo) => photo.name));
        })
        .catch(() => setGenerationError("Les images du projet n'ont pas pu être rechargées."));
    }
  }, [projectId, selectedTemplate]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedTemplate) return;
    const formData = new FormData(event.currentTarget);
    const result = createClientBriefDraft(selectedTemplate.id, formData);
    setErrors(result.errors);
    setDraft(result.draft);
    if (result.draft) {
      localStorage.setItem(`vr-digital:brief:${selectedTemplate.id}`, JSON.stringify(result.draft));
      const logo = formData.get("logo");
      const photos = formData
        .getAll("photos")
        .filter((item): item is File => item instanceof File && item.size > 0);
      setAssets({ logo: logo instanceof File && logo.size > 0 ? logo : null, photos });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleGenerate() {
    if (!draft || !selectedTemplate) return;
    setGenerating(true);
    setGenerationError("");
    try {
      const runtimeTemplate = runtimeTemplates[selectedTemplate.id];
      if (!runtimeTemplate) throw new Error("Modèle indisponible");
      const project = generateProject(draft, runtimeTemplate.config, selectedTemplate.version);
      await saveLocalProject(project, assets);
      window.location.assign(`/apercu/${project.id}`);
    } catch {
      setGenerationError("La prévisualisation n'a pas pu être enregistrée dans ce navigateur.");
      setGenerating(false);
    }
  }

  return (
    <SiteContentProvider value={content}>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-7xl px-5 pt-32 pb-24 sm:px-8 lg:pt-40 lg:pb-36">
          {!selectedTemplate ? (
            <section className="rounded-xl border border-border bg-card p-8 text-center sm:p-14">
              <h1 className="font-display text-4xl font-bold">Choisissez d'abord un modèle.</h1>
              <p className="text-muted-foreground mt-4">
                Le formulaire doit être associé à un modèle disponible.
              </p>
              <a
                href="/modeles"
                className="label-mono mt-7 inline-flex items-center gap-2 rounded-md bg-neon px-5 py-4 text-xs text-primary-foreground"
              >
                <ArrowLeft className="size-4" />
                Voir les modèles
              </a>
            </section>
          ) : draft ? (
            <section className="mx-auto max-w-3xl rounded-xl border border-neon/40 bg-card p-8 sm:p-12">
              <CheckCircle2 className="size-10 text-neon" />
              <p className="eyebrow mt-8">Informations enregistrées localement</p>
              <h1 className="font-display mt-5 text-4xl font-bold sm:text-6xl">
                Votre brief est prêt.
              </h1>
              <p className="text-muted-foreground mt-5 text-lg leading-relaxed">
                Les informations de <strong className="text-foreground">{draft.companyName}</strong>{" "}
                ont été validées pour le modèle{" "}
                <strong className="text-foreground">{selectedTemplate.name}</strong>. Elles restent
                uniquement dans ce navigateur et ne sont envoyées à aucun serveur.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setFormDefaults(draft);
                    setDraft(null);
                  }}
                  className="label-mono rounded-md border border-border px-5 py-4 text-xs hover:border-neon"
                >
                  Modifier les informations
                </button>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={generating}
                  className="label-mono flex items-center gap-2 rounded-md bg-neon px-5 py-4 text-xs text-primary-foreground disabled:opacity-60"
                >
                  {generating ? "Génération..." : "Générer la prévisualisation"}
                  <ArrowRight className="size-4" />
                </button>
              </div>
              {generationError && (
                <p role="alert" className="mt-5 text-sm text-red-300">
                  {generationError}
                </p>
              )}
            </section>
          ) : (
            <>
              <section className="grid gap-8 border-b border-border pb-12 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <p className="eyebrow">Personnalisation · {selectedTemplate.name}</p>
                  <h1 className="font-display mt-5 max-w-4xl text-[clamp(3rem,8vw,7rem)] leading-[0.92] font-bold tracking-[-0.05em]">
                    Parlez-nous de votre entreprise.
                  </h1>
                </div>
                <a
                  href={`/modeles/${selectedTemplate.id}`}
                  className="label-mono inline-flex items-center gap-2 text-xs text-neon"
                >
                  <ArrowLeft className="size-4" />
                  Revoir la démo
                </a>
              </section>

              <form
                onSubmit={handleSubmit}
                className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start"
              >
                <div className="space-y-12">
                  <FormSection number="01" title="Votre entreprise">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <Field
                        label="Nom de l'entreprise *"
                        name="companyName"
                        defaultValue={formDefaults?.companyName}
                        required
                      />
                      <Field label="Slogan" name="tagline" defaultValue={formDefaults?.tagline} />
                      <Field
                        label="Activité *"
                        name="activity"
                        defaultValue={formDefaults?.activity}
                        required
                        placeholder="Ex. Maçonnerie et rénovation"
                      />
                      <Field
                        label="Ville *"
                        name="city"
                        defaultValue={formDefaults?.city}
                        required
                      />
                      <Field
                        label="Téléphone *"
                        name="phone"
                        type="tel"
                        defaultValue={formDefaults?.phone}
                        required
                      />
                      <Field
                        label="E-mail *"
                        name="email"
                        type="email"
                        defaultValue={formDefaults?.email}
                        required
                      />
                      <Field label="Adresse" name="address" defaultValue={formDefaults?.address} />
                      <Field
                        label="Horaires"
                        name="openingHours"
                        defaultValue={formDefaults?.openingHours}
                        placeholder="Lun–Ven : 8h–18h"
                      />
                    </div>
                  </FormSection>

                  <FormSection number="02" title="Votre activité">
                    <div className="grid gap-6">
                      <TextArea
                        label="Description de l'activité *"
                        name="description"
                        defaultValue={formDefaults?.description}
                        required
                        placeholder="Que propose votre entreprise ?"
                      />
                      <TextArea
                        label="Décrivez votre entreprise en quelques phrases *"
                        name="companyStory"
                        defaultValue={formDefaults?.companyStory}
                        required
                        rows={6}
                        placeholder="Votre histoire, vos valeurs, votre façon de travailler et ce qui vous différencie..."
                      />
                      <TextArea
                        label="Prestations et services"
                        name="services"
                        defaultValue={formDefaults?.services.join("\n")}
                        rows={6}
                        placeholder={servicePlaceholder}
                      />
                    </div>
                  </FormSection>

                  <FormSection number="03" title="Identité visuelle">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <ColorField
                        label="Couleur principale"
                        name="primaryColor"
                        defaultValue={
                          formDefaults?.colors.primary ||
                          selectedTemplateConfig?.branding.primaryColor ||
                          "#d95d25"
                        }
                      />
                      <ColorField
                        label="Couleur secondaire"
                        name="secondaryColor"
                        defaultValue={
                          formDefaults?.colors.secondary ||
                          selectedTemplateConfig?.branding.secondaryColor ||
                          "#17324d"
                        }
                      />
                      <FileField
                        label="Logo"
                        name="logo"
                        value={logoName}
                        onChange={(files) => {
                          setLogoName(files[0]?.name ?? "");
                          setAssets((current) => ({ ...current, logo: files[0] ?? null }));
                        }}
                      />
                      <FileField
                        label="Photos"
                        name="photos"
                        value={photoNames.join(", ")}
                        multiple
                        onChange={(files) => {
                          setPhotoNames(files.map((file) => file.name));
                          setAssets((current) => ({ ...current, photos: files }));
                        }}
                      />
                    </div>
                  </FormSection>

                  <FormSection number="04" title="Présence en ligne">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <Field
                        label="Lien Facebook"
                        name="facebook"
                        defaultValue={formDefaults?.socialLinks.facebook}
                        type="url"
                        placeholder="https://..."
                      />
                      <Field
                        label="Lien Instagram"
                        name="instagram"
                        defaultValue={formDefaults?.socialLinks.instagram}
                        type="url"
                        placeholder="https://..."
                      />
                      <Field
                        label="Fiche Google"
                        name="google"
                        defaultValue={formDefaults?.socialLinks.google}
                        type="url"
                        placeholder="https://..."
                      />
                    </div>
                  </FormSection>

                  {errors.length > 0 && (
                    <div
                      role="alert"
                      className="rounded-lg border border-red-400/40 bg-red-400/10 p-5 text-sm text-red-200"
                    >
                      <p className="font-semibold">Certaines informations sont manquantes :</p>
                      <ul className="mt-2 list-disc space-y-1 pl-5">
                        {errors.map((error) => (
                          <li key={error}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <button
                    type="submit"
                    className="group label-mono flex w-full items-center justify-center gap-3 rounded-md bg-neon px-6 py-5 text-xs text-primary-foreground transition-shadow hover:shadow-[var(--shadow-neon-strong)]"
                  >
                    Valider mes informations
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>

                <aside className="sticky top-28 rounded-xl border border-border bg-card p-6">
                  <img
                    src={selectedTemplate.previewImage}
                    alt=""
                    className="aspect-[4/3] w-full rounded-md object-cover"
                  />
                  <p className="eyebrow mt-5">Modèle sélectionné</p>
                  <h2 className="font-display mt-3 text-2xl font-semibold">
                    {selectedTemplate.name}
                  </h2>
                  <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                    {selectedTemplate.description}
                  </p>
                  <div className="mt-6 flex gap-3 border-t border-border pt-5 text-sm text-muted-foreground">
                    <ShieldCheck className="size-5 shrink-0 text-neon" />
                    <p>Aucune information n'est envoyée à ce stade.</p>
                  </div>
                </aside>
              </form>
            </>
          )}
        </main>
        <Footer />
      </div>
    </SiteContentProvider>
  );
}

function FormSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-xl border border-border bg-card p-6 sm:p-8">
      <legend className="px-2">
        <span className="label-mono text-neon text-[0.65rem]">{number}</span>
        <span className="font-display ml-4 text-2xl font-semibold">{title}</span>
      </legend>
      <div className="mt-5">{children}</div>
    </fieldset>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string | undefined;
}) {
  return (
    <label>
      <span className={labelClass}>{label}</span>
      <input
        className={fieldClass}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  required,
  rows = 4,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  required?: boolean;
  rows?: number;
  placeholder?: string;
  defaultValue?: string | undefined;
}) {
  return (
    <label>
      <span className={labelClass}>{label}</span>
      <textarea
        className={fieldClass}
        name={name}
        required={required}
        rows={rows}
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
    </label>
  );
}

function ColorField({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string;
}) {
  return (
    <label>
      <span className={labelClass}>{label}</span>
      <span className="mt-2 flex items-center gap-3 rounded-md border border-border bg-background p-3">
        <input
          name={name}
          type="color"
          defaultValue={defaultValue}
          className="size-10 cursor-pointer rounded border-0 bg-transparent"
        />
        <span className="text-sm text-muted-foreground">{defaultValue}</span>
      </span>
    </label>
  );
}

function FileField({
  label,
  name,
  value,
  multiple,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  multiple?: boolean;
  onChange: (files: File[]) => void;
}) {
  return (
    <label>
      <span className={labelClass}>{label}</span>
      <span className="mt-2 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border bg-background px-4 text-center transition-colors hover:border-neon">
        <ImagePlus className="size-5 text-neon" />
        <span className="mt-2 text-sm text-muted-foreground">{value || "Choisir une image"}</span>
        <input
          name={name}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="sr-only"
          onChange={(event) => onChange(Array.from(event.target.files ?? []))}
        />
      </span>
    </label>
  );
}
