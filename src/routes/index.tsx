import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { Work } from "@/components/site/Work";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { Process } from "@/components/site/Process";
import { Why } from "@/components/site/Why";
import { Pricing } from "@/components/site/Pricing";
import { Testimonials } from "@/components/site/Testimonials";
import { Contact } from "@/components/site/Contact";
import { Faq } from "@/components/site/Faq";
import { Footer } from "@/components/site/Footer";
import { SiteContentProvider } from "@/components/site/content";
import { getSiteContent } from "@/lib/site-content.functions";
import type { SiteContent } from "@/lib/site-content-types";

const fallbackTitle = "Création Site Internet Toulouse | VR Digital";
const fallbackDescription =
  "Création de sites internet modernes pour artisans, restaurants, commerçants et entreprises. Sites vitrines, refonte et solutions web sur mesure.";

export const Route = createFileRoute("/")({
  loader: () => getSiteContent(),
  head: ({ loaderData }) => {
    const texts = loaderData?.texts ?? {};
    const title = texts["seo_title"]?.trim() || fallbackTitle;
    const description = texts["seo_description"]?.trim() || fallbackDescription;
    const ogImage = texts["seo_og_image"]?.trim();
    const faq = loaderData?.faq ?? [];

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "/" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(ogImage && ogImage.startsWith("https://")
          ? [
              { property: "og:image", content: ogImage },
              { name: "twitter:image", content: ogImage },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: "/" }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: texts["brand_name"] || "VR Digital",
            description,
            areaServed: texts["seo_area"] || "Toulouse, France",
            serviceType: "Création de sites internet",
            email: texts["contact_email"] || "contact@vrdigital.fr",
            telephone: texts["contact_phone_link"] || "+33600000000",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Toulouse",
              addressCountry: "FR",
            },
          }),
        },
        ...(faq.length
          ? [
              {
                type: "application/ld+json",
                children: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: faq.map((f) => ({
                    "@type": "Question",
                    name: f.question,
                    acceptedAnswer: { "@type": "Answer", text: f.answer },
                  })),
                }),
              },
            ]
          : []),
      ],
    };
  },
  component: Index,
});

const sectionComponents: Record<string, () => React.ReactElement> = {
  hero: Hero,
  services: Services,
  work: Work,
  before_after: BeforeAfter,
  process: Process,
  why: Why,
  pricing: Pricing,
  testimonials: Testimonials,
  contact: Contact,
  faq: Faq,
};

function Index() {
  const content = Route.useLoaderData() as SiteContent;
  const sections = content.sections.filter((s) => s.visible && sectionComponents[s.key]);

  return (
    <SiteContentProvider value={content}>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          {sections.map((s) => {
            const Section = sectionComponents[s.key]!;
            return <Section key={s.key} />;
          })}
        </main>
        <Footer />
      </div>
    </SiteContentProvider>
  );
}
