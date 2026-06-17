// ============================================================
// POST /api/auth/verify-otp
// Verifies the 6-digit code sent by /api/auth/send-otp and
// establishes a session (cookies are set automatically by the
// Supabase server client inside verifyEmailOtp).
// ============================================================

import { NextRequest } from "next/server";
import { z } from "zod";
import { verifyEmailOtp } from "@/lib/auth/helpers";
import { rateLimit } from "@/lib/rate-limit";
import {
  handleApiError,
  rateLimitResponse,
  successResponse,
  validationErrorResponse,
  errorResponse,
  ErrorCode,
} from "@/lib/errors";

export const runtime = "nodejs";

const schema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address."),
  token: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Code must be exactly 6 digits."),
});

export async function POST(req: NextRequest) {
  try {
    // ── Validate first so a malformed request doesn't consume a
    //    rate-limit attempt before we even know the email ──────
    const body = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { email, token } = parsed.data;

    // ── Rate limit, keyed by email — this is the brute-force guard
    //    on a 6-digit (1-in-a-million) code. Supabase also expires
    //    and invalidates the code server-side; this is defense in
    //    depth, not the only protection. ───────────────────────
    const rl = await rateLimit(req, "authOtpVerify", `auth-otp-verify:${email}`);
    if (!rl.success) {
      return rateLimitResponse(rl.reset);
    }

    const data = await verifyEmailOtp(email, token);

    return successResponse(
      {
        user: data.user
          ? { id: data.user.id, email: data.user.email }
          : null,
      },
      200
    );
  } catch (err) {
    if (err instanceof Error) {
      // Supabase returns messages like "Token has expired or is
      // invalid" / "Invalid token" — surface these as 401, not 500.
      const msg = err.message.toLowerCase();
      if (msg.includes("expired") || msg.includes("invalid") || msg.includes("token")) {
        return errorResponse(
          "That code is incorrect or has expired. Request a new one.",
          401,
          ErrorCode.UNAUTHORIZED
        );
      }
    }
    return handleApiError(err);
  }
}

export async function GET() {
  return new Response("Method Not Allowed", { status: 405 });
}
