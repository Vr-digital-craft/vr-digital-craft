import type { SiteContent } from "@/lib/site-content-types";

const items = (prefix: string, labels: string[]) =>
  labels.map((label, index) => ({ id: `${prefix}-${index + 1}`, label }));

const comparisonItems = (prefix: string, labels: string[], side: string) =>
  labels.map((label, index) => ({ id: `${prefix}-${index + 1}`, label, side }));

export const siteContent: SiteContent = {
  texts: {},
  sections: [
    "hero",
    "services",
    "work",
    "before_after",
    "process",
    "why",
    "pricing",
    "testimonials",
    "contact",
    "faq",
  ].map((key) => ({
    key,
    visible: key !== "work" && key !== "before_after" && key !== "testimonials",
  })),
  services: [
    {
      id: "sites-vitrines",
      icon: "Monitor",
      title: "Sites vitrines",
      description: "Présentez votre activité avec un site professionnel, moderne et efficace.",
    },
    {
      id: "restaurants",
      icon: "UtensilsCrossed",
      title: "Restaurants",
      description:
        "Menus en ligne, réservation, présentation de votre établissement et de vos spécialités.",
    },
    {
      id: "artisans",
      icon: "Hammer",
      title: "Artisans & commerçants",
      description: "Mettez en avant votre savoir-faire et attirez plus de clients localement.",
    },
    {
      id: "web-apps",
      icon: "Code2",
      title: "Web apps & outils",
      description: "Des solutions web sur mesure pour automatiser et simplifier votre quotidien.",
    },
  ],
  projects: [
    {
      id: "fee-maison",
      name: "La Fée Maison",
      category: "Restaurant",
      description: "Menu en ligne, réservation et présentation de la maison.",
      url: "/#contact",
      image_url: "/img/work-restaurant.jpg",
      image_alt: "Site internet de restaurant",
    },
    {
      id: "batiment",
      name: "Bâtiment Toulousain",
      category: "Artisan Maçon",
      description: "Vitrine de chantiers, savoir-faire et demandes de devis.",
      url: "/#contact",
      image_url: "/img/work-macon.jpg",
      image_alt: "Site internet d'artisan maçon",
    },
    {
      id: "jardin",
      name: "Jardin d'Éden",
      category: "Paysagiste",
      description: "Galerie de réalisations et prise de contact simplifiée.",
      url: "/#contact",
      image_url: "/img/work-paysagiste.jpg",
      image_alt: "Site internet de paysagiste",
    },
    {
      id: "douceur",
      name: "Ô Douceur",
      category: "Institut de beauté",
      description: "Prestations, tarifs et réservation en quelques clics.",
      url: "/#contact",
      image_url: "/img/work-beaute.jpg",
      image_alt: "Site internet d'institut de beauté",
    },
  ],
  steps: [
    {
      id: "echange",
      step_number: "01",
      icon: "MessagesSquare",
      title: "Échange",
      description: "Nous discutons de votre projet, de vos besoins et de vos objectifs.",
    },
    {
      id: "maquette",
      step_number: "02",
      icon: "PenTool",
      title: "Maquette",
      description: "Je crée une maquette adaptée à votre activité et à votre image.",
    },
    {
      id: "developpement",
      step_number: "03",
      icon: "Code2",
      title: "Développement",
      description: "Je développe votre site avec soin, rapidité et optimisation.",
    },
    {
      id: "validation",
      step_number: "04",
      icon: "CheckCircle2",
      title: "Validation",
      description: "Vous validez le site et j'apporte les derniers ajustements.",
    },
    {
      id: "ligne",
      step_number: "05",
      icon: "Rocket",
      title: "Mise en ligne",
      description: "Votre site est en ligne. Je reste disponible pour la suite.",
    },
  ],
  whyPoints: items("atout", [
    "Design personnalisé",
    "Compatible mobile",
    "Site rapide",
    "Référencement local",
    "Accompagnement humain",
    "Modifications possibles",
    "Maintenance disponible",
    "Site adapté à votre métier",
  ]),
  stats: [
    { id: "responsive", value: "100 %", label: "Responsive" },
    { id: "disponible", value: "24/7", label: "Votre site travaille pour vous" },
    { id: "vitesse", value: "< 3 sec", label: "Objectif de chargement" },
  ],
  comparison: [
    ...comparisonItems(
      "avant",
      [
        "Page Facebook uniquement",
        "Informations difficiles à trouver",
        "Design non professionnel",
        "Mauvaise expérience mobile",
        "Peu visible sur Google",
      ],
      "before",
    ),
    ...comparisonItems(
      "apres",
      [
        "Site professionnel",
        "Informations accessibles immédiatement",
        "Design moderne",
        "Compatible mobile",
        "Référencement local",
        "Contact en un clic",
      ],
      "after",
    ),
  ],
  pricing: [
    {
      id: "essentiel",
      name: "Site modèle",
      price: "À partir de 490 €",
      features: [
        "Modèle professionnel personnalisé",
        "Responsive",
        "Prise de contact",
        "Mise en ligne",
      ],
      cta: "Choisir un modèle",
      featured: false,
    },
    {
      id: "premium",
      name: "Premium",
      price: "À partir de 890 €",
      features: [
        "Design personnalisé",
        "Responsive",
        "Référencement local",
        "Prise de contact",
        "Animations",
        "Mise en ligne",
      ],
      cta: "Choisir Premium",
      featured: true,
    },
    {
      id: "sur-mesure",
      name: "Sur mesure",
      price: "Sur devis",
      features: [
        "Fonctionnalités personnalisées",
        "Web App",
        "Réservation",
        "Automatisation",
        "Accompagnement personnalisé",
      ],
      cta: "Parler de mon projet",
      featured: false,
    },
  ],
  testimonials: [
    {
      id: "avis-1",
      quote:
        "Valentin a créé notre site en comprenant immédiatement notre univers. Le résultat est moderne, simple et exactement comme nous le souhaitions.",
      author: "La Fée Maison",
      role: "Restaurant",
      rating: 5,
    },
    {
      id: "avis-2",
      quote:
        "Un accompagnement clair du début à la fin. Je reçois aujourd'hui des demandes de devis directement depuis le site.",
      author: "Bâtiment Toulousain",
      role: "Artisan Maçon",
      rating: 5,
    },
    {
      id: "avis-3",
      quote:
        "Le site est rapide, très beau sur téléphone, et mes clientes trouvent enfin les informations sans m'appeler.",
      author: "Ô Douceur",
      role: "Institut de beauté",
      rating: 5,
    },
  ],
  faq: [
    {
      id: "faq-1",
      question: "Combien coûte la création d'un site internet ?",
      answer:
        "Un site vitrine démarre à 490 €. Le tarif dépend du nombre de pages, du design et des fonctionnalités souhaitées. Un devis clair est réalisé avant de commencer.",
    },
    {
      id: "faq-2",
      question: "Combien de temps faut-il pour créer un site ?",
      answer:
        "Comptez en général 1 à 3 semaines pour un site vitrine, selon la rapidité de transmission de vos contenus (textes, photos, logo).",
    },
    {
      id: "faq-3",
      question: "Puis-je modifier mon site moi-même ?",
      answer:
        "Oui. Les modifications de textes, photos, horaires ou contenus peuvent être réalisées simplement avec mon accompagnement.",
    },
    {
      id: "faq-4",
      question: "Mon site sera-t-il compatible avec les téléphones ?",
      answer:
        "Toujours. Chaque site est conçu d'abord pour le mobile, puis adapté à la tablette et à l'ordinateur.",
    },
    {
      id: "faq-5",
      question: "Pouvez-vous refaire mon site actuel ?",
      answer:
        "Oui, la refonte est l'une de mes prestations principales : nouveau design, meilleures performances, et conservation de votre référencement existant.",
    },
    {
      id: "faq-6",
      question: "Est-ce que vous vous occupez de la mise en ligne ?",
      answer:
        "Oui : nom de domaine, hébergement, certificat de sécurité et mise en ligne sont gérés de A à Z.",
    },
    {
      id: "faq-7",
      question: "Proposez-vous la maintenance du site ?",
      answer:
        "Oui, une formule de maintenance est disponible : mises à jour, sauvegardes, sécurité et petites modifications.",
    },
    {
      id: "faq-8",
      question: "Est-ce que mon site sera visible sur Google ?",
      answer:
        "Chaque site est optimisé pour le référencement local : structure propre, balises, vitesse et fiche établissement.",
    },
  ],
};
