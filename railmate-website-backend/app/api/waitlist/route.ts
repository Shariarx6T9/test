// ============================================================
// POST /api/waitlist
// Joins waitlist with deduplication, sends confirmation email.
// ============================================================

import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { waitlistSchema } from "@/lib/validators/waitlist";
import { sendEmail } from "@/lib/email/resend";
import { waitlistConfirmationEmail } from "@/lib/email/templates";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import {
  handleApiError,
  rateLimitResponse,
  successResponse,
  validationErrorResponse,
} from "@/lib/errors";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // ── Rate limit ───────────────────────────────────────
    const rl = await rateLimit(req, "subscribe", "waitlist");
    if (!rl.success) {
      return rateLimitResponse(rl.reset);
    }

    // ── Validate ─────────────────────────────────────────
    const body = await req.json().catch(() => ({}));
    const parsed = waitlistSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { email, name, source_page, metadata } = parsed.data;
    const supabase = createAdminClient();

    // ── Deduplication ────────────────────────────────────
    const { data: existing } = await supabase
      .from("waitlist_entries")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      // Silent success — do not reveal whether email is on waitlist
      return successResponse(undefined, 200);
    }

    // ── Insert ───────────────────────────────────────────
    const { error: insertError } = await supabase
      .from("waitlist_entries")
      .insert({
        email,
        name,
        source_page: source_page ?? null,
        metadata: metadata ?? null,
      });

    if (insertError) {
      if (insertError.code === "23505") {
        return successResponse(undefined, 200);
      }
      throw new Error(`DB insert failed: ${insertError.message}`);
    }

    // ── Confirmation email ────────────────────────────────
    const emailResult = await sendEmail({
      to: email,
      subject: "You're on the RailMate waitlist! 🚂",
      html: waitlistConfirmationEmail(name),
      tags: [{ name: "type", value: "waitlist_confirmation" }],
    });

    if (!emailResult.success) {
      console.error("[Waitlist] Confirmation email failed:", emailResult.error);
    }

    return successResponse(undefined, 201);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function GET() {
  return new Response("Method Not Allowed", { status: 405 });
}
