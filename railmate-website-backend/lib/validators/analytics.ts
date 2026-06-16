import { z } from "zod";

export const analyticsEventSchema = z.object({
  event_name: z
    .string()
    .trim()
    .min(1, "Event name is required.")
    .max(100, "Event name must not exceed 100 characters.")
    .regex(/^[a-z0-9_]+$/, "Event name must be lowercase snake_case."),
  session_id: z.string().uuid("session_id must be a valid UUID.").optional().nullable(),
  user_id: z.string().uuid("user_id must be a valid UUID.").optional().nullable(),
  properties: z.record(z.unknown()).optional().default({}),
  locale: z
    .string()
    .max(20, "Locale must not exceed 20 characters.")
    .optional()
    .nullable(),
  platform: z
    .enum(["web", "ios", "android", "unknown"])
    .optional()
    .nullable(),
  referrer: z
    .string()
    .max(500, "Referrer must not exceed 500 characters.")
    .optional()
    .nullable(),
});

export type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>;

// Bulk ingestion (up to 50 events per request)
export const analyticsBatchSchema = z.object({
  events: z
    .array(analyticsEventSchema)
    .min(1, "At least one event is required.")
    .max(50, "A maximum of 50 events per batch is allowed."),
});

export type AnalyticsBatchInput = z.infer<typeof analyticsBatchSchema>;
