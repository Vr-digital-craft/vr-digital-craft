import { useEffect, useState } from "react";
import { createFileRoute, Link, Outlet, useNavigate, useRouter } from "@tanstack/react-router";
import {
  BarChart3,
  Blocks,
  ChevronRight,
  CircleHelp,
  Eye,
  FileText,
  GalleryHorizontalEnd,
  Image,
  Layers3,
  ListOrdered,
  Loader2,
  LogOut,
  Menu,
  MessageSquareText,
  PanelLeftClose,
  PanelTop,
  Quote,
  Sparkles,
  Tags,
  X,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const title = "Administration | VR Studio";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: "Espace privé de gestion du contenu du site VR Studio." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: title },
      { property: "og:description", content: "Espace privé de gestion du contenu." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminLayout,
});

const nav: { to: string; label: string; group: string; icon: LucideIcon }[] = [
  { to: "/admin", label: "Vue d'ensemble", group: "Général", icon: BarChart3 },
  { to: "/admin/messages", label: "Demandes", group: "Général", icon: MessageSquareText },
  { to: "/admin/textes", label: "Textes & SEO", group: "Contenu", icon: FileText },
  { to: "/admin/services", label: "Services", group: "Contenu", icon: Blocks },
  {
    to: "/admin/realisations",
    label: "Réalisations",
    group: "Contenu",
    icon: GalleryHorizontalEnd,
  },
  { to: "/admin/etapes", label: "Étapes", group: "Contenu", icon: ListOrdered },
  { to: "/admin/atouts", label: "Atouts", group: "Contenu", icon: Sparkles },
  { to: "/admin/comparaison", label: "Avant / Après", group: "Contenu", icon: PanelTop },
  { to: "/admin/tarifs", label: "Tarifs", group: "Contenu", icon: Tags },
  { to: "/admin/temoignages", label: "Témoignages", group: "Contenu", icon: Quote },
  { to: "/admin/faq", label: "FAQ", group: "Contenu", icon: CircleHelp },
  { to: "/admin/medias", label: "Médiathèque", group: "Organisation", icon: Image },
  { to: "/admin/sections", label: "Ordre des sections", group: "Organisation", icon: Layers3 },
];

const groups = ["Général", "Contenu", "Organisation"];

function AdminLayout() {
  const navigate = useNavigate();
  const router = useRouter();
  const [state, setState] = useState<"loading" | "ok" | "denied">("loading");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let active = true;
    void (async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;
      await supabase.rpc("claim_admin");
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (active) setState(data ? "ok" : "denied");
    })();
    return () => {
      active = false;
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    await router.invalidate();
    await navigate({ to: "/auth", replace: true });
  }

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="text-muted-foreground size-6 animate-spin" />
      </div>
    );
  }

  if (state === "denied") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-5 text-center">
        <h1 className="font-display text-2xl font-bold">Accès refusé</h1>
        <p className="text-muted-foreground max-w-md text-sm">
          Ce compte n'est pas administrateur. Contactez l'administrateur du site pour obtenir
          l'accès.
        </p>
        <Button variant="outline" onClick={signOut} className="gap-2">
          <LogOut className="size-4" /> Se déconnecter
        </Button>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,var(--surface),transparent_32rem)] lg:flex">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/90 px-5 py-3 backdrop-blur-xl lg:hidden">
        <div>
          <span className="font-display block font-bold">VR Studio</span>
          <span className="text-muted-foreground text-xs">Administration</span>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </Button>
      </header>

      {open && (
        <button
          type="button"
          aria-label="Fermer le menu"
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`${open ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 flex w-[min(88vw,19rem)] flex-col border-r border-border bg-background px-4 py-5 shadow-2xl transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:shrink-0 lg:translate-x-0 lg:shadow-none`}
      >
        <div className="flex items-center justify-between border-b border-border px-2 pb-5">
          <Link
            to="/admin"
            className="group flex items-center gap-3"
            onClick={() => setOpen(false)}
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-neon font-display font-black text-black">
              VR
            </span>
            <span>
              <span className="font-display block font-bold">Administration</span>
              <span className="text-muted-foreground text-xs">Gérez votre site</span>
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Fermer"
          >
            <PanelLeftClose className="size-4" />
          </Button>
        </div>

        <nav className="mt-5 flex-1 space-y-6 overflow-y-auto pr-1" aria-label="Administration">
          {groups.map((group) => (
            <div key={group}>
              <p className="text-muted-foreground px-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em]">
                {group}
              </p>
              <div className="mt-2 space-y-1">
                {nav
                  .filter((n) => n.group === group)
                  .map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      activeOptions={{ exact: item.to === "/admin" }}
                      activeProps={{ className: "!bg-neon/10 !text-neon ring-1 ring-neon/20" }}
                      className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
                    >
                      <item.icon className="size-4 shrink-0" aria-hidden />
                      <span className="flex-1">{item.label}</span>
                      <ChevronRight
                        className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100"
                        aria-hidden
                      />
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="mt-5 space-y-2 border-t border-border pt-5">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Eye className="size-4" /> Voir le site
          </a>
          <Button variant="outline" onClick={signOut} className="w-full gap-2">
            <LogOut className="size-4" /> Déconnexion
          </Button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-5 py-7 sm:px-8 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
