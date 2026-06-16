// ============================================================
// RailMate Bangladesh – Rate Limiter
// Primary:  Upstash Redis sliding-window (production)
// Fallback: In-process Map (development / no Redis configured)
// ============================================================

import { NextRequest } from "next/server";
import type { RateLimitResult } from "@/types";

// ─── Config Presets ───────────────────────────────────────
export const RateLimitPreset = {
  /** Contact / Business inquiry forms – 5 req / 10 min */
  form: { requests: 5, windowSeconds: 600 },
  /** Newsletter / Waitlist – 3 req / 5 min */
  subscribe: { requests: 3, windowSeconds: 300 },
  /** Analytics ingestion – 60 req / min */
  analytics: { requests: 60, windowSeconds: 60 },
  /** Auth OTP send – 3 req / 10 min */
  authOtp: { requests: 3, windowSeconds: 600 },
  /** Upload – 10 req / min */
  upload: { requests: 10, windowSeconds: 60 },
} as const;

export type RateLimitPresetKey = keyof typeof RateLimitPreset;

// ─── Identifier Resolution ────────────────────────────────
function resolveIdentifier(req: NextRequest, prefix: string): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const ip = forwardedFor?.split(",")[0]?.trim() ?? realIp ?? "unknown";
  return `${prefix}:${ip}`;
}

// ─── In-Memory Fallback ───────────────────────────────────
interface MemoryRecord {
  count: number;
  resetAt: number;
}
const memoryStore = new Map<string, MemoryRecord>();

function inMemoryLimit(
  key: string,
  maxRequests: number,
  windowSeconds: number
): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSeconds * 1_000;

  const record = memoryStore.get(key);

  if (!record || now > record.resetAt) {
    const resetAt = now + windowMs;
    memoryStore.set(key, { count: 1, resetAt });
    return { success: true, limit: maxRequests, remaining: maxRequests - 1, reset: resetAt };
  }

  if (record.count >= maxRequests) {
    return { success: false, limit: maxRequests, remaining: 0, reset: record.resetAt };
  }

  record.count += 1;
  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - record.count,
    reset: record.resetAt,
  };
}

// ─── Upstash Redis Limit ──────────────────────────────────
async function upstashLimit(
  key: string,
  maxRequests: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL!;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;

  const pipeline = [
    ["INCR", key],
    ["EXPIRE", key, String(windowSeconds)],
    ["TTL", key],
  ];

  const response = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pipeline),
  });

  if (!response.ok) {
    // Fail open – allow the request if Redis is down
    console.error("[RateLimit] Upstash request failed:", response.status);
    return { success: true, limit: maxRequests, remaining: maxRequests, reset: Date.now() };
  }

  const data = (await response.json()) as Array<{ result: number }>;
  const count = data[0]?.result ?? 1;
  const ttl = data[2]?.result ?? windowSeconds;
  const resetAt = Date.now() + ttl * 1_000;

  if (count > maxRequests) {
    return { success: false, limit: maxRequests, remaining: 0, reset: resetAt };
  }

  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - count,
    reset: resetAt,
  };
}

// ─── Public API ───────────────────────────────────────────
export async function rateLimit(
  req: NextRequest,
  preset: RateLimitPresetKey,
  customPrefix?: string
): Promise<RateLimitResult> {
  const config = RateLimitPreset[preset];
  const prefix = customPrefix ?? preset;
  const key = resolveIdentifier(req, prefix);

  const hasUpstash =
    !!process.env.UPSTASH_REDIS_REST_URL &&
    !!process.env.UPSTASH_REDIS_REST_TOKEN;

  try {
    if (hasUpstash) {
      return await upstashLimit(key, config.requests, config.windowSeconds);
    }
    return inMemoryLimit(key, config.requests, config.windowSeconds);
  } catch (err) {
    console.error("[RateLimit] Unexpected error:", err);
    // Fail open to avoid blocking legitimate traffic due to rate-limit infra issues
    return { success: true, limit: config.requests, remaining: 1, reset: Date.now() };
  }
}

// ─── IP Helper ────────────────────────────────────────────
export function getClientIp(req: NextRequest): string | null {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  return forwardedFor?.split(",")[0]?.trim() ?? realIp ?? null;
}
