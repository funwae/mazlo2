/**
 * Client-side hook to get current authenticated user
 * Returns the user ID after syncing with Supabase user
 */

"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export function useCurrentUser(): {
  userId: string | null;
  isLoading: boolean;
  email: string | null;
} {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClientComponentClient();

    // Initial fetch
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        setEmail(user.email || null);
        // Ensure user exists in database
        fetch('/api/auth/sync-user', { method: 'POST' }).catch(() => {
          // Silently fail - user will be created on first API call
        });
      } else {
        setUserId(null);
        setEmail(null);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        setEmail(session.user.email || null);
        // Ensure user exists in database
        fetch('/api/auth/sync-user', { method: 'POST' }).catch(() => {
          // Silently fail - user will be created on first API call
        });
      } else {
        setUserId(null);
        setEmail(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    userId,
    isLoading,
    email,
  };
}

