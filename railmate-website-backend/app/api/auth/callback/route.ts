// ============================================================
// GET /api/auth/callback
// Handles the Google OAuth redirect and exchanges the code for
// a session. Email sign-in no longer uses this route — it goes
// through send-otp → verify-otp (6-digit code), not a link.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // ── Handle OAuth errors from provider ────────────────────
  if (error) {
    console.error("[AuthCallback] OAuth error:", error, errorDescription);
    const redirectUrl = new URL("/auth/error", origin);
    redirectUrl.searchParams.set("error", error);
    return NextResponse.redirect(redirectUrl);
  }

  if (!code) {
    console.error("[AuthCallback] Missing code parameter");
    return NextResponse.redirect(new URL("/auth/error?error=missing_code", origin));
  }

  const supabase = await createClient();
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error("[AuthCallback] Code exchange failed:", exchangeError.message);
    const redirectUrl = new URL("/auth/error", origin);
    redirectUrl.searchParams.set("error", "session_error");
    return NextResponse.redirect(redirectUrl);
  }

  // ── Redirect to intended destination ─────────────────────
  // Validate 'next' is a relative path to prevent open-redirect attacks
  const safeNext = next.startsWith("/") ? next : "/";
  return NextResponse.redirect(new URL(safeNext, origin));
}
