/**
 * Client-side hook to get current authenticated user
 * Returns the Convex user ID after syncing with Supabase user
 */

"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export function useCurrentUser(): {
  userId: Id<"users"> | null;
  isLoading: boolean;
  email: string | null;
} {
  const [supabaseUserId, setSupabaseUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get or create Convex user
  const getOrCreateUser = useMutation(api.users.getOrCreateFromSupabase);
  const convexUser = useQuery(
    api.users.getByExternalId,
    supabaseUserId ? { externalId: supabaseUserId } : "skip"
  );

  useEffect(() => {
    const supabase = createClientComponentClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setSupabaseUserId(user.id);
        setEmail(user.email || null);
        // Trigger getOrCreateUser mutation
        getOrCreateUser({
          externalId: user.id,
          email: user.email || "",
          displayName: user.email?.split("@")[0] || "User",
        }).catch((err) => {
          console.error("Failed to get/create user:", err);
        });
      } else {
        setSupabaseUserId(null);
        setEmail(null);
      }
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSupabaseUserId(session.user.id);
        setEmail(session.user.email || null);
        getOrCreateUser({
          externalId: session.user.id,
          email: session.user.email || "",
          displayName: session.user.email?.split("@")[0] || "User",
        }).catch((err) => {
          console.error("Failed to get/create user:", err);
        });
      } else {
        setSupabaseUserId(null);
        setEmail(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [getOrCreateUser]);

  return {
    userId: convexUser?._id || null,
    isLoading: isLoading || (supabaseUserId !== null && convexUser === undefined),
    email,
  };
}

