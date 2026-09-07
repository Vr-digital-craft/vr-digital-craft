import type { TemplateMetadata } from "../packages/template-core/src";

/** Chaque futur modèle doit être déclaré ici pour apparaître dans le catalogue. */
export const templateRegistry: TemplateMetadata[] = [
  {
    id: "template-01",
    name: "Artisan moderne",
    designType: "Éditorial, chaleureux et structuré",
    description: "Une vitrine directe et rassurante pour valoriser le savoir-faire d'un artisan.",
    sectors: ["artisan", "services", "automobile"],
    previewImage: "/img/work-macon.jpg",
    demoConfig: "templates/template-01/site.config.json",
    version: 1,
    enabled: true,
  },
  {
    id: "template-02",
    name: "Restaurant chaleureux",
    designType: "Éditorial, gourmand et chaleureux",
    description:
      "Une vitrine immersive pour raconter une cuisine, présenter la carte et faciliter les réservations.",
    sectors: ["restaurant"],
    previewImage: "/templates/template-02/restaurant-hero.jpg",
    demoConfig: "templates/template-02/site.config.json",
    version: 1,
    enabled: true,
  },
  {
    id: "template-03",
    name: "Garage automobile",
    designType: "Automobile, dynamique et industriel",
    description:
      "Une vitrine immédiatement identifiable pour présenter un atelier et faciliter la prise de rendez-vous.",
    sectors: ["automobile"],
    previewImage: "/templates/template-03/garage-hero.jpg",
    demoConfig: "templates/template-03/site.config.json",
    version: 1,
    enabled: true,
  },
];
