import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { validateSiteConfig } from "../packages/template-core/src/validation.ts";

const root = process.cwd();
const registryPath = resolve(root, "templates/registry.ts");
const coreFiles = [
  "packages/template-core/src/site-config.types.ts",
  "packages/template-core/src/validation.ts",
  "packages/template-core/src/index.ts",
  "packages/template-core/site-config.schema.json",
  "templates/README.md",
];

const missing = coreFiles.filter((file) => !existsSync(resolve(root, file)));
if (!existsSync(registryPath)) missing.push("templates/registry.ts");

if (missing.length) {
  console.error(`Architecture incomplète :\n- ${missing.join("\n- ")}`);
  process.exit(1);
}

const registry = readFileSync(registryPath, "utf8");
const ids = [...registry.matchAll(/id:\s*["'](template-[^"']+)["']/g)].map((match) => match[1]);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);

if (duplicates.length) {
  console.error(`Identifiants de modèles dupliqués : ${[...new Set(duplicates)].join(", ")}`);
  process.exit(1);
}

const templatesPath = resolve(root, "templates");
const templateFolders = readdirSync(templatesPath, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && /^template-\d+$/.test(entry.name))
  .map((entry) => entry.name);

const templateErrors = [];
for (const folder of templateFolders) {
  const required = [
    "template.meta.json",
    "site.config.json",
    "src/Template.tsx",
    "src/styles.css",
    "src/sections",
  ];
  for (const file of required) {
    if (!existsSync(resolve(templatesPath, folder, file)))
      templateErrors.push(`${folder}/${file} manque.`);
  }

  try {
    const config = JSON.parse(
      readFileSync(resolve(templatesPath, folder, "site.config.json"), "utf8"),
    );
    const result = validateSiteConfig(config);
    if (!result.success) {
      templateErrors.push(...result.errors.map((error) => `${folder}: ${error}`));
    }
  } catch (error) {
    templateErrors.push(`${folder}: configuration JSON illisible (${String(error)}).`);
  }

  try {
    const metadata = JSON.parse(
      readFileSync(resolve(templatesPath, folder, "template.meta.json"), "utf8"),
    );
    if (metadata.id !== folder)
      templateErrors.push(`${folder}: l'identifiant des métadonnées doit correspondre au dossier.`);
    if (!ids.includes(metadata.id))
      templateErrors.push(`${folder}: le modèle n'est pas déclaré dans le registre.`);
  } catch (error) {
    templateErrors.push(`${folder}: métadonnées JSON illisibles (${String(error)}).`);
  }
}

if (templateErrors.length) {
  console.error(`Validation des modèles échouée :\n- ${templateErrors.join("\n- ")}`);
  process.exit(1);
}

console.log(`Architecture valide. ${templateFolders.length} modèle(s) validé(s).`);
