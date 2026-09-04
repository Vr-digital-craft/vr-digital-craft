import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { SiteContent } from "./site-content-types";

/** Public, read-only fetch of every editable piece of site content. */
export const getSiteContent = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteContent> => {
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const supabase = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`)
            h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const visible = { visible: true } as const;
    const [
      texts,
      sections,
      services,
      projects,
      steps,
      why,
      stats,
      comparison,
      pricing,
      testimonials,
      faq,
    ] = await Promise.all([
      supabase.from("site_texts").select("key, value"),
      supabase.from("site_sections").select("key, visible, position").order("position"),
      supabase
        .from("services")
        .select("id, icon, title, description")
        .match(visible)
        .order("position"),
      supabase
        .from("projects")
        .select("id, name, category, description, url, image_url, image_alt")
        .match(visible)
        .order("position"),
      supabase
        .from("process_steps")
        .select("id, step_number, icon, title, description")
        .match(visible)
        .order("position"),
      supabase.from("why_points").select("id, label").match(visible).order("position"),
      supabase.from("stats").select("id, value, label").match(visible).order("position"),
      supabase.from("comparison_items").select("id, side, label").match(visible).order("position"),
      supabase
        .from("pricing_plans")
        .select("id, name, price, features, cta, featured")
        .match(visible)
        .order("position"),
      supabase
        .from("testimonials")
        .select("id, quote, author, role, rating")
        .match(visible)
        .order("position"),
      supabase.from("faq_items").select("id, question, answer").match(visible).order("position"),
    ]);

    const textMap: Record<string, string> = {};
    for (const t of texts.data ?? []) textMap[t.key] = t.value;

    return {
      texts: textMap,
      sections: (sections.data ?? []).map((s) => ({ key: s.key, visible: s.visible })),
      services: services.data ?? [],
      projects: projects.data ?? [],
      steps: steps.data ?? [],
      whyPoints: why.data ?? [],
      stats: stats.data ?? [],
      comparison: comparison.data ?? [],
      pricing: pricing.data ?? [],
      testimonials: testimonials.data ?? [],
      faq: faq.data ?? [],
    };
  },
);
