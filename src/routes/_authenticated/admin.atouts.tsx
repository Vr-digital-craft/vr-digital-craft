import { createFileRoute } from "@tanstack/react-router";
import { CollectionEditor } from "@/components/admin/CollectionEditor";

export const Route = createFileRoute("/_authenticated/admin/atouts")({
  component: () => (
    <div className="space-y-16">
      <CollectionEditor
        table="why_points"
        title="Pourquoi moi"
        description="Les arguments listés dans la section Pourquoi moi."
        fields={[{ name: "label", label: "Argument", type: "textarea" }]}
        defaults={{ label: "Nouvel argument" }}
      />
      <CollectionEditor
        table="stats"
        title="Chiffres clés"
        description="Les statistiques mises en avant."
        fields={[
          { name: "value", label: "Valeur", help: "Ex. 48h, 100%" },
          { name: "label", label: "Libellé" },
        ]}
        defaults={{ value: "0", label: "" }}
      />
    </div>
  ),
});
