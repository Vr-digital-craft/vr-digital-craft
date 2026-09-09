import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ImagePlus,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { SiteContentProvider } from "@/components/site/content";
import { getSiteContent } from "@/lib/site-content.functions";
import { getAdminSession } from "@/modules/admin/admin-auth.functions";
import { generateSiteCopy } from "@/modules/ai/generate-site-copy.functions";
import {
  applyGeneratedCopy,
  applyGeneratedCopyPreservingStructuredFacts,
} from "@/modules/ai/site-copy";
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
  loader: async () => {
    const [content, adminSession] = await Promise.all([getSiteContent(), getAdminSession()]);
    return { content, adminSession };
  },
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
type AdminCreationMode = "form" | "prompt" | "combined";

function CreateSitePage() {
  const { content, adminSession } = Route.useLoaderData();
  const isAdmin = adminSession.authenticated && adminSession.role === "admin";
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
  const [creationMode, setCreationMode] = useState<AdminCreationMode>("form");
  const [adminPrompt, setAdminPrompt] = useState("");

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
      let project = generateProject(draft, runtimeTemplate.config, selectedTemplate.version);
      if (isAdmin && creationMode === "combined" && adminPrompt.trim()) {
        const result = await generateSiteCopy({
          data: {
            config: project.config,
            templateId: selectedTemplate.id,
            adminPrompt,
            mode: "combined",
          },
        });
        const generatedConfig = applyGeneratedCopyPreservingStructuredFacts(
          project.config,
          result.copy,
        );
        project = {
          ...project,
          config: generatedConfig,
          lastAiProvider: result.provider,
          lastAiModel: result.model,
        };
      }
      await saveLocalProject(project, assets);
      window.location.assign(`/apercu/${project.id}`);
    } catch {
      setGenerationError("La prévisualisation n'a pas pu être enregistrée dans ce navigateur.");
      setGenerating(false);
    }
  }

  async function handlePromptGenerate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isAdmin || !selectedTemplate || adminPrompt.trim().length < 20) {
      setGenerationError("Décrivez le site à générer avec au moins 20 caractères.");
      return;
    }
    setGenerating(true);
    setGenerationError("");
    try {
      const runtimeTemplate = runtimeTemplates[selectedTemplate.id];
      if (!runtimeTemplate) throw new Error("Modèle indisponible");
      const promptConfig = structuredClone(runtimeTemplate.config);
      promptConfig.business = {
        name: "",
        tagline: "",
        activity: "",
        description: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        openingHours: [],
      };
      promptConfig.content.hero.title = "";
      promptConfig.content.hero.subtitle = "";
      promptConfig.content.services.eyebrow = "Services";
      promptConfig.content.services.title = "Prestations";
      promptConfig.content.services.description = "";
      promptConfig.content.services.items = [];
      promptConfig.content.about.title = "";
      promptConfig.content.about.description = "";
      promptConfig.content.contact.title = "";
      promptConfig.content.contact.description = "";
      promptConfig.content.footer.tagline = "";
      promptConfig.seo.title = "";
      promptConfig.seo.description = "";
      const result = await generateSiteCopy({
        data: {
          config: promptConfig,
          templateId: selectedTemplate.id,
          adminPrompt,
          mode: "prompt",
        },
      });
      const rawFacts = result.copy.businessFacts;
      const normalizedPrompt = adminPrompt.toLocaleLowerCase("fr-FR").replace(/\s+/g, " ");
      const explicit = (value: string) => {
        if (!value) return "";
        const normalizedValue = value.toLocaleLowerCase("fr-FR").replace(/\s+/g, " ");
        if (normalizedPrompt.includes(normalizedValue)) return value;
        const meaningfulWords = normalizedValue.match(/[\p{L}\p{N}]{4,}/gu) ?? [];
        return meaningfulWords.length > 0 &&
          meaningfulWords.every((word) => normalizedPrompt.includes(word))
          ? value
          : "";
      };
      const facts = {
        ...rawFacts,
        name: explicit(rawFacts.name),
        activity: explicit(rawFacts.activity),
        phone: explicit(rawFacts.phone),
        email: explicit(rawFacts.email),
        address: explicit(rawFacts.address),
        city: explicit(rawFacts.city),
        openingHours: explicit(rawFacts.openingHours),
      };
      const explicitServices = result.copy.services.filter((service) =>
        normalizedPrompt.includes(service.title.toLocaleLowerCase("fr-FR")),
      );
      const promptDraft: ClientBriefDraft = {
        templateId: selectedTemplate.id,
        companyName: facts.name || "Nouvelle démo",
        tagline: facts.tagline,
        activity: facts.activity || "Activité à préciser",
        description: facts.description || result.copy.aboutDescription,
        companyStory: result.copy.aboutDescription,
        phone: facts.phone,
        email: facts.email,
        address: facts.address,
        city: facts.city || "Ville à préciser",
        openingHours: facts.openingHours,
        services: explicitServices.length
          ? explicitServices.map((service) => `${service.title} | ${service.description}`)
          : ["Services à préciser | Complétez les prestations depuis l'administration."],
        socialLinks: { facebook: "", instagram: "", google: "" },
        colors: {
          primary: runtimeTemplate.config.branding.primaryColor,
          secondary: runtimeTemplate.config.branding.secondaryColor,
        },
        logoName: "",
        photoNames: [],
      };
      let project = generateProject(promptDraft, runtimeTemplate.config, selectedTemplate.version);
      project = {
        ...project,
        config: applyGeneratedCopy(project.config, result.copy),
        lastAiProvider: result.provider,
        lastAiModel: result.model,
      };
      project.config.content.services.eyebrow = "Services";
      project.config.content.services.title = "Nos prestations";
      project.config.content.services.description =
        "Découvrez les prestations indiquées pour cette activité.";
      project.config.content.gallery.enabled = false;
      project.config.content.testimonials.enabled = false;
      localStorage.setItem(`vr-digital:brief:${selectedTemplate.id}`, JSON.stringify(promptDraft));
      await saveLocalProject(project, { logo: null, photos: [] });
      window.location.assign(`/apercu/${project.id}`);
    } catch (error) {
      setGenerationError(
        error instanceof Error
          ? error.message
          : "La génération IA est indisponible. Vous pouvez continuer avec le formulaire.",
      );
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

              {isAdmin && (
                <section className="mt-8 rounded-xl border border-neon/30 bg-card p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="eyebrow">Mode administrateur</p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Choisissez la quantité d'informations à fournir pour cette démonstration.
                      </p>
                    </div>
                    <div
                      className="grid w-full grid-cols-1 gap-2 rounded-lg border border-border bg-background p-1.5 sm:w-auto sm:grid-cols-3"
                      role="radiogroup"
                      aria-label="Mode de création"
                    >
                      {(
                        [
                          ["form", "Formulaire"],
                          ["prompt", "Prompt IA"],
                          ["combined", "Les deux"],
                        ] as const
                      ).map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          role="radio"
                          aria-checked={creationMode === value}
                          onClick={() => {
                            setCreationMode(value);
                            setDraft(null);
                            setErrors([]);
                            setGenerationError("");
                          }}
                          className={`label-mono rounded-md px-4 py-3 text-xs transition-colors ${
                            creationMode === value
                              ? "bg-neon text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {creationMode === "prompt" && isAdmin ? (
                <form
                  onSubmit={handlePromptGenerate}
                  className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start"
                >
                  <div>
                    <FormSection number="01" title="Décrivez le site à générer">
                      <TextArea
                        label="Prompt IA *"
                        name="adminPrompt"
                        value={adminPrompt}
                        onChange={setAdminPrompt}
                        required
                        rows={14}
                        placeholder="Crée un site pour un garage automobile à Grenade-sur-Garonne, spécialisé dans l'entretien, le diagnostic et le freinage. Je veux un style sombre et moderne, un ton professionnel et rassurant, avec une forte mise en avant de la prise de rendez-vous."
                      />
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        L'IA utilisera uniquement les faits présents dans ce texte. Les informations
                        absentes resteront à compléter dans la prévisualisation.
                      </p>
                    </FormSection>
                    {generationError && (
                      <p
                        role="alert"
                        className="mt-6 rounded-lg border border-red-400/40 bg-red-400/10 p-5 text-sm text-red-200"
                      >
                        {generationError}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={generating}
                      className="group label-mono mt-8 flex w-full items-center justify-center gap-3 rounded-md bg-neon px-6 py-5 text-xs text-primary-foreground transition-shadow hover:shadow-[var(--shadow-neon-strong)] disabled:cursor-wait disabled:opacity-60"
                    >
                      <Sparkles className="size-4" />
                      {generating ? "Génération avec l'IA…" : "Générer la démonstration"}
                    </button>
                  </div>
                  <TemplateAside selectedTemplate={selectedTemplate} sendsToAi />
                </form>
              ) : (
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
                        <Field
                          label="Adresse"
                          name="address"
                          defaultValue={formDefaults?.address}
                        />
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
                          label="Lien Google Maps"
                          name="google"
                          defaultValue={formDefaults?.socialLinks.google}
                          type="url"
                          placeholder="https://maps.app.goo.gl/..."
                        />
                      </div>
                    </FormSection>

                    {isAdmin && creationMode === "combined" && (
                      <FormSection number="05" title="Instructions complémentaires pour l'IA">
                        <TextArea
                          label="Prompt IA"
                          name="adminPrompt"
                          value={adminPrompt}
                          onChange={setAdminPrompt}
                          rows={9}
                          placeholder="Précisez le ton, le positionnement, les éléments à mettre en avant, l'ambiance et l'objectif commercial. Les informations du formulaire resteront prioritaires."
                        />
                        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                          Le nom, la ville, les coordonnées, les horaires et les services saisis
                          dans le formulaire ne pourront pas être remplacés par le prompt.
                        </p>
                      </FormSection>
                    )}

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

                  <TemplateAside
                    selectedTemplate={selectedTemplate}
                    sendsToAi={isAdmin && creationMode === "combined"}
                  />
                </form>
              )}
            </>
          )}
        </main>
        <Footer />
      </div>
    </SiteContentProvider>
  );
}

function TemplateAside({
  selectedTemplate,
  sendsToAi,
}: {
  selectedTemplate: (typeof templateRegistry)[number];
  sendsToAi: boolean;
}) {
  return (
    <aside className="sticky top-28 rounded-xl border border-border bg-card p-6">
      <img
        src={selectedTemplate.previewImage}
        alt=""
        className="aspect-[4/3] w-full rounded-md object-cover"
      />
      <p className="eyebrow mt-5">Modèle sélectionné</p>
      <h2 className="font-display mt-3 text-2xl font-semibold">{selectedTemplate.name}</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {selectedTemplate.description}
      </p>
      <div className="mt-6 flex gap-3 border-t border-border pt-5 text-sm text-muted-foreground">
        <ShieldCheck className="size-5 shrink-0 text-neon" />
        <p>
          {sendsToAi
            ? "Les informations sont envoyées uniquement au fournisseur IA sécurisé lors de la génération."
            : "Aucune information n'est envoyée à ce stade."}
        </p>
      </div>
    </aside>
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
  value,
  onChange,
}: {
  label: string;
  name: string;
  required?: boolean;
  rows?: number;
  placeholder?: string;
  defaultValue?: string | undefined;
  value?: string;
  onChange?: (value: string) => void;
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
        {...(value !== undefined
          ? {
              value,
              onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) =>
                onChange?.(event.target.value),
            }
          : { defaultValue })}
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
