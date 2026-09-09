import { useSession } from "@tanstack/react-start/server";

type AdminSession = { authenticated?: boolean };

export async function requireAdminSession() {
  const password = process.env["ADMIN_SESSION_SECRET"];
  if (!password || password.length < 32) {
    throw new Error("La protection de l'administration n'est pas configurée.");
  }

  // TanStack exposes this request-scoped server session helper with a hook-like name.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const session = await useSession<AdminSession>({
    name: "vr-digital-admin",
    password,
    maxAge: 60 * 60 * 8,
    cookie: {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env["NODE_ENV"] === "production",
      path: "/",
    },
  });

  if (session.data.authenticated !== true) {
    throw new Error(
      "Votre session d'administration a expiré. Reconnectez-vous pour utiliser l'IA.",
    );
  }
}
