/* eslint-disable react-refresh/only-export-components -- provider, hooks and icon registry belong together */
import { createContext, useContext, type ReactNode } from "react";
import {
  Monitor,
  UtensilsCrossed,
  Hammer,
  Code2,
  MessagesSquare,
  PenTool,
  CheckCircle2,
  Rocket,
  Sparkles,
  Search,
  Smartphone,
  ShoppingBag,
  Camera,
  Palette,
  Wrench,
  Star,
  type LucideIcon,
} from "lucide-react";
import type { SiteContent } from "@/lib/site-content-types";

export const iconMap: Record<string, LucideIcon> = {
  Monitor,
  UtensilsCrossed,
  Hammer,
  Code2,
  MessagesSquare,
  PenTool,
  CheckCircle2,
  Rocket,
  Sparkles,
  Search,
  Smartphone,
  ShoppingBag,
  Camera,
  Palette,
  Wrench,
  Star,
};

export const iconNames = Object.keys(iconMap);

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = iconMap[name] ?? Sparkles;
  return <Cmp className={className} aria-hidden />;
}

const SiteContentContext = createContext<SiteContent | null>(null);

export function SiteContentProvider({
  value,
  children,
}: {
  value: SiteContent;
  children: ReactNode;
}) {
  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent(): SiteContent {
  const ctx = useContext(SiteContentContext);
  if (!ctx) throw new Error("useSiteContent must be used inside SiteContentProvider");
  return ctx;
}

/** Text by key, with a safe fallback when the key is missing or empty. */
export function useText() {
  const { texts } = useSiteContent();
  return (key: string, fallback = "") => {
    const value = texts[key];
    return value && value.trim() !== "" ? value : fallback;
  };
}
