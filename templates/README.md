# Modèles VR Digital

Ce dossier contiendra les modèles de sites vitrines. L'étape 1 définit uniquement leur contrat commun ; le premier modèle sera créé à l'étape 2.

## Structure obligatoire

Chaque modèle devra respecter cette structure :

```text
template-01/
├── template.meta.json
├── site.config.json
├── preview.webp
├── public/
└── src/
    ├── Template.tsx
    ├── sections/
    └── styles.css
```

## Règles

- `Template.tsx` reçoit un objet `SiteConfig` et ne contient aucune donnée client en dur.
- `site.config.json` est l'unique source des textes, coordonnées, services, couleurs, images, liens et informations SEO.
- Un modèle ne contacte ni base de données, ni service d'IA, ni fournisseur de déploiement.
- Les ressources utilisent des chemins relatifs vers le dossier `public/` du projet client.
- Une section facultative doit être pilotée par une propriété `enabled` de la configuration.
- Toute nouvelle configuration doit conserver `schemaVersion: 1` et passer `pnpm validate:templates`.
- Une nouvelle version d'un modèle ne doit jamais modifier silencieusement un site client déjà généré.
- Les dix modèles devront différer par leur structure, leur rythme visuel et leur composition, pas uniquement par leurs couleurs.

## Registre

Chaque modèle valide devra être ajouté à `templates/registry.ts`. Ce registre alimentera plus tard la page `/modeles`, les filtres, les démonstrations et le générateur.
