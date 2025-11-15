/**
 * Get current authenticated user from Supabase session
 * Returns the Convex user ID after syncing with Supabase user
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import { getOrCreateUser } from "../db/users";

const convexClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function getCurrentUser(): Promise<{ id: string; email: string } | null> {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser();

    if (!supabaseUser) {
      return null;
    }

    // Get or create Convex user
    const convexUser = await getOrCreateUser(supabaseUser.id, supabaseUser.email || "");

    return {
      id: convexUser.id,
      email: supabaseUser.email || "",
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Get current user ID (Convex ID) from Supabase session
 * Returns null if not authenticated
 */
export async function getCurrentUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.id || null;
}

