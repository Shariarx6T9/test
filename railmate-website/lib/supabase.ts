/**
 * RailMate Bangladesh — Supabase read client (website)
 *
 * This is a lightweight, read-only client that points at the same
 * Supabase project as the mobile app. The anon key is public and safe
 * to use here because the train/station tables have public-read RLS.
 *
 * Only import this in Server Components or server-side lib files.
 * Never import in Client Components — no user auth happens on the website.
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnon) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY env vars'
  )
}

// Single instance — Next.js module cache means this is safe at module level.
export const supabase = createClient(supabaseUrl, supabaseAnon, {
  auth: { persistSession: false }, // no auth on website
})
