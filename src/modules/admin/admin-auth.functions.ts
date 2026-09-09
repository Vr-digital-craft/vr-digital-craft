import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";

type AdminSession = { authenticated?: boolean; role?: "admin" };

function getSessionConfig() {
  const password = process.env["ADMIN_SESSION_SECRET"];
  if (!password || password.length < 32) {
    throw new Error("La protection de l'administration n'est pas configurée.");
  }

  return {
    name: "vr-digital-admin",
    password,
    maxAge: 60 * 60 * 8,
    cookie: {
      httpOnly: true,
      sameSite: "strict" as const,
      secure: process.env["NODE_ENV"] === "production",
      path: "/",
    },
  };
}

async function matchesPassword(candidate: string, expected: string) {
  const encoder = new TextEncoder();
  const [candidateHash, expectedHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(candidate)),
    crypto.subtle.digest("SHA-256", encoder.encode(expected)),
  ]);
  const candidateBytes = new Uint8Array(candidateHash);
  const expectedBytes = new Uint8Array(expectedHash);
  let difference = candidateBytes.length ^ expectedBytes.length;

  for (let index = 0; index < candidateBytes.length; index += 1) {
    difference |= candidateBytes[index]! ^ expectedBytes[index]!;
  }

  return difference === 0;
}

export const getAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const session = await useSession<AdminSession>(getSessionConfig());
    const authenticated = session.data.authenticated === true;
    if (authenticated && session.data.role !== "admin") {
      await session.update({ ...session.data, role: "admin" });
    }
    return { authenticated, role: authenticated ? ("admin" as const) : null, configured: true };
  } catch {
    return { authenticated: false, role: null, configured: false };
  }
});

export const loginAdmin = createServerFn({ method: "POST" })
  .validator((value: unknown) => {
    if (!value || typeof value !== "object" || !("password" in value)) {
      throw new Error("Mot de passe invalide.");
    }
    return { password: String(value.password) };
  })
  .handler(async ({ data }) => {
    const expectedPassword = process.env["ADMIN_PASSWORD"];
    if (!expectedPassword) {
      return { success: false, error: "La protection n'est pas encore configurée." };
    }
    if (!(await matchesPassword(data.password, expectedPassword))) {
      return { success: false, error: "Mot de passe incorrect." };
    }

    const session = await useSession<AdminSession>(getSessionConfig());
    await session.update({ authenticated: true, role: "admin" });
    return { success: true, error: "" };
  });

export const logoutAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(getSessionConfig());
  await session.clear();
  return { success: true };
});
