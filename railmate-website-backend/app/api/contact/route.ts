// ============================================================
// POST /api/contact
// Validates input, rate-limits by IP, persists to Supabase,
// sends admin notification + user confirmation via Resend.
// ============================================================

import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { contactSchema } from "@/lib/validators/contact";
import { sendEmail } from "@/lib/email/resend";
import {
  contactAdminEmail,
  contactConfirmationEmail,
} from "@/lib/email/templates";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import {
  handleApiError,
  rateLimitResponse,
  successResponse,
  validationErrorResponse,
} from "@/lib/errors";
import { env } from "@/lib/env";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // ── Rate limit ───────────────────────────────────────
    const rl = await rateLimit(req, "form", "contact");
    if (!rl.success) {
      return rateLimitResponse(rl.reset);
    }

    // ── Parse & validate body ────────────────────────────
    const body = await req.json().catch(() => ({}));
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { name, email, subject, message } = parsed.data;
    const ip = getClientIp(req);
    const userAgent = req.headers.get("user-agent");
    const submittedAt = new Date().toLocaleString("en-BD", {
      timeZone: "Asia/Dhaka",
      dateStyle: "full",
      timeStyle: "short",
    });

    // ── Persist to Supabase ───────────────────────────────
    const supabase = createAdminClient();
    const { error: dbError } = await supabase
      .from("contact_submissions")
      .insert({
        name,
        email,
        subject,
        message,
        ip_address: ip,
        user_agent: userAgent,
      });

    if (dbError) {
      console.error("[Contact] DB insert error:", dbError.message);
      // Do not fail the user – still attempt email delivery
    }

    // ── Send emails (non-blocking on individual failures) ─
    const [adminResult, userResult] = await Promise.allSettled([
      sendEmail({
        to: env.adminEmail,
        subject: `[RailMate] New Contact: ${subject}`,
        html: contactAdminEmail({ name, email, subject, message, submittedAt }),
        replyTo: email,
        tags: [{ name: "type", value: "contact_admin" }],
      }),
      sendEmail({
        to: email,
        subject: "We've received your message – RailMate Bangladesh",
        html: contactConfirmationEmail(name),
        tags: [{ name: "type", value: "contact_confirmation" }],
      }),
    ]);

    if (adminResult.status === "rejected") {
      console.error("[Contact] Admin email failed:", adminResult.reason);
    }
    if (userResult.status === "rejected") {
      console.error("[Contact] User confirmation email failed:", userResult.reason);
    }

    return successResponse(undefined, 201);
  } catch (err) {
    return handleApiError(err);
  }
}

// Block all other methods
export async function GET() {
  return new Response("Method Not Allowed", { status: 405 });
}
