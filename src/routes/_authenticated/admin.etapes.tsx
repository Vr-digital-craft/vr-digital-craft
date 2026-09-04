import { createFileRoute } from "@tanstack/react-router";
import { CollectionEditor } from "@/components/admin/CollectionEditor";

export const Route = createFileRoute("/_authenticated/admin/etapes")({
  component: () => (
    <CollectionEditor
      table="process_steps"
      title="Comment ça marche"
      description="Les étapes de la timeline."
      fields={[
        { name: "step_number", label: "Numéro", help: "Ex. 01" },
        { name: "icon", label: "Icône", type: "icon" },
        { name: "title", label: "Titre" },
        { name: "description", label: "Description", type: "textarea" },
      ]}
      defaults={{
        step_number: "01",
        icon: "MessagesSquare",
        title: "Nouvelle étape",
        description: "",
      }}
    />
  ),
});
