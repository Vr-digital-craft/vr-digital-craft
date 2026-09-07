import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Eye, LayoutTemplate } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SiteContentProvider } from "@/components/site/content";
import { getSiteContent } from "@/lib/site-content.functions";
import { templateRegistry } from "../../templates/registry";
import type { TemplateSector } from "../../packages/template-core/src";

const title = "Modèles de sites vitrines | VR Digital";
const description =
  "Découvrez les modèles de sites vitrines VR Digital pour artisans, commerces et entreprises.";

const filters: { value: "all" | TemplateSector; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "restaurant", label: "Restaurant" },
  { value: "artisan", label: "Artisan" },
  { value: "commerce", label: "Commerce" },
  { value: "beaute-bien-etre", label: "Beauté / Bien-être" },
  { value: "immobilier", label: "Immobilier" },
  { value: "services", label: "Services" },
  { value: "automobile", label: "Automobile" },
  { value: "profession-liberale", label: "Profession libérale" },
];

const sectorLabels = Object.fromEntries(filters.map((filter) => [filter.value, filter.label]));

export const Route = createFileRoute("/modeles/")({
  loader: () => getSiteContent(),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/modeles" }],
  }),
  component: ModelsPage,
});

function ModelsPage() {
  const content = Route.useLoaderData();
  const [activeFilter, setActiveFilter] = useState<"all" | TemplateSector>("all");
  const models = templateRegistry.filter(
    (model) => model.enabled && (activeFilter === "all" || model.sectors.includes(activeFilter)),
  );

  return (
    <SiteContentProvider value={content}>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <section className="mx-auto max-w-7xl px-5 pb-14 pt-36 sm:px-8 lg:pb-20 lg:pt-48">
            <p className="eyebrow">Bibliothèque VR Digital</p>
            <h1 className="font-display mt-6 max-w-5xl text-[clamp(3rem,10vw,8rem)] leading-[0.9] font-bold tracking-[-0.05em]">
              Choisissez une base. <span className="text-neon">Faites-la vôtre.</span>
            </h1>
            <p className="text-muted-foreground mt-8 max-w-2xl text-lg leading-relaxed">
              Chaque modèle est conçu comme un véritable site professionnel et sera personnalisé
              avec vos couleurs, vos textes, vos services et vos images.
            </p>
          </section>

          <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:pb-36">
            <div className="flex flex-wrap gap-2" aria-label="Filtrer les modèles par secteur">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveFilter(filter.value)}
                  aria-pressed={activeFilter === filter.value}
                  className={`label-mono rounded-full border px-4 py-3 text-[0.65rem] transition-colors ${
                    activeFilter === filter.value
                      ? "border-neon bg-neon text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-neon hover:text-foreground"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {models.length ? (
              <div className="mt-12 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                {models.map((model, index) => (
                  <article
                    key={model.id}
                    className="overflow-hidden rounded-xl border border-border bg-card"
                  >
                    <a href={`/modeles/${model.id}`} className="group block overflow-hidden">
                      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                        <img
                          src={model.previewImage}
                          alt={`Aperçu du modèle ${model.name}`}
                          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <span className="label-mono absolute top-4 left-4 rounded-full bg-background/90 px-3 py-2 text-[0.6rem] backdrop-blur">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </a>
                    <div className="p-6 sm:p-7">
                      <p className="eyebrow">{model.designType}</p>
                      <h2 className="font-display mt-4 text-3xl font-semibold">{model.name}</h2>
                      <p className="text-muted-foreground mt-3 leading-relaxed">
                        {model.description}
                      </p>
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {model.sectors.map((sector) => (
                          <li
                            key={sector}
                            className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground"
                          >
                            {sectorLabels[sector]}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-7 grid gap-3 sm:grid-cols-2">
                        <a
                          href={`/modeles/${model.id}`}
                          className="label-mono flex items-center justify-center gap-2 rounded-md border border-border px-4 py-4 text-[0.65rem] transition-colors hover:border-neon hover:text-neon"
                        >
                          <Eye className="size-4" />
                          Voir la démo
                        </a>
                        <a
                          href={`/creer-mon-site?template=${model.id}`}
                          className="label-mono flex items-center justify-center gap-2 rounded-md bg-neon px-4 py-4 text-[0.65rem] text-primary-foreground transition-shadow hover:shadow-[var(--shadow-neon-strong)]"
                        >
                          <LayoutTemplate className="size-4" />
                          Choisir ce modèle
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-12 rounded-xl border border-dashed border-border px-6 py-16 text-center">
                <p className="font-display text-2xl font-semibold">
                  De nouveaux modèles arrivent bientôt.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveFilter("all")}
                  className="label-mono mt-5 inline-flex items-center gap-2 text-xs text-neon"
                >
                  Voir tous les modèles
                  <ArrowRight className="size-4" />
                </button>
              </div>
            )}
          </section>
        </main>
        <Footer />
      </div>
    </SiteContentProvider>
  );
}
