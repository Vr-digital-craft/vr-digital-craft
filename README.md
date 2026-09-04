# VR Digital Craft

Site vitrine indépendant de VR Studio, construit avec TanStack Start, React, Vite et Tailwind CSS.

## Installation

Prérequis : Node.js 22+ et pnpm 10+.

```bash
pnpm install
pnpm dev
```

## Production

```bash
pnpm build
pnpm start
```

Le serveur de production est généré dans `.output`. Tous les contenus publics sont conservés dans `src/content/site-content.ts` et peuvent être modifiés directement dans le code.

Avant la mise en ligne, remplacez le domaine `https://vrstudio.fr` dans `public/sitemap.xml` si votre domaine final est différent.
