// ============================================================
// RailMate Bangladesh – Shared TypeScript Types
//
// Fix: Supabase's TS client resolves Insert/Update as `never`
// when the Database type uses utility types like Omit<Interface>.
// It requires FLAT inline object types at every Table entry —
// matching the shape that `supabase gen types` produces.
// ============================================================

export type ApiSuccessResponse<T = undefined> = T extends undefined
  ? { success: true }
  : { success: true; data: T };

export type ApiErrorResponse = {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, string[]>;
};

export type ApiResponse<T = undefined> =
  | ApiSuccessResponse<T>
  | ApiErrorResponse;

// ─── Domain interfaces (used in application logic) ────────
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: "active" | "unsubscribed";
  source: string | null;
  created_at: string;
  updated_at: string;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  name: string;
  source_page: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface BusinessInquiry {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  inquiry_type:
    | "partnership"
    | "enterprise"
    | "api_access"
    | "advertising"
    | "other";
  message: string;
  ip_address: string | null;
  created_at: string;
}

export type AnalyticsEventName =
  | "page_view"
  | "cta_click"
  | "download_click"
  | "form_submit"
  | "waitlist_join"
  | "newsletter_subscribe"
  | "app_store_click"
  | "play_store_click"
  | string;

export interface AnalyticsEvent {
  id: string;
  event_name: AnalyticsEventName;
  session_id: string | null;
  user_id: string | null;
  properties: Record<string, unknown>;
  locale: string | null;
  platform: string | null;
  referrer: string | null;
  user_agent: string | null;
  ip_address: string | null;
  created_at: string;
}

export interface DownloadCTAEvent {
  id: string;
  platform: "ios" | "android" | "unknown";
  locale: string | null;
  source_page: string | null;
  referrer: string | null;
  user_agent: string | null;
  ip_address: string | null;
  created_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface UploadResult {
  path: string;
  public_url: string;
  size: number;
  mime_type: string;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

// ─── Database type ────────────────────────────────────────
// Each Table entry uses FLAT inline objects (no Omit / mapped
// utility types). This is required for Supabase's generic
// resolution chain to produce the correct Insert/Update types
// rather than collapsing to `never`.
// ─────────────────────────────────────────────────────────
export type Database = {
  public: {
    Tables: {

      // ── contact_submissions ─────────────────────────────
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          subject?: string;
          message?: string;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };

      // ── newsletter_subscribers ──────────────────────────
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          status: "active" | "unsubscribed";
          source: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          status?: "active" | "unsubscribed";
          source?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          status?: "active" | "unsubscribed";
          source?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      // ── waitlist_entries ────────────────────────────────
      waitlist_entries: {
        Row: {
          id: string;
          email: string;
          name: string;
          source_page: string | null;
          metadata: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          source_page?: string | null;
          metadata?: Record<string, unknown> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          source_page?: string | null;
          metadata?: Record<string, unknown> | null;
          created_at?: string;
        };
        Relationships: [];
      };

      // ── business_inquiries ──────────────────────────────
      business_inquiries: {
        Row: {
          id: string;
          company_name: string;
          contact_name: string;
          email: string;
          phone: string | null;
          inquiry_type:
            | "partnership"
            | "enterprise"
            | "api_access"
            | "advertising"
            | "other";
          message: string;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_name: string;
          contact_name: string;
          email: string;
          phone?: string | null;
          inquiry_type:
            | "partnership"
            | "enterprise"
            | "api_access"
            | "advertising"
            | "other";
          message: string;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_name?: string;
          contact_name?: string;
          email?: string;
          phone?: string | null;
          inquiry_type?:
            | "partnership"
            | "enterprise"
            | "api_access"
            | "advertising"
            | "other";
          message?: string;
          ip_address?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };

      // ── analytics_events ────────────────────────────────
      analytics_events: {
        Row: {
          id: string;
          event_name: string;
          session_id: string | null;
          user_id: string | null;
          properties: Record<string, unknown>;
          locale: string | null;
          platform: string | null;
          referrer: string | null;
          user_agent: string | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_name: string;
          session_id?: string | null;
          user_id?: string | null;
          properties?: Record<string, unknown>;
          locale?: string | null;
          platform?: string | null;
          referrer?: string | null;
          user_agent?: string | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_name?: string;
          session_id?: string | null;
          user_id?: string | null;
          properties?: Record<string, unknown>;
          locale?: string | null;
          platform?: string | null;
          referrer?: string | null;
          user_agent?: string | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };

      // ── download_cta_events ─────────────────────────────
      download_cta_events: {
        Row: {
          id: string;
          platform: "ios" | "android" | "unknown";
          locale: string | null;
          source_page: string | null;
          referrer: string | null;
          user_agent: string | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          platform?: "ios" | "android" | "unknown";
          locale?: string | null;
          source_page?: string | null;
          referrer?: string | null;
          user_agent?: string | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          platform?: "ios" | "android" | "unknown";
          locale?: string | null;
          source_page?: string | null;
          referrer?: string | null;
          user_agent?: string | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };

    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
