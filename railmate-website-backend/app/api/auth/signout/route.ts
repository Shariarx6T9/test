// ============================================================
// POST /api/auth/signout
// Clears the Supabase session cookie and redirects to home.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { handleApiError, successResponse } from "@/lib/errors";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("[Signout] Error:", error.message);
    }

    return successResponse(undefined, 200);
  } catch (err) {
    return handleApiError(err);
  }
}

// Support GET for anchor-based signout links
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();

    const { origin } = new URL(req.url);
    return NextResponse.redirect(new URL("/", origin));
  } catch (err) {
    return handleApiError(err);
  }
}
