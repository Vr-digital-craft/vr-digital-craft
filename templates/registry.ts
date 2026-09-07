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
];
