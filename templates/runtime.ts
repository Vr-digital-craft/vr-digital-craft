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
};
