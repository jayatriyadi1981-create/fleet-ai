import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables resolver
const getSupabaseUrl = (): string => {
  return (
    process.env.SUPABASE_URL ||
    (import.meta as any).env?.VITE_SUPABASE_URL ||
    (globalThis as any).SUPABASE_URL ||
    ''
  );
};

const getSupabaseAnonKey = (): string => {
  return (
    process.env.SUPABASE_ANON_KEY ||
    (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
    (globalThis as any).SUPABASE_ANON_KEY ||
    ''
  );
};

const getSupabaseServiceRoleKey = (): string => {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    (import.meta as any).env?.VITE_SUPABASE_SERVICE_ROLE_KEY ||
    (globalThis as any).SUPABASE_SERVICE_ROLE_KEY ||
    ''
  );
};

let supabaseClientInstance: SupabaseClient | null = null;
let supabaseAdminClientInstance: SupabaseClient | null = null;

export const isSupabaseConfigured = (): boolean => {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey() || getSupabaseServiceRoleKey();
  return Boolean(url && key && url.startsWith('http') && !url.includes('YOUR_SUPABASE'));
};

/**
 * Public / Anonymous Supabase Client (For Frontend & Realtime Subscriptions)
 */
export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabaseClientInstance) {
    const url = getSupabaseUrl();
    const anonKey = getSupabaseAnonKey() || getSupabaseServiceRoleKey();
    supabaseClientInstance = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 20,
        },
      },
    });
  }

  return supabaseClientInstance;
};

/**
 * Admin / Service Role Supabase Client (For Backend GPS Ingestion & Server Operations)
 */
export const getSupabaseAdminClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabaseAdminClientInstance) {
    const url = getSupabaseUrl();
    const serviceKey = getSupabaseServiceRoleKey() || getSupabaseAnonKey();
    supabaseAdminClientInstance = createClient(url, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return supabaseAdminClientInstance;
};
