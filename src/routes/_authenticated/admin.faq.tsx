import { createFileRoute } from "@tanstack/react-router";
import { CollectionEditor } from "@/components/admin/CollectionEditor";

export const Route = createFileRoute("/_authenticated/admin/faq")({
  component: () => (
    <CollectionEditor
      table="faq_items"
      title="FAQ"
      description="Les questions fréquentes (également utilisées pour le référencement)."
      fields={[
        { name: "question", label: "Question" },
        { name: "answer", label: "Réponse", type: "textarea" },
      ]}
      defaults={{ question: "Nouvelle question", answer: "" }}
    />
  ),
});
