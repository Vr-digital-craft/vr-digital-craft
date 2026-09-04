import { createFileRoute } from "@tanstack/react-router";
import { CollectionEditor } from "@/components/admin/CollectionEditor";

export const Route = createFileRoute("/_authenticated/admin/temoignages")({
  component: () => (
    <CollectionEditor
      table="testimonials"
      title="Témoignages"
      description="Les avis clients affichés sur le site."
      fields={[
        { name: "author", label: "Auteur" },
        { name: "role", label: "Rôle / activité" },
        { name: "rating", label: "Note sur 5", type: "number" },
        { name: "quote", label: "Témoignage", type: "textarea" },
      ]}
      defaults={{ author: "", role: "", rating: 5, quote: "Nouveau témoignage" }}
    />
  ),
});
