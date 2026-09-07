export type SiteLink = {
  label: string;
  href: string;
};

export type SiteImage = {
  src: string;
  alt: string;
};

export type SiteService = {
  id: string;
  title: string;
  description: string;
  image?: SiteImage;
};

export type SiteConfig = {
  schemaVersion: 1;
  navigation: SiteLink[];
  business: {
    name: string;
    tagline: string;
    activity: string;
    description: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    openingHours: string[];
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logo: SiteImage | null;
    favicon: string;
  };
  content: {
    hero: {
      title: string;
      subtitle: string;
      image: SiteImage | null;
      primaryAction: SiteLink;
    };
    services: {
      eyebrow: string;
      title: string;
      description: string;
      items: SiteService[];
    };
    about: {
      enabled: boolean;
      eyebrow: string;
      title: string;
      description: string;
      image: SiteImage | null;
    };
    gallery: { enabled: boolean; title: string; images: SiteImage[] };
    testimonials: {
      enabled: boolean;
      title: string;
      items: { id: string; quote: string; author: string; role: string }[];
    };
    faq: {
      enabled: boolean;
      title: string;
      items: { id: string; question: string; answer: string }[];
    };
    contact: {
      eyebrow: string;
      title: string;
      description: string;
      phoneLabel: string;
      emailLabel: string;
      addressLabel: string;
      hoursLabel: string;
    };
    footer: {
      tagline: string;
      copyright: string;
    };
  };
  socialLinks: {
    facebook: string;
    instagram: string;
    google: string;
  };
  seo: {
    title: string;
    description: string;
    socialImage: string;
  };
};

export type TemplateSector =
  | "restaurant"
  | "artisan"
  | "commerce"
  | "beaute-bien-etre"
  | "immobilier"
  | "services"
  | "automobile"
  | "profession-liberale";

export type TemplateMetadata = {
  id: `template-${string}`;
  name: string;
  designType: string;
  description: string;
  sectors: TemplateSector[];
  previewImage: string;
  demoConfig: string;
  version: number;
  enabled: boolean;
};
