import { createFileRoute } from "@tanstack/react-router";
import { CollectionEditor } from "@/components/admin/CollectionEditor";

export const Route = createFileRoute("/_authenticated/admin/comparaison")({
  component: () => (
    <CollectionEditor
      table="comparison_items"
      title="Avant / Après"
      description="Les points comparés dans la section Avant / Après."
      fields={[
        { name: "side", label: "Colonne", type: "select", options: ["before", "after"] },
        { name: "label", label: "Texte", type: "textarea" },
      ]}
      defaults={{ side: "before", label: "Nouveau point" }}
    />
  ),
});
