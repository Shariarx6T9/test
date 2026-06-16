// ============================================================
// RailMate Bangladesh – Supabase Admin Client
//
// ⚠️  Uses SERVICE ROLE KEY – bypasses RLS.
// ⚠️  MUST NEVER be imported in client-side code.
// ⚠️  Only import in API Route Handlers and Server Actions.
// ============================================================

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types";

let _adminClient: ReturnType<typeof createClient<Database>> | undefined;

export function createAdminClient() {
  if (_adminClient) return _adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
        "These must be set as server-side environment variables."
    );
  }

  _adminClient = createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  return _adminClient;
}
