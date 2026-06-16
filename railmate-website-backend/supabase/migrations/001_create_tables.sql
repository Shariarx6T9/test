-- ============================================================
-- RailMate Bangladesh – Migration 001
-- Creates all application tables with constraints & indexes.
-- Run via: supabase db push  OR  Supabase SQL Editor
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── contact_submissions ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT        NOT NULL CHECK (char_length(name) BETWEEN 2 AND 100),
  email        TEXT        NOT NULL CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  subject      TEXT        NOT NULL CHECK (char_length(subject) BETWEEN 5 AND 200),
  message      TEXT        NOT NULL CHECK (char_length(message) BETWEEN 20 AND 5000),
  ip_address   TEXT,
  user_agent   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_email
  ON public.contact_submissions (email);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at
  ON public.contact_submissions (created_at DESC);

-- ─── newsletter_subscribers ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email        TEXT        NOT NULL UNIQUE CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  status       TEXT        NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  source       TEXT        DEFAULT 'website' CHECK (char_length(source) <= 100),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email
  ON public.newsletter_subscribers (email);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status
  ON public.newsletter_subscribers (status);

-- Keep updated_at in sync automatically
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_newsletter_subscribers_updated_at ON public.newsletter_subscribers;
CREATE TRIGGER trg_newsletter_subscribers_updated_at
  BEFORE UPDATE ON public.newsletter_subscribers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── waitlist_entries ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.waitlist_entries (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email        TEXT        NOT NULL UNIQUE CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  name         TEXT        NOT NULL CHECK (char_length(name) BETWEEN 2 AND 100),
  source_page  TEXT        CHECK (char_length(source_page) <= 200),
  metadata     JSONB       DEFAULT '{}'::jsonb,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_waitlist_entries_email
  ON public.waitlist_entries (email);

CREATE INDEX IF NOT EXISTS idx_waitlist_entries_created_at
  ON public.waitlist_entries (created_at DESC);

-- ─── business_inquiries ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.business_inquiries (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name   TEXT        NOT NULL CHECK (char_length(company_name) BETWEEN 2 AND 200),
  contact_name   TEXT        NOT NULL CHECK (char_length(contact_name) BETWEEN 2 AND 100),
  email          TEXT        NOT NULL CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone          TEXT        CHECK (phone ~ '^\+?[0-9\s\-().]{7,20}$'),
  inquiry_type   TEXT        NOT NULL CHECK (
                               inquiry_type IN (
                                 'partnership', 'enterprise', 'api_access',
                                 'advertising', 'other'
                               )
                             ),
  message        TEXT        NOT NULL CHECK (char_length(message) BETWEEN 20 AND 5000),
  ip_address     TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_business_inquiries_email
  ON public.business_inquiries (email);

CREATE INDEX IF NOT EXISTS idx_business_inquiries_inquiry_type
  ON public.business_inquiries (inquiry_type);

CREATE INDEX IF NOT EXISTS idx_business_inquiries_created_at
  ON public.business_inquiries (created_at DESC);

-- ─── analytics_events ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name   TEXT        NOT NULL CHECK (char_length(event_name) BETWEEN 1 AND 100),
  session_id   UUID,
  user_id      UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  properties   JSONB       NOT NULL DEFAULT '{}'::jsonb,
  locale       TEXT        CHECK (char_length(locale) <= 20),
  platform     TEXT        CHECK (platform IN ('web', 'ios', 'android', 'unknown')),
  referrer     TEXT        CHECK (char_length(referrer) <= 500),
  user_agent   TEXT,
  ip_address   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name
  ON public.analytics_events (event_name);

CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id
  ON public.analytics_events (session_id);

CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id
  ON public.analytics_events (user_id);

CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at
  ON public.analytics_events (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_platform
  ON public.analytics_events (platform);

-- JSONB index for querying inside properties
CREATE INDEX IF NOT EXISTS idx_analytics_events_properties
  ON public.analytics_events USING gin (properties);

-- ─── download_cta_events ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.download_cta_events (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  platform     TEXT        NOT NULL DEFAULT 'unknown'
                             CHECK (platform IN ('ios', 'android', 'unknown')),
  locale       TEXT        CHECK (char_length(locale) <= 20),
  source_page  TEXT        CHECK (char_length(source_page) <= 200),
  referrer     TEXT        CHECK (char_length(referrer) <= 500),
  user_agent   TEXT,
  ip_address   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_download_cta_events_platform
  ON public.download_cta_events (platform);

CREATE INDEX IF NOT EXISTS idx_download_cta_events_created_at
  ON public.download_cta_events (created_at DESC);

-- ─── Comments ─────────────────────────────────────────────
COMMENT ON TABLE public.contact_submissions     IS 'Website contact form submissions';
COMMENT ON TABLE public.newsletter_subscribers  IS 'Email newsletter subscribers';
COMMENT ON TABLE public.waitlist_entries        IS 'App early-access waitlist';
COMMENT ON TABLE public.business_inquiries      IS 'Enterprise and partnership inquiries';
COMMENT ON TABLE public.analytics_events        IS 'First-party custom analytics events';
COMMENT ON TABLE public.download_cta_events     IS 'App download CTA click tracking';
