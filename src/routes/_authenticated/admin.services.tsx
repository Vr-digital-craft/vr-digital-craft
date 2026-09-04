import { createFileRoute } from "@tanstack/react-router";
import { CollectionEditor } from "@/components/admin/CollectionEditor";

export const Route = createFileRoute("/_authenticated/admin/services")({
  component: () => (
    <CollectionEditor
      table="services"
      title="Services"
      description="Les cartes affichées dans la section Services."
      fields={[
        { name: "title", label: "Titre" },
        { name: "icon", label: "Icône", type: "icon" },
        { name: "description", label: "Description", type: "textarea" },
      ]}
      defaults={{ title: "Nouveau service", icon: "Monitor", description: "" }}
    />
  ),
});
