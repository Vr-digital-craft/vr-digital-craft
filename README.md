# VR Digital Craft

Site vitrine indépendant de VR Digital, construit avec TanStack Start, React, Vite et Tailwind CSS.

## Installation

Prérequis : Node.js 22+ et pnpm 10+.

```bash
pnpm install
pnpm dev
```

## Production

```bash
pnpm build
```

Le déploiement Netlify est configuré dans `netlify.toml` :

- commande de construction : `pnpm run build` ;
- dossier publié : `dist/client` ;
- fonctions serveur générées automatiquement par le plugin Netlify pour TanStack Start.

Un envoi sur la branche principale déclenche le déploiement continu lorsque le dépôt GitHub est relié à Netlify. Les réglages saisis manuellement dans l'interface Netlify doivent reprendre les mêmes valeurs.

L'administration actuelle conserve les projets dans le navigateur utilisé. Elle ne constitue pas encore un espace multi-appareils : le stockage distant et l'authentification seront ajoutés séparément avant d'y conserver des données clients en production.

Tous les contenus publics sont conservés dans `src/content/site-content.ts` et peuvent être modifiés directement dans le code.

Avant la mise en ligne, remplacez le domaine `https://vrdigital.fr` dans `public/sitemap.xml` si votre domaine final est différent.
