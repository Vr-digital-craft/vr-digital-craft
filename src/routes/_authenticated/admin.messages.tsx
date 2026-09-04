import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/admin/messages")({
  component: MessagesPage,
});

const statuses = ["nouveau", "en cours", "traité", "archivé"];

type Request = {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  project_type: string | null;
  budget: string | null;
  message: string;
  status: string;
  internal_notes: string | null;
  created_at: string;
};

function MessagesPage() {
  const [rows, setRows] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("tous");

  async function load() {
    const { data, error } = await supabase
      .from("contact_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Chargement impossible", { description: error.message });
    setRows((data as Request[] | null) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  function patch(id: string, key: keyof Request, value: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: value } : r)));
  }

  async function save(row: Request) {
    setSaving(row.id);
    const { error } = await supabase
      .from("contact_requests")
      .update({ status: row.status, internal_notes: row.internal_notes })
      .eq("id", row.id);
    setSaving(null);
    if (error) toast.error("Enregistrement impossible", { description: error.message });
    else toast.success("Demande mise à jour");
  }

  async function remove(id: string) {
    if (!confirm("Supprimer définitivement cette demande ?")) return;
    const { error } = await supabase.from("contact_requests").delete().eq("id", id);
    if (error) toast.error("Suppression impossible", { description: error.message });
    else setRows((prev) => prev.filter((r) => r.id !== id));
  }

  const visible = filter === "tous" ? rows : rows.filter((r) => r.status === filter);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Demandes de contact</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Messages reçus depuis le formulaire du site.
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          aria-label="Filtrer par statut"
        >
          {["tous", ...statuses].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader2 className="text-muted-foreground size-5 animate-spin" />
      ) : visible.length === 0 ? (
        <p className="text-muted-foreground text-sm">Aucune demande.</p>
      ) : (
        <div className="space-y-4">
          {visible.map((r) => (
            <article key={r.id} className="rounded-lg border border-border bg-card p-5">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-display font-semibold">{r.name}</span>
                {r.company && <span className="text-muted-foreground text-sm">{r.company}</span>}
                <span className="text-muted-foreground ml-auto text-xs">
                  {new Date(r.created_at).toLocaleString("fr-FR")}
                </span>
              </div>
              <div className="text-muted-foreground mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <a href={`mailto:${r.email}`} className="hover:text-neon transition-colors">
                  {r.email}
                </a>
                {r.phone && (
                  <a href={`tel:${r.phone}`} className="hover:text-neon transition-colors">
                    {r.phone}
                  </a>
                )}
                {r.project_type && <span>Projet : {r.project_type}</span>}
                {r.budget && <span>Budget : {r.budget}</span>}
              </div>
              <p className="mt-4 whitespace-pre-line text-sm">{r.message}</p>

              <div className="mt-5 grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
                <div>
                  <label className="text-muted-foreground text-xs uppercase tracking-wider">
                    Statut
                    <select
                      value={r.status}
                      onChange={(e) => patch(r.id, "status", e.target.value)}
                      className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div>
                  <label className="text-muted-foreground text-xs uppercase tracking-wider">
                    Notes internes
                    <Textarea
                      rows={2}
                      className="mt-2"
                      value={r.internal_notes ?? ""}
                      onChange={(e) => patch(r.id, "internal_notes", e.target.value)}
                    />
                  </label>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => remove(r.id)}
                  aria-label="Supprimer"
                >
                  <Trash2 className="size-4" />
                </Button>
                <Button onClick={() => save(r)} disabled={saving === r.id} className="gap-2">
                  {saving === r.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Save className="size-4" />
                  )}
                  Enregistrer
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
