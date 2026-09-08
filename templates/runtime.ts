import type { ComponentType } from "react";
import type { SiteConfig } from "../packages/template-core/src";
import artisanConfig from "./template-01/site.config.json";
import { ArtisanTemplate } from "./template-01/src/Template";
import restaurantConfig from "./template-02/site.config.json";
import { RestaurantTemplate } from "./template-02/src/Template";
import garageConfig from "./template-03/site.config.json";
import { GarageTemplate } from "./template-03/src/Template";
import beautyConfig from "./template-04/site.config.json";
import { BeautyTemplate } from "./template-04/src/Template";
import commerceConfig from "./template-05/site.config.json";
import { CommerceTemplate } from "./template-05/src/Template";
import realEstateConfig from "./template-06/site.config.json";
import { RealEstateTemplate } from "./template-06/src/Template";
import corporateConfig from "./template-07/site.config.json";
import { CorporateTemplate } from "./template-07/src/Template";
import premiumConfig from "./template-08/site.config.json";
import { PremiumDarkTemplate } from "./template-08/src/Template";

export type RuntimeTemplate = {
  name: string;
  config: SiteConfig;
  Component: ComponentType<{ config: SiteConfig }>;
};

export const runtimeTemplates: Record<string, RuntimeTemplate> = {
  "template-01": {
    name: "Artisan moderne",
    config: artisanConfig as SiteConfig,
    Component: ArtisanTemplate,
  },
  "template-02": {
    name: "Restaurant chaleureux",
    config: restaurantConfig as SiteConfig,
    Component: RestaurantTemplate,
  },
  "template-03": {
    name: "Garage automobile",
    config: garageConfig as SiteConfig,
    Component: GarageTemplate,
  },
  "template-04": {
    name: "Beauté & bien-être",
    config: beautyConfig as SiteConfig,
    Component: BeautyTemplate,
  },
  "template-05": {
    name: "Commerce local",
    config: commerceConfig as SiteConfig,
    Component: CommerceTemplate,
  },
  "template-06": {
    name: "Immobilier premium",
    config: realEstateConfig as SiteConfig,
    Component: RealEstateTemplate,
  },
  "template-07": {
    name: "Entreprise corporate",
    config: corporateConfig as SiteConfig,
    Component: CorporateTemplate,
  },
  "template-08": {
    name: "Premium dark",
    config: premiumConfig as SiteConfig,
    Component: PremiumDarkTemplate,
  },
};
