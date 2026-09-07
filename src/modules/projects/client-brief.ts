export type ClientBriefDraft = {
  templateId: string;
  companyName: string;
  tagline: string;
  activity: string;
  description: string;
  companyStory: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  openingHours: string;
  services: string[];
  socialLinks: {
    facebook: string;
    instagram: string;
    google: string;
  };
  colors: {
    primary: string;
    secondary: string;
  };
  logoName: string;
  photoNames: string[];
};

const text = (data: FormData, key: string) => String(data.get(key) ?? "").trim();

export function createClientBriefDraft(
  templateId: string,
  data: FormData,
): { draft: ClientBriefDraft | null; errors: string[] } {
  const required = [
    "companyName",
    "activity",
    "description",
    "companyStory",
    "phone",
    "email",
    "city",
  ];
  const errors = required
    .filter((key) => !text(data, key))
    .map((key) => `Le champ ${key} est requis.`);
  const email = text(data, "email");
  if (email && !/^\S+@\S+\.\S+$/.test(email)) errors.push("L'adresse e-mail n'est pas valide.");
  if (errors.length) return { draft: null, errors };

  const logo = data.get("logo");
  const photos = data
    .getAll("photos")
    .filter((item): item is File => item instanceof File && item.size > 0);
  return {
    errors: [],
    draft: {
      templateId,
      companyName: text(data, "companyName"),
      tagline: text(data, "tagline"),
      activity: text(data, "activity"),
      description: text(data, "description"),
      companyStory: text(data, "companyStory"),
      phone: text(data, "phone"),
      email,
      address: text(data, "address"),
      city: text(data, "city"),
      openingHours: text(data, "openingHours"),
      services: text(data, "services")
        .split("\n")
        .map((service) => service.trim())
        .filter(Boolean),
      socialLinks: {
        facebook: text(data, "facebook"),
        instagram: text(data, "instagram"),
        google: text(data, "google"),
      },
      colors: {
        primary: text(data, "primaryColor"),
        secondary: text(data, "secondaryColor"),
      },
      logoName: logo instanceof File && logo.size > 0 ? logo.name : "",
      photoNames: photos.map((photo) => photo.name),
    },
  };
}
