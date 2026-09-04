import { createFileRoute } from "@tanstack/react-router";
import { CollectionEditor } from "@/components/admin/CollectionEditor";

export const Route = createFileRoute("/_authenticated/admin/realisations")({
  component: () => (
    <CollectionEditor
      table="projects"
      title="Réalisations"
      description="Portfolio affiché dans la section Réalisations."
      fields={[
        { name: "name", label: "Nom" },
        { name: "category", label: "Catégorie" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "url", label: "Lien", help: "Ex. https://… ou #contact" },
        {
          name: "image_url",
          label: "Image",
          help: "Collez l'adresse d'une image de la médiathèque ou /img/…",
        },
        { name: "image_alt", label: "Texte alternatif de l'image" },
      ]}
      defaults={{
        name: "Nouvelle réalisation",
        category: "",
        description: "",
        url: "#contact",
        image_url: "",
        image_alt: "",
      }}
    />
  ),
});
