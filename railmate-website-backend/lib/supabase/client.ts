// ============================================================
// RailMate Bangladesh – Supabase Browser Client
// Uses ANON key only. Safe to call from Client Components.
// ============================================================

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
