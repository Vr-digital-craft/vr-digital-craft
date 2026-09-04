import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  className,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow && (
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
        </Reveal>
      )}
      <Reveal delay={80}>
        <h2 className="font-display mt-5 text-[clamp(1.9rem,6vw,4.25rem)] leading-[1.02] font-bold tracking-[-0.035em]">
          {title}
        </h2>
      </Reveal>
    </div>
  );
}
