// ============================================================
// POST /api/auth/send-otp
// Sends a magic-link / OTP email via Supabase Auth.
// ============================================================

import { NextRequest } from "next/server";
import { z } from "zod";
import { sendEmailOtp } from "@/lib/auth/helpers";
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
  redirectTo: z.string().url("redirectTo must be a valid URL.").optional(),
});

export async function POST(req: NextRequest) {
  try {
    // ── Rate limit ───────────────────────────────────────
    const rl = await rateLimit(req, "authOtp", "auth-otp");
    if (!rl.success) {
      return rateLimitResponse(rl.reset);
    }

    // ── Validate ─────────────────────────────────────────
    const body = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { email, redirectTo } = parsed.data;

    await sendEmailOtp(email, redirectTo);

    return successResponse(undefined, 200);
  } catch (err) {
    if (err instanceof Error && err.message.includes("rate limit")) {
      return errorResponse(
        "Too many sign-in attempts. Please wait a few minutes.",
        429,
        ErrorCode.RATE_LIMIT_EXCEEDED
      );
    }
    return handleApiError(err);
  }
}

export async function GET() {
  return new Response("Method Not Allowed", { status: 405 });
}
