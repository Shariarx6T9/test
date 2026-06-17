// ============================================================
// POST /api/download-cta
// Tracks app download button clicks by platform/locale/page.
// Also fires a PostHog event for funnel analysis.
// ============================================================

import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { downloadCtaSchema } from "@/lib/validators/download-cta";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { hashIp } from "@/lib/utils/hash-ip";
import {
  handleApiError,
  rateLimitResponse,
  successResponse,
  validationErrorResponse,
} from "@/lib/errors";
import { env } from "@/lib/env";

export const runtime = "nodejs";

async function captureDownloadEvent(
  platform: string,
  locale: string | null,
  source_page: string | null,
  ip: string | null
) {
  try {
    await fetch(`${env.posthogHost}/capture/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: env.posthogApiKey,
        event: "download_cta_click",
        // Hashed, not raw — see Master Reference Part 14.3 (no PII to
        // third-party analytics systems).
        distinct_id: hashIp(ip),
        properties: {
          platform,
          locale,
          source_page,
          $lib: "railmate-backend",
        },
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (err) {
    console.error("[DownloadCTA] PostHog capture failed:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    // ── Rate limit ───────────────────────────────────────
    const rl = await rateLimit(req, "analytics", "download-cta");
    if (!rl.success) {
      return rateLimitResponse(rl.reset);
    }

    // ── Validate ─────────────────────────────────────────
    const body = await req.json().catch(() => ({}));
    const parsed = downloadCtaSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { platform, locale, source_page, referrer } = parsed.data;
    const ip = getClientIp(req);
    const userAgent = req.headers.get("user-agent");

    // ── Persist ───────────────────────────────────────────
    const supabase = createAdminClient();
    const { error: dbError } = await supabase
      .from("download_cta_events")
      .insert({
        platform,
        locale: locale ?? null,
        source_page: source_page ?? null,
        referrer: referrer ?? null,
        user_agent: userAgent,
        ip_address: ip,
      });

    if (dbError) {
      console.error("[DownloadCTA] DB insert error:", dbError.message);
    }

    // ── PostHog ───────────────────────────────────────────
    await captureDownloadEvent(platform, locale ?? null, source_page ?? null, ip);

    return successResponse(undefined, 202);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function GET() {
  return new Response("Method Not Allowed", { status: 405 });
}
