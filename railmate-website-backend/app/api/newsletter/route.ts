// ============================================================
// POST /api/newsletter
// Validates email, prevents duplicates, persists subscriber,
// sends welcome email via Resend.
// ============================================================

import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { newsletterSchema } from "@/lib/validators/newsletter";
import { sendEmail } from "@/lib/email/resend";
import { newsletterWelcomeEmail } from "@/lib/email/templates";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import {
  handleApiError,
  rateLimitResponse,
  successResponse,
  validationErrorResponse,
  duplicateErrorResponse,
} from "@/lib/errors";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // ── Rate limit ───────────────────────────────────────
    const rl = await rateLimit(req, "subscribe", "newsletter");
    if (!rl.success) {
      return rateLimitResponse(rl.reset);
    }

    // ── Validate ─────────────────────────────────────────
    const body = await req.json().catch(() => ({}));
    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { email, source } = parsed.data;
    const supabase = createAdminClient();

    // ── Check for existing subscriber ────────────────────
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, status")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      if (existing.status === "active") {
        // Return 200 — don't reveal whether email exists to prevent enumeration
        return successResponse(undefined, 200);
      }

      // Re-activate unsubscribed user
      await supabase
        .from("newsletter_subscribers")
        .update({ status: "active", source, updated_at: new Date().toISOString() })
        .eq("id", existing.id);

      await sendEmail({
        to: email,
        subject: "You're back! Welcome to RailMate updates",
        html: newsletterWelcomeEmail(email),
        tags: [{ name: "type", value: "newsletter_welcome" }],
      });

      return successResponse(undefined, 200);
    }

    // ── Insert new subscriber ─────────────────────────────
    const { error: insertError } = await supabase
      .from("newsletter_subscribers")
      .insert({ email, source, status: "active" });

    if (insertError) {
      // Handle race-condition duplicate
      if (insertError.code === "23505") {
        return successResponse(undefined, 200);
      }
      throw new Error(`DB insert failed: ${insertError.message}`);
    }

    // ── Welcome email ─────────────────────────────────────
    const emailResult = await sendEmail({
      to: email,
      subject: "Welcome to RailMate updates 🚂",
      html: newsletterWelcomeEmail(email),
      tags: [{ name: "type", value: "newsletter_welcome" }],
    });

    if (!emailResult.success) {
      console.error("[Newsletter] Welcome email failed:", emailResult.error);
      // Subscriber is saved; email failure is non-fatal
    }

    return successResponse(undefined, 201);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function GET() {
  return new Response("Method Not Allowed", { status: 405 });
}
