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
    services: SiteService[];
    about: {
      enabled: boolean;
      title: string;
      description: string;
      image: SiteImage | null;
    };
    gallery: SiteImage[];
    testimonials: {
      id: string;
      quote: string;
      author: string;
      role: string;
    }[];
    faq: {
      id: string;
      question: string;
      answer: string;
    }[];
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
