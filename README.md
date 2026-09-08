# VR Digital Craft

Site vitrine indépendant de VR Digital, construit avec TanStack Start, React, Vite et Tailwind CSS.

## Installation

Prérequis : Node.js 22+ et pnpm 10+.

```bash
pnpm install
pnpm dev
```

## Production et hébergement Cloudflare

```bash
pnpm build
```

Le projet est préparé pour Cloudflare Workers avec l'offre gratuite. Cette cible est adaptée au rendu serveur utilisé par TanStack Start ; il ne faut pas configurer le projet comme un simple site statique Cloudflare Pages.

Première connexion au compte Cloudflare :

```bash
pnpm wrangler login
```

Vérification locale du résultat Cloudflare :

```bash
pnpm build
pnpm preview
```

Mise en ligne manuelle :

```bash
pnpm deploy:cloudflare
```

Le fichier `wrangler.jsonc` contient la configuration de déploiement. Cloudflare attribuera d'abord une adresse gratuite en `workers.dev`. Le nom de domaine définitif pourra ensuite être ajouté depuis **Workers & Pages → vr-digital → Settings → Domains & Routes**.

Pour un déploiement automatique depuis GitHub, créer une application Workers dans Cloudflare, connecter le dépôt `Vr-digital-craft/vr-digital-craft`, choisir la branche `main` et conserver la commande de construction `pnpm build`. Ne désactivez le site Netlify qu'après avoir vérifié l'adresse Cloudflare et le formulaire de contact.

L'administration actuelle conserve les projets dans le navigateur utilisé. Elle ne constitue pas encore un espace multi-appareils : le stockage distant et l'authentification seront ajoutés séparément avant d'y conserver des données clients en production.

Tous les contenus publics sont conservés dans `src/content/site-content.ts` et peuvent être modifiés directement dans le code.

Avant la mise en ligne, remplacez le domaine `https://vrdigital.fr` dans `public/sitemap.xml` si votre domaine final est différent.
