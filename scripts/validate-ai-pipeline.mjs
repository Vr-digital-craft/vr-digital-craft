import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { transformWithEsbuild } from "vite";

const fixtures = [
  ["template-01", "Artisan", "Un accompagnement clair pour vos travaux à Lyon."],
  ["template-02", "Restaurant", "Une cuisine soignée à découvrir à Bordeaux."],
  ["template-03", "Garage", "L’entretien de votre véhicule à Lille, en toute simplicité."],
];

const source = await readFile(new URL("../src/modules/ai/site-copy.ts", import.meta.url), "utf8");
const compiled = await transformWithEsbuild(source, "site-copy.ts", {
  loader: "ts",
  format: "esm",
  target: "es2022",
});
const {
  parseAndSanitizeGeneratedCopy,
  applyGeneratedCopy,
  applyGeneratedCopyPreservingStructuredFacts,
} = await import(`data:text/javascript;base64,${Buffer.from(compiled.code).toString("base64")}`);

for (const [templateId, activity, subtitle] of fixtures) {
  const config = JSON.parse(
    await readFile(new URL(`../templates/${templateId}/site.config.json`, import.meta.url), "utf8"),
  );
  const response = JSON.stringify({
    businessFacts: {
      name: config.business.name,
      tagline: config.business.tagline,
      activity: config.business.activity,
      description: config.business.description,
      phone: config.business.phone,
      email: config.business.email,
      address: config.business.address,
      city: config.business.city,
      openingHours: config.business.openingHours.join(" · "),
    },
    heroTitle: `${activity} à ${config.business.city}`,
    heroSubtitle: subtitle,
    aboutTitle: `À propos de ${config.business.name}`,
    aboutDescription: config.business.description,
    contactTitle: "Parlons de votre besoin",
    contactDescription: "Contactez-nous pour obtenir les informations adaptées à votre projet.",
    primaryCta: "Nous contacter",
    footerTagline: config.business.tagline,
    services: config.content.services.items.map(({ title, description }) => ({
      title,
      description,
    })),
    faq: [],
    seoTitle: `${activity} à ${config.business.city} | ${config.business.name}`,
    seoDescription: `${config.business.name} présente ses services à ${config.business.city}. Contactez-nous pour échanger sur votre besoin.`,
  });

  const copy = parseAndSanitizeGeneratedCopy(response, config);
  const generated = applyGeneratedCopy(config, copy);
  assert.equal(generated.content.hero.title, copy.heroTitle);
  assert.deepEqual(
    generated.content.services.items.map(({ title }) => title),
    copy.services.map(({ title }) => title),
  );
  assert.equal(generated.seo.title, copy.seoTitle);
  assert.ok(generated.seo.description.length <= 160);
  assert.match(generated.content.hero.subtitle, /[àéèê]/i);

  const contradictory = structuredClone(copy);
  contradictory.businessFacts.city = "Bordeaux";
  contradictory.services = [{ title: "Service inventé", description: "À ne pas conserver." }];
  const protectedConfig = applyGeneratedCopyPreservingStructuredFacts(config, contradictory);
  assert.equal(protectedConfig.business.city, config.business.city);
  assert.deepEqual(protectedConfig.content.services.items, config.content.services.items);
}

console.log("Pipeline IA validé : Artisan, Restaurant et Garage.");
