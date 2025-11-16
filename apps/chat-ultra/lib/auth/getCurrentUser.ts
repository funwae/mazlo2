/**
 * Get current authenticated user from Supabase session
 * Returns the user ID after syncing with Supabase user
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getOrCreateUser } from "../db/users";

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

    // Get or create user in database
    const dbUser = await getOrCreateUser(supabaseUser.id, supabaseUser.email || "");

    return {
      id: dbUser.id,
      email: supabaseUser.email || "",
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Get current user ID from Supabase session
 * Returns null if not authenticated
 */
export async function getCurrentUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.id || null;
}

