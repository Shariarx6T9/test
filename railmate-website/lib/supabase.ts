/**
 * Supabase read-only client for the website.
 * Points at the same project as the mobile app (train/station data).
 * Safe to use with anon key — train tables have public-read RLS.
 *
 * Lazy initialisation: the client is created on first use, not at module
 * load. This prevents a crash at build/startup when env vars are absent
 * (e.g. during a cold Vercel preview build without secrets configured).
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (_client) return _client

  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anon) {
    throw new Error(
      '[RailMate] Supabase env vars not set.\n' +
      'Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY ' +
      'to your Vercel project environment variables.'
    )
  }

  _client = createClient(url, anon, { auth: { persistSession: false } })
  return _client
}

// Convenience re-export so existing callers don't break
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabaseClient() as any)[prop]
  },
})
