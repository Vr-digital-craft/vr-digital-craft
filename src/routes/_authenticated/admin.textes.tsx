import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/admin/textes")({
  component: TextsPage,
});

type TextRow = {
  key: string;
  group_name: string;
  label: string;
  help: string | null;
  value: string;
  field_type: string;
  position: number;
};

function TextsPage() {
  const [rows, setRows] = useState<TextRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState<Record<string, string>>({});

  useEffect(() => {
    void (async () => {
      const { data, error } = await supabase
        .from("site_texts")
        .select("key, group_name, label, help, value, field_type, position")
        .order("group_name")
        .order("position");
      if (error) toast.error("Chargement impossible", { description: error.message });
      setRows((data as TextRow[] | null) ?? []);
      setLoading(false);
    })();
  }, []);

  const groups = [...new Set(rows.map((r) => r.group_name))];

  async function saveAll() {
    const entries = Object.entries(dirty);
    if (entries.length === 0) return;
    setSaving(true);
    for (const [key, value] of entries) {
      const { error } = await supabase.from("site_texts").update({ value }).eq("key", key);
      if (error) {
        setSaving(false);
        toast.error("Enregistrement impossible", { description: error.message });
        return;
      }
    }
    setSaving(false);
    setDirty({});
    toast.success("Textes enregistrés");
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Textes du site</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Titres, descriptions, coordonnées, réseaux sociaux et référencement.
          </p>
        </div>
        <Button
          onClick={saveAll}
          disabled={saving || Object.keys(dirty).length === 0}
          className="gap-2"
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Enregistrer
        </Button>
      </div>

      {loading ? (
        <Loader2 className="text-muted-foreground size-5 animate-spin" />
      ) : (
        <div className="space-y-10">
          {groups.map((group) => (
            <section key={group}>
              <h2 className="font-display text-lg font-semibold">{group}</h2>
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                {rows
                  .filter((r) => r.group_name === group)
                  .map((r) => {
                    const value = dirty[r.key] ?? r.value;
                    const long = r.field_type === "textarea";
                    return (
                      <div key={r.key} className={long ? "sm:col-span-2" : undefined}>
                        <Label
                          htmlFor={r.key}
                          className="text-muted-foreground text-xs uppercase tracking-wider"
                        >
                          {r.label}
                        </Label>
                        <div className="mt-2">
                          {long ? (
                            <Textarea
                              id={r.key}
                              rows={3}
                              value={value}
                              onChange={(e) => setDirty((d) => ({ ...d, [r.key]: e.target.value }))}
                            />
                          ) : (
                            <Input
                              id={r.key}
                              value={value}
                              onChange={(e) => setDirty((d) => ({ ...d, [r.key]: e.target.value }))}
                            />
                          )}
                          {r.help && <p className="text-muted-foreground mt-1 text-xs">{r.help}</p>}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
