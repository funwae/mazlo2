import { createClient } from '@supabase/supabase-js';

// Lazy initialization to avoid build-time errors
// Environment variables are available at runtime in Vercel, not during build
let _supabase: ReturnType<typeof createClient> | null = null;
let _supabaseAdmin: ReturnType<typeof createClient> | null = null;

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    // Allow missing vars during build, will be available at runtime in Vercel
    if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
      // During server-side production build/runtime
      return process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    }
    return 'https://placeholder.supabase.co';
  }
  return url;
}

function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    return 'placeholder-anon-key';
  }
  return key;
}

export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    if (!_supabase) {
      _supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey());
    }
    return (_supabase as any)[prop];
  }
});

export const supabaseAdmin = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    if (!_supabaseAdmin) {
      _supabaseAdmin = createClient(
        getSupabaseUrl(),
        process.env.SUPABASE_SERVICE_ROLE_KEY || getSupabaseAnonKey(),
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      );
    }
    return (_supabaseAdmin as any)[prop];
  }
});

