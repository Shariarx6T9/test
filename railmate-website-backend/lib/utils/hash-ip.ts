// ============================================================
// RailMate Bangladesh – IP Hashing Utility
//
// Part 14.3 of the Master Reference: "No analytics system
// receives PII — PostHog events use anonymous user IDs only."
//
// Raw IP addresses must never be sent to PostHog (a third-party
// analytics system) as a distinct_id or property. If you need a
// stable-but-anonymous identifier for unauthenticated traffic,
// hash it. This is one-way and not reversible to the original IP.
// ============================================================

import { createHash } from "node:crypto";

export function hashIp(ip: string | null | undefined): string {
  if (!ip) return "anon_unknown";
  return "anon_" + createHash("sha256").update(ip).digest("hex").slice(0, 16);
}
