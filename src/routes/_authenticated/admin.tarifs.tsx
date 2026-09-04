import { createFileRoute } from "@tanstack/react-router";
import { CollectionEditor } from "@/components/admin/CollectionEditor";

export const Route = createFileRoute("/_authenticated/admin/tarifs")({
  component: () => (
    <CollectionEditor
      table="pricing_plans"
      title="Tarifs"
      description="Les offres affichées dans la section Tarifs."
      fields={[
        { name: "name", label: "Nom de l'offre" },
        { name: "price", label: "Prix", help: "Ex. À partir de 890 €" },
        { name: "cta", label: "Texte du bouton" },
        { name: "featured", label: "Offre mise en avant", type: "boolean" },
        { name: "features", label: "Inclus", type: "list", help: "Une ligne par élément" },
      ]}
      defaults={{
        name: "Nouvelle offre",
        price: "",
        cta: "Choisir",
        featured: false,
        features: [],
      }}
    />
  ),
});
