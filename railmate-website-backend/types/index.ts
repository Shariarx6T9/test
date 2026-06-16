// ============================================================
// RailMate Bangladesh – Shared TypeScript Types
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

// ─── Contact ──────────────────────────────────────────────
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

// ─── Newsletter ────────────────────────────────────────────
export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: "active" | "unsubscribed";
  source: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Waitlist ──────────────────────────────────────────────
export interface WaitlistEntry {
  id: string;
  email: string;
  name: string;
  source_page: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

// ─── Business Inquiry ─────────────────────────────────────
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

// ─── Analytics ────────────────────────────────────────────
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

// ─── Download CTA ─────────────────────────────────────────
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

// ─── Auth ─────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

// ─── Upload ───────────────────────────────────────────────
export interface UploadResult {
  path: string;
  public_url: string;
  size: number;
  mime_type: string;
}

// ─── Rate Limit ───────────────────────────────────────────
export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

// ─── Database (Supabase Generated Shape) ─────────────────
export interface Database {
  public: {
    Tables: {
      contact_submissions: {
        Row: ContactSubmission;
        Insert: Omit<ContactSubmission, "id" | "created_at">;
        Update: Partial<Omit<ContactSubmission, "id">>;
      };
      newsletter_subscribers: {
        Row: NewsletterSubscriber;
        Insert: Omit<
          NewsletterSubscriber,
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Omit<NewsletterSubscriber, "id">>;
      };
      waitlist_entries: {
        Row: WaitlistEntry;
        Insert: Omit<WaitlistEntry, "id" | "created_at">;
        Update: Partial<Omit<WaitlistEntry, "id">>;
      };
      business_inquiries: {
        Row: BusinessInquiry;
        Insert: Omit<BusinessInquiry, "id" | "created_at">;
        Update: Partial<Omit<BusinessInquiry, "id">>;
      };
      analytics_events: {
        Row: AnalyticsEvent;
        Insert: Omit<AnalyticsEvent, "id" | "created_at">;
        Update: Partial<Omit<AnalyticsEvent, "id">>;
      };
      download_cta_events: {
        Row: DownloadCTAEvent;
        Insert: Omit<DownloadCTAEvent, "id" | "created_at">;
        Update: Partial<Omit<DownloadCTAEvent, "id">>;
      };
    };
  };
}
