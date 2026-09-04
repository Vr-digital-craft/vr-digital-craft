import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Icon, SiteContentProvider } from "@/components/site/content";
import { getSiteContent } from "@/lib/site-content.functions";

const title = "Création de sites web à Toulouse | Services VR Digital";
const description =
  "Sites vitrines, sites pour restaurants et artisans, refonte et outils web sur mesure à Toulouse et partout en France.";

export const Route = createFileRoute("/services")({
  loader: () => getSiteContent(),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const content = Route.useLoaderData();

  return (
    <SiteContentProvider value={content}>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <section className="mx-auto max-w-7xl px-5 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-48">
            <p className="eyebrow">Expertise web</p>
            <h1 className="font-display mt-6 max-w-5xl text-[clamp(3rem,10vw,8rem)] font-bold leading-[0.9] tracking-[-0.05em]">
              Des sites utiles, <span className="text-neon">beaux et rapides.</span>
            </h1>
            <p className="text-muted-foreground mt-8 max-w-2xl text-lg leading-relaxed">
              Une solution adaptée à votre activité, conçue pour convaincre vos visiteurs et
              faciliter la prise de contact.
            </p>
          </section>

          <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:pb-36">
            <div className="grid gap-5 md:grid-cols-2">
              {content.services.map((service, index) => (
                <article
                  key={service.id}
                  className="rounded-xl border border-border bg-card p-8 sm:p-10"
                >
                  <div className="flex items-center justify-between gap-6">
                    <Icon name={service.icon} className="text-neon size-8" />
                    <span className="label-mono text-muted-foreground">0{index + 1}</span>
                  </div>
                  <h2 className="font-display mt-10 text-3xl font-semibold">{service.title}</h2>
                  <p className="text-muted-foreground mt-5 max-w-xl leading-relaxed">
                    {service.description}
                  </p>
                  <a
                    href="/#contact"
                    className="group label-mono mt-8 inline-flex items-center gap-3 text-xs text-neon"
                  >
                    Parler de mon projet
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </article>
              ))}
            </div>
          </section>
          <Contact />
        </main>
        <Footer />
      </div>
    </SiteContentProvider>
  );
}
