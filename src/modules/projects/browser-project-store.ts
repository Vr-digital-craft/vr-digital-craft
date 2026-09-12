import type { GeneratedProject, ProjectAssets } from "./generated-project";

const databaseName = "vr-digital-projects";
const databaseVersion = 1;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, databaseVersion);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains("projects"))
        database.createObjectStore("projects", { keyPath: "id" });
      if (!database.objectStoreNames.contains("assets"))
        database.createObjectStore("assets", { keyPath: "projectId" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("Impossible d'ouvrir le stockage local."));
  });
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Le stockage local a échoué."));
  });
}

export async function saveLocalProject(project: GeneratedProject, assets: ProjectAssets) {
  const database = await openDatabase();
  const transaction = database.transaction(["projects", "assets"], "readwrite");
  transaction.objectStore("projects").put(project);
  transaction.objectStore("assets").put({ projectId: project.id, ...assets });
  await new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () =>
      reject(transaction.error ?? new Error("L'enregistrement local a échoué."));
  });
  database.close();
}

export async function getLocalProject(projectId: string) {
  const database = await openDatabase();
  const transaction = database.transaction(["projects", "assets"], "readonly");
  const project = await requestResult<GeneratedProject | undefined>(
    transaction.objectStore("projects").get(projectId),
  );
  const storedAssets = await requestResult<(ProjectAssets & { projectId: string }) | undefined>(
    transaction.objectStore("assets").get(projectId),
  );
  database.close();
  return project ? { project, assets: storedAssets ?? { logo: null, photos: [] } } : null;
}

export async function getAllLocalProjects(): Promise<GeneratedProject[]> {
  const database = await openDatabase();
  const transaction = database.transaction("projects", "readonly");
  const projects = await requestResult<GeneratedProject[]>(
    transaction.objectStore("projects").getAll(),
  );
  database.close();
  return projects.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function updateLocalProject(project: GeneratedProject) {
  const database = await openDatabase();
  const transaction = database.transaction("projects", "readwrite");
  transaction.objectStore("projects").put({
    ...project,
    updatedAt: new Date().toISOString(),
  });
  await new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () =>
      reject(transaction.error ?? new Error("La mise à jour locale a échoué."));
  });
  database.close();
}

export async function deleteLocalProject(projectId: string) {
  const database = await openDatabase();
  const transaction = database.transaction(["projects", "assets"], "readwrite");
  transaction.objectStore("projects").delete(projectId);
  transaction.objectStore("assets").delete(projectId);
  await new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () =>
      reject(transaction.error ?? new Error("La suppression du projet a échoué."));
  });
  database.close();
}
