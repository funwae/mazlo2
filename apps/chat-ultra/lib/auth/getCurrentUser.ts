/**
 * Get current authenticated user from Supabase session
 * Returns the user ID after syncing with Supabase user
 *
 * In development mode with DEV_BYPASS_AUTH=true, returns a demo user
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getOrCreateUser } from "../db/users";

const DEV_BYPASS_AUTH = process.env.DEV_BYPASS_AUTH === 'true';
const DEMO_USER_ID = process.env.DEMO_USER_ID || '00000000-0000-0000-0000-000000000001';
const DEMO_USER_EMAIL = process.env.DEMO_USER_EMAIL || 'demo@glyphd.com';

export async function getCurrentUser(): Promise<{ id: string; email: string; isDemo?: boolean } | null> {
  try {
    // DEV BYPASS: In development mode, always return the demo user
    if (DEV_BYPASS_AUTH) {
      console.log('[DEV AUTH BYPASS] Using demo user:', DEMO_USER_ID);

      // Ensure demo user exists in database
      await getOrCreateUser(DEMO_USER_ID, DEMO_USER_EMAIL);

      return {
        id: DEMO_USER_ID,
        email: DEMO_USER_EMAIL,
        isDemo: true,
      };
    }

    // PRODUCTION: Use real Supabase auth
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
      isDemo: false,
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

