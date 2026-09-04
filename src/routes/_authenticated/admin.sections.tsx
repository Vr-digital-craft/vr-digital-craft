import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_authenticated/admin/sections")({
  component: SectionsPage,
});

type Section = { key: string; label: string; visible: boolean; position: number };

function SectionsPage() {
  const [rows, setRows] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data, error } = await supabase
      .from("site_sections")
      .select("key, label, visible, position")
      .order("position");
    if (error) toast.error("Chargement impossible", { description: error.message });
    setRows((data as Section[] | null) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function toggle(key: string, visible: boolean) {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, visible } : r)));
    const { error } = await supabase.from("site_sections").update({ visible }).eq("key", key);
    if (error) toast.error("Mise à jour impossible", { description: error.message });
  }

  async function move(index: number, dir: -1 | 1) {
    const a = rows[index];
    const b = rows[index + dir];
    if (!a || !b) return;
    await supabase.from("site_sections").update({ position: b.position }).eq("key", a.key);
    await supabase.from("site_sections").update({ position: a.position }).eq("key", b.key);
    await load();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Sections</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Activez, désactivez et réordonnez les sections de la page d'accueil.
        </p>
      </div>

      {loading ? (
        <Loader2 className="text-muted-foreground size-5 animate-spin" />
      ) : (
        <div className="space-y-3">
          {rows.map((r, index) => (
            <div
              key={r.key}
              className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card px-5 py-4"
            >
              <span className="font-display font-semibold">{r.label}</span>
              <span className="text-muted-foreground text-xs">{r.key}</span>
              <div className="ml-auto flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <Switch
                    checked={r.visible}
                    onCheckedChange={(v) => toggle(r.key, v)}
                    aria-label={`Afficher ${r.label}`}
                  />
                  Visible
                </label>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label="Monter"
                >
                  <ArrowUp className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => move(index, 1)}
                  disabled={index === rows.length - 1}
                  aria-label="Descendre"
                >
                  <ArrowDown className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
