import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { iconNames } from "@/components/site/content";

export type FieldType = "text" | "textarea" | "number" | "boolean" | "icon" | "list" | "select";

export type Field = {
  name: string;
  label: string;
  type?: FieldType;
  options?: string[];
  help?: string;
};

type Row = Record<string, unknown> & { id: string; position?: number };

export function CollectionEditor({
  table,
  title,
  description,
  fields,
  defaults,
  ordered = true,
  hasVisible = true,
}: {
  table: string;
  title: string;
  description?: string;
  fields: Field[];
  defaults: Record<string, unknown>;
  ordered?: boolean;
  hasVisible?: boolean;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const query = supabase.from(table as never).select("*");
    const { data, error } = await (ordered
      ? query.order("position", { ascending: true })
      : query.order("created_at", { ascending: false }));
    if (error) toast.error("Chargement impossible", { description: error.message });
    setRows((data as Row[] | null) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  function patch(id: string, key: string, value: unknown) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: value } : r)));
  }

  async function save(row: Row) {
    setSaving(row.id);
    const payload: Record<string, unknown> = {};
    for (const f of fields) payload[f.name] = row[f.name];
    if (hasVisible) payload["visible"] = row["visible"];
    if (ordered) payload["position"] = row["position"];
    const { error } = await supabase
      .from(table as never)
      .update(payload as never)
      .eq("id", row.id);
    setSaving(null);
    if (error) toast.error("Enregistrement impossible", { description: error.message });
    else toast.success("Enregistré");
  }

  async function add() {
    const position = ordered ? (rows.at(-1)?.position ?? 0) + 1 : undefined;
    const insert = { ...defaults, ...(position !== undefined ? { position } : {}) };
    const { error } = await supabase.from(table as never).insert(insert as never);
    if (error) toast.error("Ajout impossible", { description: error.message });
    else await load();
  }

  async function remove(id: string) {
    if (!confirm("Supprimer définitivement cet élément ?")) return;
    const { error } = await supabase
      .from(table as never)
      .delete()
      .eq("id", id);
    if (error) toast.error("Suppression impossible", { description: error.message });
    else setRows((prev) => prev.filter((r) => r.id !== id));
  }

  async function move(index: number, dir: -1 | 1) {
    const a = rows[index];
    const b = rows[index + dir];
    if (!a || !b) return;
    const pa = (a.position as number) ?? index;
    const pb = (b.position as number) ?? index + dir;
    await supabase
      .from(table as never)
      .update({ position: pb } as never)
      .eq("id", a.id);
    await supabase
      .from(table as never)
      .update({ position: pa } as never)
      .eq("id", b.id);
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
        </div>
        <Button onClick={add} className="gap-2">
          <Plus className="size-4" /> Ajouter
        </Button>
      </div>

      {loading ? (
        <Loader2 className="text-muted-foreground size-5 animate-spin" />
      ) : rows.length === 0 ? (
        <p className="text-muted-foreground text-sm">Aucun élément pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {rows.map((row, index) => (
            <div key={row.id} className="rounded-lg border border-border bg-card p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                {fields.map((f) => (
                  <FieldInput
                    key={f.name}
                    field={f}
                    value={row[f.name]}
                    onChange={(v) => patch(row.id, f.name, v)}
                  />
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4">
                {hasVisible && (
                  <label className="flex items-center gap-2 text-sm">
                    <Switch
                      checked={Boolean(row["visible"])}
                      onCheckedChange={(v) => patch(row.id, "visible", v)}
                    />
                    Visible
                  </label>
                )}
                {ordered && (
                  <>
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
                  </>
                )}
                <div className="ml-auto flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => remove(row.id)}
                    aria-label="Supprimer"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                  <Button onClick={() => save(row)} disabled={saving === row.id} className="gap-2">
                    {saving === row.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Save className="size-4" />
                    )}
                    Enregistrer
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const type = field.type ?? "text";
  const id = `${field.name}-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <div className={type === "textarea" || type === "list" ? "sm:col-span-2" : undefined}>
      <Label htmlFor={id} className="text-xs uppercase tracking-wider text-muted-foreground">
        {field.label}
      </Label>
      <div className="mt-2">
        {type === "textarea" ? (
          <Textarea
            id={id}
            rows={3}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : type === "list" ? (
          <Textarea
            id={id}
            rows={4}
            value={Array.isArray(value) ? (value as string[]).join("\n") : String(value ?? "")}
            onChange={(e) =>
              onChange(
                e.target.value
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
          />
        ) : type === "boolean" ? (
          <Switch checked={Boolean(value)} onCheckedChange={onChange} />
        ) : type === "number" ? (
          <Input
            id={id}
            type="number"
            value={Number(value ?? 0)}
            onChange={(e) => onChange(Number(e.target.value))}
          />
        ) : type === "icon" || type === "select" ? (
          <select
            id={id}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {(type === "icon" ? iconNames : (field.options ?? [])).map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ) : (
          <Input id={id} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
        )}
        {field.help && <p className="text-muted-foreground mt-1 text-xs">{field.help}</p>}
      </div>
    </div>
  );
}
