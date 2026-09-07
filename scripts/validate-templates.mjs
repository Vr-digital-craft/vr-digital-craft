import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

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

console.log(`Architecture valide. ${ids.length} modèle(s) enregistré(s).`);
