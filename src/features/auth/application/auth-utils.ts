import { auth } from "@/features/auth/infrastructure/better-auth";
import { headers } from "next/headers";

/**
 * Retrieves the current user's session on the server.
 * Returns null if not authenticated.
 */
export async function getServerSession() {
  try {
    return await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error("Failed to retrieve server session:", error);
    return null;
  }
}
