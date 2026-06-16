// ============================================================
// POST /api/business-inquiry
// Dedicated enterprise/partnership inquiry endpoint.
// Persists to Supabase, notifies admin, confirms to sender.
// ============================================================

import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { businessInquirySchema } from "@/lib/validators/business-inquiry";
import { sendEmail } from "@/lib/email/resend";
import {
  businessInquiryAdminEmail,
  businessInquiryConfirmationEmail,
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
    const rl = await rateLimit(req, "form", "business-inquiry");
    if (!rl.success) {
      return rateLimitResponse(rl.reset);
    }

    // ── Validate ─────────────────────────────────────────
    const body = await req.json().catch(() => ({}));
    const parsed = businessInquirySchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const {
      company_name,
      contact_name,
      email,
      phone,
      inquiry_type,
      message,
    } = parsed.data;

    const ip = getClientIp(req);
    const submittedAt = new Date().toLocaleString("en-BD", {
      timeZone: "Asia/Dhaka",
      dateStyle: "full",
      timeStyle: "short",
    });

    // ── Persist ───────────────────────────────────────────
    const supabase = createAdminClient();
    const { error: dbError } = await supabase
      .from("business_inquiries")
      .insert({
        company_name,
        contact_name,
        email,
        phone: phone ?? null,
        inquiry_type,
        message,
        ip_address: ip,
      });

    if (dbError) {
      console.error("[BusinessInquiry] DB insert error:", dbError.message);
    }

    // ── Emails ────────────────────────────────────────────
    const [adminResult, userResult] = await Promise.allSettled([
      sendEmail({
        to: env.adminEmail,
        subject: `[RailMate] Business Inquiry – ${company_name} (${inquiry_type})`,
        html: businessInquiryAdminEmail({
          company_name,
          contact_name,
          email,
          phone,
          inquiry_type,
          message,
          submittedAt,
        }),
        replyTo: email,
        tags: [{ name: "type", value: "business_inquiry_admin" }],
      }),
      sendEmail({
        to: email,
        subject: `Thank you for your inquiry, ${contact_name} – RailMate Bangladesh`,
        html: businessInquiryConfirmationEmail(contact_name, company_name),
        tags: [{ name: "type", value: "business_inquiry_confirmation" }],
      }),
    ]);

    if (adminResult.status === "rejected") {
      console.error("[BusinessInquiry] Admin email failed:", adminResult.reason);
    }
    if (userResult.status === "rejected") {
      console.error("[BusinessInquiry] User email failed:", userResult.reason);
    }

    return successResponse(undefined, 201);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function GET() {
  return new Response("Method Not Allowed", { status: 405 });
}
