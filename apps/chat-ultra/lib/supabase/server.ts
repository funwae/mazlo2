import { createClient } from '@supabase/supabase-js';

/**
 * Create a Supabase client for server-side operations
 * Uses service role key if available, otherwise falls back to anon key
 */
export function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

