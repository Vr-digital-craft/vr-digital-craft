import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { useSiteContent, useText } from "./content";

export function Faq() {
  const t = useText();
  const { faq } = useSiteContent();

  return (
    <section id="faq" className="mx-auto max-w-4xl px-5 py-24 sm:px-8 lg:py-36">
      <SectionHeading
        eyebrow={t("faq_eyebrow", "FAQ")}
        title={t("faq_title", "Les questions fréquentes.")}
      />

      <Reveal delay={100} className="mt-12 sm:mt-16">
        <Accordion type="single" collapsible className="w-full">
          {faq.map((item, i) => (
            <AccordionItem key={item.id} value={`item-${i}`} className="border-border">
              <AccordionTrigger className="font-display py-6 text-left text-lg font-medium tracking-tight hover:text-neon hover:no-underline sm:text-xl">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6 text-sm leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </section>
  );
}
