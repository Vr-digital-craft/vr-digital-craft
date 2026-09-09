import type { SiteConfig } from "../../../packages/template-core/src";
import type { GeneratedProject, ProjectAssets } from "./generated-project";

const templateSources = import.meta.glob("/templates/template-*/src/**/*.{ts,tsx,css}", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const coreSources = import.meta.glob("/packages/template-core/src/*.ts", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

type ExportFile = { path: string; data: Uint8Array };
const encoder = new TextEncoder();

function textFile(path: string, content: string): ExportFile {
  return { path, data: encoder.encode(content) };
}

function safeFileName(file: File, fallback: string) {
  const extension = file.name.match(/\.[a-z0-9]+$/i)?.[0] ?? "";
  return `${fallback}${extension.toLowerCase()}`;
}

function prepareConfig(project: GeneratedProject, assets: ProjectAssets) {
  const config = structuredClone(project.config);
  const exportedAssets: { file: File; path: string }[] = [];

  if (assets.logo) {
    const name = safeFileName(assets.logo, "logo");
    config.branding.logo = { src: `/assets/${name}`, alt: `Logo ${config.business.name}` };
    exportedAssets.push({ file: assets.logo, path: `public/assets/${name}` });
  }

  const photos = assets.photos.map((file, index) => {
    const name = safeFileName(file, `photo-${index + 1}`);
    exportedAssets.push({ file, path: `public/assets/${name}` });
    return `/assets/${name}`;
  });
  if (photos[0])
    config.content.hero.image = {
      src: photos[0],
      alt: `${config.business.activity} — ${config.business.name}`,
    };
  if (photos[1] || photos[0])
    config.content.about.image = {
      src: photos[1] ?? photos[0]!,
      alt: `${config.business.name} à ${config.business.city}`,
    };
  if (photos.length) {
    config.content.gallery.images = photos.map((src, index) => ({
      src,
      alt: `${config.business.name} — réalisation ${index + 1}`,
    }));
    config.content.services.items = config.content.services.items.map((service, index) =>
      photos[index + 1]
        ? {
            ...service,
            image: {
              src: photos[index + 1]!,
              alt: `${service.title} — ${config.business.name}`,
            },
          }
        : service,
    );
  }
  return { config, exportedAssets };
}

function collectImageSources(value: unknown, result = new Set<string>()) {
  if (typeof value === "string" && value.startsWith("/")) result.add(value);
  else if (Array.isArray(value)) value.forEach((item) => collectImageSources(item, result));
  else if (value && typeof value === "object")
    Object.values(value).forEach((item) => collectImageSources(item, result));
  return result;
}

async function fetchPublicAssets(config: SiteConfig) {
  const files: ExportFile[] = [];
  await Promise.all(
    [...collectImageSources(config)].map(async (source) => {
      const response = await fetch(source);
      if (!response.ok) return;
      files.push({ path: `public${source}`, data: new Uint8Array(await response.arrayBuffer()) });
    }),
  );
  return files;
}

function crc32(data: Uint8Array) {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function zip(files: ExportFile[]) {
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const name = encoder.encode(file.path);
    const checksum = crc32(file.data);
    const local = new Uint8Array(30 + name.length);
    const localView = new DataView(local.buffer);
    localView.setUint32(0, 0x04034b50, true);
    localView.setUint16(4, 20, true);
    localView.setUint16(6, 0x0800, true);
    localView.setUint32(14, checksum, true);
    localView.setUint32(18, file.data.length, true);
    localView.setUint32(22, file.data.length, true);
    localView.setUint16(26, name.length, true);
    local.set(name, 30);
    localParts.push(local, file.data);

    const central = new Uint8Array(46 + name.length);
    const centralView = new DataView(central.buffer);
    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint16(8, 0x0800, true);
    centralView.setUint32(16, checksum, true);
    centralView.setUint32(20, file.data.length, true);
    centralView.setUint32(24, file.data.length, true);
    centralView.setUint16(28, name.length, true);
    centralView.setUint32(42, offset, true);
    central.set(name, 46);
    centralParts.push(central);
    offset += local.length + file.data.length;
  }

  const centralSize = centralParts.reduce((total, part) => total + part.length, 0);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(8, files.length, true);
  endView.setUint16(10, files.length, true);
  endView.setUint32(12, centralSize, true);
  endView.setUint32(16, offset, true);
  const parts = [...localParts, ...centralParts, end];
  const output = new Uint8Array(parts.reduce((total, part) => total + part.length, 0));
  let cursor = 0;
  for (const part of parts) {
    output.set(part, cursor);
    cursor += part.length;
  }
  return new Blob([output.buffer], { type: "application/zip" });
}

export async function exportProjectPackage(project: GeneratedProject, assets: ProjectAssets) {
  const { config, exportedAssets } = prepareConfig(project, assets);
  const templatePrefix = `/templates/${project.templateId}/`;
  const sourceFiles = Object.entries(templateSources)
    .filter(([path]) => path.startsWith(`${templatePrefix}src/`))
    .map(([path, content]) => textFile(path.slice(1), content));
  const sharedFiles = Object.entries(coreSources).map(([path, content]) =>
    textFile(path.slice(1), content),
  );
  const binaryAssets = await Promise.all(
    exportedAssets.map(async ({ file, path }) => ({
      path,
      data: new Uint8Array(await file.arrayBuffer()),
    })),
  );
  const publicAssets = await fetchPublicAssets(config);
  const componentName =
    sourceFiles.find((file) => file.path.endsWith("/Template.tsx"))?.data.length &&
    runtimeComponentNames[project.templateId];
  if (!componentName || !sourceFiles.length) throw new Error("Le code du modèle est introuvable.");

  const files: ExportFile[] = [
    textFile(
      "package.json",
      JSON.stringify(
        {
          name: project.slug,
          private: true,
          version: "1.0.0",
          type: "module",
          scripts: { dev: "vite", build: "vite build", preview: "vite preview" },
          dependencies: {
            "@vitejs/plugin-react": "^5.2.0",
            "lucide-react": "^0.575.0",
            react: "^19.2.0",
            "react-dom": "^19.2.0",
            typescript: "^5.8.3",
            vite: "^8.2.0",
          },
          devDependencies: {},
        },
        null,
        2,
      ),
    ),
    textFile(
      "index.html",
      `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${config.seo.description.replaceAll('"', "&quot;")}"><link rel="icon" href="${config.branding.favicon}"><title>${config.seo.title}</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>`,
    ),
    textFile(
      "src/main.tsx",
      `import React from "react";\nimport { createRoot } from "react-dom/client";\nimport config from "../site.config.json";\nimport { ${componentName} } from "../templates/${project.templateId}/src/Template";\nimport type { SiteConfig } from "../packages/template-core/src";\nimport "./reset.css";\ncreateRoot(document.getElementById("root")!).render(<${componentName} config={config as SiteConfig} />);\n`,
    ),
    textFile(
      "src/reset.css",
      "html{scroll-behavior:smooth}body{margin:0}button,input,select,textarea{font:inherit}img{max-width:100%}",
    ),
    textFile("site.config.json", JSON.stringify(config, null, 2)),
    textFile(
      "README.md",
      `# ${config.business.name}\n\nSite généré par VR Digital à partir de ${project.templateId}.\n\n## Vérifier le site\n\n1. Installer Node.js.\n2. Lancer \`npm install\`.\n3. Lancer \`npm run dev\`.\n4. Pour préparer la version finale, lancer \`npm run build\`.\n\nLe dossier \`dist\` obtenu peut ensuite être hébergé. Aucun déploiement automatique n'est inclus.\n`,
    ),
    ...sourceFiles,
    ...sharedFiles,
    ...publicAssets,
    ...binaryAssets,
  ];
  const uniqueFiles = [...new Map(files.map((file) => [file.path, file])).values()];
  const blob = zip(uniqueFiles);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${project.slug}-site.zip`;
  link.click();
  URL.revokeObjectURL(url);
}

const runtimeComponentNames: Record<string, string> = {
  "template-01": "ArtisanTemplate",
  "template-02": "RestaurantTemplate",
  "template-03": "GarageTemplate",
  "template-04": "BeautyTemplate",
  "template-05": "CommerceTemplate",
  "template-06": "RealEstateTemplate",
  "template-07": "CorporateTemplate",
  "template-08": "PremiumDarkTemplate",
  "template-09": "ProfessionalTemplate",
  "template-10": "OnePageTemplate",
};
