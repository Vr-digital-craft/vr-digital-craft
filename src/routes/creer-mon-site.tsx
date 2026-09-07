import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, ImagePlus, ShieldCheck } from "lucide-react";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { SiteContentProvider } from "@/components/site/content";
import { getSiteContent } from "@/lib/site-content.functions";
import { createClientBriefDraft, type ClientBriefDraft } from "@/modules/projects/client-brief";
import { templateRegistry } from "../../templates/registry";

type Search = { template: string };

export const Route = createFileRoute("/creer-mon-site")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    template: typeof search["template"] === "string" ? search["template"] : "",
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
  const { template: templateId } = Route.useSearch();
  const selectedTemplate = templateRegistry.find(
    (template) => template.id === templateId && template.enabled,
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [draft, setDraft] = useState<ClientBriefDraft | null>(null);
  const [logoName, setLogoName] = useState("");
  const [photoNames, setPhotoNames] = useState<string[]>([]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedTemplate) return;
    const result = createClientBriefDraft(selectedTemplate.id, new FormData(event.currentTarget));
    setErrors(result.errors);
    setDraft(result.draft);
    if (result.draft) {
      sessionStorage.setItem("vr-digital:client-brief", JSON.stringify(result.draft));
      window.scrollTo({ top: 0, behavior: "smooth" });
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
                  onClick={() => setDraft(null)}
                  className="label-mono rounded-md border border-border px-5 py-4 text-xs hover:border-neon"
                >
                  Modifier les informations
                </button>
                <span
                  className="label-mono flex cursor-not-allowed items-center gap-2 rounded-md bg-neon px-5 py-4 text-xs text-primary-foreground opacity-60"
                  title="Disponible à l'étape 5"
                >
                  Générer la prévisualisation
                  <ArrowRight className="size-4" />
                </span>
              </div>
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
                      <Field label="Nom de l'entreprise *" name="companyName" required />
                      <Field label="Slogan" name="tagline" />
                      <Field
                        label="Activité *"
                        name="activity"
                        required
                        placeholder="Ex. Maçonnerie et rénovation"
                      />
                      <Field label="Ville *" name="city" required />
                      <Field label="Téléphone *" name="phone" type="tel" required />
                      <Field label="E-mail *" name="email" type="email" required />
                      <Field label="Adresse" name="address" />
                      <Field label="Horaires" name="openingHours" placeholder="Lun–Ven : 8h–18h" />
                    </div>
                  </FormSection>

                  <FormSection number="02" title="Votre activité">
                    <div className="grid gap-6">
                      <TextArea
                        label="Description de l'activité *"
                        name="description"
                        required
                        placeholder="Que propose votre entreprise ?"
                      />
                      <TextArea
                        label="Décrivez votre entreprise en quelques phrases *"
                        name="companyStory"
                        required
                        rows={6}
                        placeholder="Votre histoire, vos valeurs, votre façon de travailler et ce qui vous différencie..."
                      />
                      <TextArea
                        label="Prestations et services"
                        name="services"
                        rows={6}
                        placeholder={
                          "Un service par ligne\nConstruction\nRénovation\nAménagement extérieur"
                        }
                      />
                    </div>
                  </FormSection>

                  <FormSection number="03" title="Identité visuelle">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <ColorField
                        label="Couleur principale"
                        name="primaryColor"
                        defaultValue="#d95d25"
                      />
                      <ColorField
                        label="Couleur secondaire"
                        name="secondaryColor"
                        defaultValue="#17324d"
                      />
                      <FileField
                        label="Logo"
                        name="logo"
                        value={logoName}
                        onChange={(files) => setLogoName(files[0]?.name ?? "")}
                      />
                      <FileField
                        label="Photos"
                        name="photos"
                        value={photoNames.join(", ")}
                        multiple
                        onChange={(files) => setPhotoNames(files.map((file) => file.name))}
                      />
                    </div>
                  </FormSection>

                  <FormSection number="04" title="Présence en ligne">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <Field
                        label="Lien Facebook"
                        name="facebook"
                        type="url"
                        placeholder="https://..."
                      />
                      <Field
                        label="Lien Instagram"
                        name="instagram"
                        type="url"
                        placeholder="https://..."
                      />
                      <Field
                        label="Fiche Google"
                        name="google"
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
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
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
}: {
  label: string;
  name: string;
  required?: boolean;
  rows?: number;
  placeholder?: string;
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
