// ============================================================
// RailMate Bangladesh – Environment Validation
// Validates all required environment variables at startup.
// Fails fast with a clear error message when config is missing.
// ============================================================

import { z } from "zod";

const envSchema = z.object({
  // ── Next.js ──────────────────────────────────────────────
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  NEXT_PUBLIC_SITE_URL: z.string().url("NEXT_PUBLIC_SITE_URL must be a valid URL"),

  // ── Supabase ─────────────────────────────────────────────
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, "SUPABASE_SERVICE_ROLE_KEY is required — never expose client-side"),

  // ── Resend (Email) ────────────────────────────────────────
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  EMAIL_FROM: z
    .string()
    .email("EMAIL_FROM must be a valid email address")
    .default("noreply@railmate.app"),
  EMAIL_REPLY_TO: z
    .string()
    .email("EMAIL_REPLY_TO must be a valid email address")
    .default("hello@railmate.app"),
  ADMIN_EMAIL: z
    .string()
    .email("ADMIN_EMAIL must be a valid email address"),

  // ── PostHog (Analytics) ───────────────────────────────────
  NEXT_PUBLIC_POSTHOG_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_POSTHOG_KEY is required"),
  NEXT_PUBLIC_POSTHOG_HOST: z
    .string()
    .url("NEXT_PUBLIC_POSTHOG_HOST must be a valid URL")
    .default("https://app.posthog.com"),
  POSTHOG_API_KEY: z.string().min(1, "POSTHOG_API_KEY is required for server-side ingestion"),

  // ── Rate Limiting ─────────────────────────────────────────
  // Using Upstash Redis for production rate limiting (optional; falls back to in-memory)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const errors = parsed.error.issues
      .map((issue) => `  • ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(
      `\n\n🚨 Environment configuration error:\n${errors}\n\nCheck your .env.local file or Vercel environment settings.\n`
    );
  }

  return parsed.data;
}

// Singleton – validated once at module load time
let _env: Env | undefined;

export function getEnv(): Env {
  if (!_env) {
    _env = validateEnv();
  }
  return _env;
}

// Convenience re-export for commonly used public vars
export const env = {
  get siteUrl() {
    return getEnv().NEXT_PUBLIC_SITE_URL;
  },
  get supabaseUrl() {
    return getEnv().NEXT_PUBLIC_SUPABASE_URL;
  },
  get supabaseAnonKey() {
    return getEnv().NEXT_PUBLIC_SUPABASE_ANON_KEY;
  },
  get supabaseServiceRoleKey() {
    return getEnv().SUPABASE_SERVICE_ROLE_KEY;
  },
  get resendApiKey() {
    return getEnv().RESEND_API_KEY;
  },
  get emailFrom() {
    return getEnv().EMAIL_FROM;
  },
  get emailReplyTo() {
    return getEnv().EMAIL_REPLY_TO;
  },
  get adminEmail() {
    return getEnv().ADMIN_EMAIL;
  },
  get posthogKey() {
    return getEnv().NEXT_PUBLIC_POSTHOG_KEY;
  },
  get posthogHost() {
    return getEnv().NEXT_PUBLIC_POSTHOG_HOST;
  },
  get posthogApiKey() {
    return getEnv().POSTHOG_API_KEY;
  },
  get upstashRedisUrl() {
    return getEnv().UPSTASH_REDIS_REST_URL;
  },
  get upstashRedisToken() {
    return getEnv().UPSTASH_REDIS_REST_TOKEN;
  },
  get nodeEnv() {
    return getEnv().NODE_ENV;
  },
  get isProduction() {
    return getEnv().NODE_ENV === "production";
  },
};
