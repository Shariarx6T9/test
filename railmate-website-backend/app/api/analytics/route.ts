// ============================================================
// POST /api/analytics
// Accepts single or batched custom events.
// Persists to Supabase for first-party retention.
// Forwards to PostHog for dashboards & funnels.
// ============================================================

import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  analyticsEventSchema,
  analyticsBatchSchema,
} from "@/lib/validators/analytics";
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

// ─── PostHog Server-Side Capture ─────────────────────────
// NOTE: distinct_id intentionally never falls back to a raw IP.
// Per Master Reference Part 14.3, PostHog (third-party) must only
// ever see anonymous identifiers, never PII. Raw IP is fine in our
// own Supabase tables (first-party, admin-only, used for abuse
// investigation) but must not leave our infrastructure.
async function capturePostHogEvents(
  events: Array<{
    event_name: string;
    session_id?: string | null;
    user_id?: string | null;
    properties: Record<string, unknown>;
    locale?: string | null;
    platform?: string | null;
    referrer?: string | null;
    ip?: string | null;
  }>
) {
  try {
    const batch = events.map((e) => ({
      event: e.event_name,
      distinct_id: e.user_id ?? e.session_id ?? hashIp(e.ip),
      properties: {
        ...e.properties,
        $lib: "railmate-backend",
        $session_id: e.session_id,
        locale: e.locale,
        platform: e.platform,
        $referrer: e.referrer,
        // Deliberately NOT including raw IP here — see note above.
      },
      timestamp: new Date().toISOString(),
    }));

    const response = await fetch(`${env.posthogHost}/batch/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: env.posthogApiKey,
        batch,
      }),
    });

    if (!response.ok) {
      console.error("[Analytics] PostHog batch failed:", response.status);
    }
  } catch (err) {
    console.error("[Analytics] PostHog capture error:", err);
    // Non-fatal — Supabase is the source of truth
  }
}

export async function POST(req: NextRequest) {
  try {
    // ── Rate limit ───────────────────────────────────────
    const rl = await rateLimit(req, "analytics", "analytics");
    if (!rl.success) {
      return rateLimitResponse(rl.reset);
    }

    const ip = getClientIp(req);
    const userAgent = req.headers.get("user-agent");
    const body = await req.json().catch(() => ({}));

    // ── Support single event OR batch ─────────────────────
    let events: Array<{
      event_name: string;
      session_id?: string | null;
      user_id?: string | null;
      properties: Record<string, unknown>;
      locale?: string | null;
      platform?: string | null;
      referrer?: string | null;
    }>;

    if (Array.isArray(body.events)) {
      const parsed = analyticsBatchSchema.safeParse(body);
      if (!parsed.success) return validationErrorResponse(parsed.error);
      events = parsed.data.events;
    } else {
      const parsed = analyticsEventSchema.safeParse(body);
      if (!parsed.success) return validationErrorResponse(parsed.error);
      events = [parsed.data];
    }

    const supabase = createAdminClient();

    // ── Persist to Supabase ───────────────────────────────
    const rows = events.map((e) => ({
      event_name: e.event_name,
      session_id: e.session_id ?? null,
      user_id: e.user_id ?? null,
      properties: e.properties,
      locale: e.locale ?? null,
      platform: e.platform ?? null,
      referrer: e.referrer ?? null,
      user_agent: userAgent,
      ip_address: ip,
    }));

    const { error: dbError } = await supabase
      .from("analytics_events")
      .insert(rows);

    if (dbError) {
      console.error("[Analytics] DB insert error:", dbError.message);
    }

    // ── Forward to PostHog ────────────────────────────────
    await capturePostHogEvents(events.map((e) => ({ ...e, ip })));

    return successResponse(undefined, 202);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function GET() {
  return new Response("Method Not Allowed", { status: 405 });
}
