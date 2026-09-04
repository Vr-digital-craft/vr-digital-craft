import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/medias")({
  component: MediaPage,
});

type Asset = { id: string; title: string; path: string; url: string };

function MediaPage() {
  const [rows, setRows] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  async function load() {
    const { data, error } = await supabase
      .from("media_assets")
      .select("id, title, path, url")
      .order("created_at", { ascending: false });
    if (error) toast.error("Chargement impossible", { description: error.message });
    setRows((data as Asset[] | null) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    for (const file of Array.from(files)) {
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
      const path = `${Date.now()}-${safe}`;
      const { error } = await supabase.storage.from("media").upload(path, file, {
        cacheControl: "3600",
        contentType: file.type,
      });
      if (error) {
        toast.error("Envoi impossible", { description: error.message });
        continue;
      }
      const url = `/api/public/media/${path}`;
      const { error: dbError } = await supabase
        .from("media_assets")
        .insert({ title: file.name, path, url });
      if (dbError) toast.error("Enregistrement impossible", { description: dbError.message });
    }
    setBusy(false);
    if (input.current) input.current.value = "";
    await load();
    toast.success("Médias envoyés");
  }

  async function remove(asset: Asset) {
    if (!confirm(`Supprimer « ${asset.title} » ?`)) return;
    await supabase.storage.from("media").remove([asset.path]);
    const { error } = await supabase.from("media_assets").delete().eq("id", asset.id);
    if (error) toast.error("Suppression impossible", { description: error.message });
    else setRows((prev) => prev.filter((r) => r.id !== asset.id));
  }

  async function copy(url: string) {
    await navigator.clipboard.writeText(url);
    toast.success("Adresse copiée", { description: url });
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Médiathèque</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Envoyez vos images, puis copiez leur adresse pour l'utiliser dans les autres écrans.
          </p>
        </div>
        <div>
          <input
            ref={input}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => void upload(e.target.files)}
          />
          <Button onClick={() => input.current?.click()} disabled={busy} className="gap-2">
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            Envoyer des images
          </Button>
        </div>
      </div>

      {loading ? (
        <Loader2 className="text-muted-foreground size-5 animate-spin" />
      ) : rows.length === 0 ? (
        <p className="text-muted-foreground text-sm">Aucune image pour le moment.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => (
            <div key={r.id} className="overflow-hidden rounded-lg border border-border bg-card">
              <img
                src={r.url}
                alt={r.title}
                loading="lazy"
                className="aspect-video w-full object-cover"
              />
              <div className="space-y-3 p-4">
                <p className="truncate text-sm">{r.title}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => copy(r.url)} className="gap-2">
                    <Copy className="size-3.5" /> Copier l'adresse
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => remove(r)}
                    aria-label="Supprimer"
                  >
                    <Trash2 className="size-4" />
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
