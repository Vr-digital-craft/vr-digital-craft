import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const title = "Connexion administration | VR Studio";
const description = "Accès réservé à l'administration du site VR Studio.";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  // Le lien de confirmation reçu par email connecte déjà le compte.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        supabase.rpc("claim_admin").then(() => navigate({ to: "/admin" }));
      }
    });
  }, [navigate]);

  async function sendReset() {
    const target = email.trim().toLowerCase();
    if (!target) {
      toast.error("Renseignez votre email d'abord");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(target, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) {
      toast.error("Envoi impossible", { description: error.message });
      return;
    }
    toast.success("Email envoyé", {
      description: "Ouvrez le lien reçu pour définir un nouveau mot de passe.",
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const cleanEmail = email.trim().toLowerCase();
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth` },
        });
        if (error) throw error;
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) {
          toast.success("Compte créé", {
            description: "Vérifiez votre boîte mail pour confirmer votre adresse.",
          });
          setMode("signin");
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
        if (error) throw error;
      }
      // Le premier compte devient administrateur.
      await supabase.rpc("claim_admin");
      await navigate({ to: "/admin" });
    } catch (error) {
      toast.error("Connexion impossible", {
        description: error instanceof Error ? error.message : "Vérifiez vos identifiants.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-16">
      <div className="w-full max-w-sm">
        <p className="eyebrow">Espace privé</p>
        <h1 className="font-display mt-4 text-3xl font-bold tracking-[-0.03em]">
          {mode === "signin" ? "Connexion" : "Créer un compte"}
        </h1>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2"
            />
          </div>
          <Button type="submit" disabled={busy} className="w-full gap-2">
            {busy && <Loader2 className="size-4 animate-spin" />}
            {mode === "signin" ? "Se connecter" : "Créer mon compte"}
          </Button>
        </form>
        <div className="mt-6 flex flex-col items-start gap-3 text-sm">
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-muted-foreground hover:text-neon transition-colors"
          >
            {mode === "signin" ? "Pas encore de compte ? En créer un" : "J'ai déjà un compte"}
          </button>
          {mode === "signin" && (
            <button
              type="button"
              onClick={sendReset}
              disabled={busy}
              className="text-muted-foreground hover:text-neon transition-colors"
            >
              Mot de passe oublié ?
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
