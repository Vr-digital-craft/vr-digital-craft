# VR Digital Craft

Site vitrine indépendant de VR Studio, construit avec TanStack Start, React, Vite, Tailwind CSS et Supabase.

## Installation

Prérequis : Node.js 22+, pnpm 10+ et un projet Supabase configuré.

```bash
pnpm install
cp .env.example .env
pnpm dev
```

## Production

```bash
pnpm build
pnpm start
```

Renseignez les variables documentées dans `.env.example` chez votre hébergeur. Le serveur de production est généré dans `.output`.

Avant la mise en ligne, remplacez le domaine `https://vrstudio.fr` dans `public/sitemap.xml` si votre domaine final est différent.
