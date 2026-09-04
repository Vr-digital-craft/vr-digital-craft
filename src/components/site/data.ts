import workRestaurant from "@/assets/work-restaurant.jpg";
import workMacon from "@/assets/work-macon.jpg";
import workPaysagiste from "@/assets/work-paysagiste.jpg";
import workBeaute from "@/assets/work-beaute.jpg";

export type Project = {
  name: string;
  category: string;
  image: string;
  description: string;
  url: string;
};

/** Ajoutez / modifiez vos réalisations ici. */
export const projects: Project[] = [
  {
    name: "La Fée Maison",
    category: "Restaurant",
    image: workRestaurant,
    description: "Menu en ligne, réservation et présentation de la maison.",
    url: "#contact",
  },
  {
    name: "Bâtiment Toulousain",
    category: "Artisan Maçon",
    image: workMacon,
    description: "Vitrine de chantiers, savoir-faire et demandes de devis.",
    url: "#contact",
  },
  {
    name: "Jardin d'Éden",
    category: "Paysagiste",
    image: workPaysagiste,
    description: "Galerie de réalisations et prise de contact simplifiée.",
    url: "#contact",
  },
  {
    name: "Ô Douceur",
    category: "Institut de beauté",
    image: workBeaute,
    description: "Prestations, tarifs et réservation en quelques clics.",
    url: "#contact",
  },
];

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

/** Ajoutez / modifiez vos témoignages ici. */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Valentin a créé notre site en comprenant immédiatement notre univers. Le résultat est moderne, simple et exactement comme nous le souhaitions.",
    author: "La Fée Maison",
    role: "Restaurant",
  },
  {
    quote:
      "Un accompagnement clair du début à la fin. Je reçois aujourd'hui des demandes de devis directement depuis le site.",
    author: "Bâtiment Toulousain",
    role: "Artisan Maçon",
  },
  {
    quote:
      "Le site est rapide, très beau sur téléphone, et mes clientes trouvent enfin les informations sans m'appeler.",
    author: "Ô Douceur",
    role: "Institut de beauté",
  },
];

export const faq = [
  {
    q: "Combien coûte la création d'un site internet ?",
    a: "Un site vitrine démarre à 490 €. Le tarif dépend du nombre de pages, du design et des fonctionnalités souhaitées. Un devis clair est réalisé avant de commencer.",
  },
  {
    q: "Combien de temps faut-il pour créer un site ?",
    a: "Comptez en général 1 à 3 semaines pour un site vitrine, selon la rapidité de transmission de vos contenus (textes, photos, logo).",
  },
  {
    q: "Puis-je modifier mon site moi-même ?",
    a: "Oui. Je peux mettre en place une interface simple pour modifier vos textes, photos, horaires ou menus, et je vous forme à son utilisation.",
  },
  {
    q: "Mon site sera-t-il compatible avec les téléphones ?",
    a: "Toujours. Chaque site est conçu d'abord pour le mobile, puis adapté à la tablette et à l'ordinateur.",
  },
  {
    q: "Pouvez-vous refaire mon site actuel ?",
    a: "Oui, la refonte est l'une de mes prestations principales : nouveau design, meilleures performances, et conservation de votre référencement existant.",
  },
  {
    q: "Est-ce que vous vous occupez de la mise en ligne ?",
    a: "Oui : nom de domaine, hébergement, certificat de sécurité et mise en ligne sont gérés de A à Z.",
  },
  {
    q: "Proposez-vous la maintenance du site ?",
    a: "Oui, une formule de maintenance est disponible : mises à jour, sauvegardes, sécurité et petites modifications.",
  },
  {
    q: "Est-ce que mon site sera visible sur Google ?",
    a: "Chaque site est optimisé pour le référencement local : structure propre, balises, vitesse et fiche établissement.",
  },
];
