// ============================================================
// RailMate Bangladesh – Authentication Helpers
// Wraps Supabase Auth for Email OTP (6-digit code, not a
// magic link) and Google OAuth.
// ============================================================

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AuthUser } from "@/types";

// ─── Session ──────────────────────────────────────────────
export async function getSession() {
  const supabase = await createClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error("[Auth] getSession error:", error.message);
    return null;
  }
  return session;
}

export async function getUser(): Promise<AuthUser | null> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) return null;

  return {
    id: user.id,
    email: user.email!,
    full_name: user.user_metadata?.full_name ?? null,
    avatar_url: user.user_metadata?.avatar_url ?? null,
    created_at: user.created_at,
  };
}

export async function requireUser(): Promise<AuthUser> {
  const user = await getUser();
  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }
  return user;
}

// ─── Email OTP ────────────────────────────────────────────
// IMPORTANT: do not pass `emailRedirectTo` here. Supplying it is what
// causes Supabase to treat this as a magic-link sign-in and send a
// clickable confirmation link instead of (or alongside) the 6-digit
// code. We want code-only.
//
// One thing this code cannot fix on its own: Supabase's default
// "Magic Link" email template still renders {{ .ConfirmationURL }}
// even without emailRedirectTo (it'll just be a dead link). To get a
// clean code-only email, edit the template in the Supabase Dashboard
// (Authentication → Email Templates → Magic Link) to show
// {{ .Token }} and remove the {{ .ConfirmationURL }} button. This is
// a one-time dashboard change, not something this repo can set.
export async function sendEmailOtp(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  });

  if (error) {
    console.error("[Auth] sendEmailOtp error:", error.message);
    throw new Error(error.message);
  }
}

// Completes the email OTP flow started by sendEmailOtp(). On success,
// the underlying Supabase client (via lib/supabase/server.ts) writes
// the session into cookies automatically — this function doesn't need
// to handle that itself, but it MUST be called from a Route Handler
// (not a Server Component) for the cookie write to actually persist.
export async function verifyEmailOtp(email: string, token: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error) {
    console.error("[Auth] verifyEmailOtp error:", error.message);
    throw new Error(error.message);
  }

  return data;
}

// ─── Google OAuth ─────────────────────────────────────────
export async function getGoogleOAuthUrl(redirectTo?: string): Promise<string> {
  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://railmatebd.com";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectTo ?? `${siteUrl}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error || !data.url) {
    console.error("[Auth] getGoogleOAuthUrl error:", error?.message);
    throw new Error(error?.message ?? "Failed to generate OAuth URL");
  }

  return data.url;
}

// ─── Sign Out ─────────────────────────────────────────────
export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("[Auth] signOut error:", error.message);
    throw new Error(error.message);
  }
}

// ─── Admin: Get User by Email ─────────────────────────────
// NOTE: `admin.auth.admin.listUsers()` paginates (default page size
// 50) — calling it once and doing `.find()` silently misses any user
// beyond the first page. Querying the `users` table directly is O(1)
// via the indexed email column and doesn't have this failure mode.
export async function adminGetUserByEmail(email: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("users")
    .select("id, email, phone, display_name, avatar_url")
    .eq("email", email)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Admin: Delete User ───────────────────────────────────
export async function adminDeleteUser(userId: string) {
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) throw new Error(error.message);
}
