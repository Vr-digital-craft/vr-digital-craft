import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  FileText,
  GalleryHorizontalEnd,
  Image,
  Layers3,
  MessageSquareText,
  Tags,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

const cards = [
  {
    to: "/admin/messages",
    label: "Demandes",
    desc: "Messages reçus depuis le formulaire",
    icon: MessageSquareText,
  },
  {
    to: "/admin/textes",
    label: "Textes & SEO",
    desc: "Titres, coordonnées et référencement",
    icon: FileText,
  },
  {
    to: "/admin/realisations",
    label: "Réalisations",
    desc: "Portfolio et ordre d'affichage",
    icon: GalleryHorizontalEnd,
  },
  { to: "/admin/tarifs", label: "Tarifs", desc: "Offres, prix et options", icon: Tags },
  { to: "/admin/medias", label: "Médiathèque", desc: "Images utilisées sur le site", icon: Image },
  {
    to: "/admin/sections",
    label: "Sections",
    desc: "Visibilité et ordre de la page",
    icon: Layers3,
  },
] satisfies { to: string; label: string; desc: string; icon: LucideIcon }[];

function Dashboard() {
  const [pending, setPending] = useState<number | null>(null);

  useEffect(() => {
    void (async () => {
      const { count } = await supabase
        .from("contact_requests")
        .select("id", { count: "exact", head: true })
        .eq("status", "nouveau");
      setPending(count ?? 0);
    })();
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border bg-card/80 p-6 sm:p-8">
        <p className="eyebrow">Vue d'ensemble</p>
        <h1 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Bonjour Valentin.
        </h1>
        <p className="text-muted-foreground mt-3 text-sm sm:text-base">
          {pending === null
            ? "Chargement…"
            : pending === 0
              ? "Aucune nouvelle demande de contact."
              : `${pending} nouvelle${pending > 1 ? "s" : ""} demande${pending > 1 ? "s" : ""} à traiter.`}
        </p>
      </div>
      <div>
        <h2 className="font-display text-lg font-semibold">Accès rapides</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Choisissez la partie du site à modifier.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="group rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-neon/50 hover:shadow-[var(--shadow-neon)]"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="flex size-10 items-center justify-center rounded-lg bg-secondary text-neon">
                <c.icon className="size-5" />
              </span>
              <ArrowRight className="text-muted-foreground size-4 transition-transform group-hover:translate-x-1 group-hover:text-neon" />
            </div>
            <p className="font-display mt-5 font-semibold">{c.label}</p>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
