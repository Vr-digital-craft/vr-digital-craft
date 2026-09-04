export type SiteContent = {
  texts: Record<string, string>;
  sections: { key: string; visible: boolean }[];
  services: { id: string; icon: string; title: string; description: string }[];
  projects: {
    id: string;
    name: string;
    category: string;
    description: string;
    url: string;
    image_url: string;
    image_alt: string;
  }[];
  steps: { id: string; step_number: string; icon: string; title: string; description: string }[];
  whyPoints: { id: string; label: string }[];
  stats: { id: string; value: string; label: string }[];
  comparison: { id: string; side: string; label: string }[];
  pricing: {
    id: string;
    name: string;
    price: string;
    features: string[];
    cta: string;
    featured: boolean;
  }[];
  testimonials: { id: string; quote: string; author: string; role: string; rating: number }[];
  faq: { id: string; question: string; answer: string }[];
};
