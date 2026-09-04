import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { SiteContentProvider } from "@/components/site/content";
import { getSiteContent } from "@/lib/site-content.functions";

const title = "Réalisations de sites internet | VR Digital Toulouse";
const description =
  "Découvrez des sites internet modernes réalisés pour des restaurants, artisans, commerces et entreprises.";

export const Route = createFileRoute("/realisations")({
  loader: () => getSiteContent(),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/realisations" },
    ],
    links: [{ rel: "canonical", href: "/realisations" }],
  }),
  component: WorkPage,
});

function WorkPage() {
  const content = Route.useLoaderData();

  return (
    <SiteContentProvider value={content}>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <section className="mx-auto max-w-7xl px-5 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-48">
            <p className="eyebrow">Portfolio</p>
            <h1 className="font-display mt-6 max-w-5xl text-[clamp(3rem,10vw,8rem)] font-bold leading-[0.9] tracking-[-0.05em]">
              Des projets qui <span className="text-neon">font la différence.</span>
            </h1>
          </section>

          <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-24 sm:px-8 md:grid-cols-2 lg:pb-36">
            {content.projects.map((project) => (
              <article
                key={project.id}
                className="overflow-hidden rounded-xl border border-border bg-card"
              >
                <img
                  src={project.image_url}
                  alt={project.image_alt || `Site internet de ${project.name}`}
                  width={1200}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="flex items-start justify-between gap-6 p-7">
                  <div>
                    <p className="eyebrow">{project.category}</p>
                    <h2 className="font-display mt-3 text-3xl font-semibold">{project.name}</h2>
                    <p className="text-muted-foreground mt-4 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  <a
                    href={project.url}
                    aria-label={`Voir le projet ${project.name}`}
                    className="text-neon"
                  >
                    <ArrowUpRight className="size-6" />
                  </a>
                </div>
              </article>
            ))}
          </section>
          <Contact />
        </main>
        <Footer />
      </div>
    </SiteContentProvider>
  );
}
