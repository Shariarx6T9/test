-- ============================================================
-- RailMate Bangladesh – Migration 002
-- Row Level Security (RLS) Policies
--
-- Philosophy:
--   • All tables default DENY (RLS enabled, no public read).
--   • Public users can INSERT into submission tables only.
--   • Authenticated users can read their own analytics events.
--   • Service Role Key (used server-side) bypasses RLS entirely.
-- ============================================================

-- ─── Enable RLS on all tables ────────────────────────────
ALTER TABLE public.contact_submissions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist_entries       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_inquiries     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_cta_events    ENABLE ROW LEVEL SECURITY;

-- ─── contact_submissions ─────────────────────────────────
-- Public: INSERT only (form submissions from website visitors)
-- No public SELECT — admin reads via service role key
CREATE POLICY "public_can_insert_contact"
  ON public.contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- ─── newsletter_subscribers ──────────────────────────────
-- Public: INSERT only (subscribe from website)
CREATE POLICY "public_can_insert_newsletter"
  ON public.newsletter_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Authenticated: SELECT own record
CREATE POLICY "user_can_read_own_newsletter"
  ON public.newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (email = auth.jwt() ->> 'email');

-- Authenticated: UPDATE own subscription status (e.g. unsubscribe)
CREATE POLICY "user_can_update_own_newsletter"
  ON public.newsletter_subscribers
  FOR UPDATE
  TO authenticated
  USING (email = auth.jwt() ->> 'email')
  WITH CHECK (email = auth.jwt() ->> 'email');

-- ─── waitlist_entries ────────────────────────────────────
-- Public: INSERT only
CREATE POLICY "public_can_insert_waitlist"
  ON public.waitlist_entries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- ─── business_inquiries ──────────────────────────────────
-- Public: INSERT only
CREATE POLICY "public_can_insert_business_inquiry"
  ON public.business_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- ─── analytics_events ────────────────────────────────────
-- Public: INSERT (anonymous + authenticated analytics)
CREATE POLICY "public_can_insert_analytics"
  ON public.analytics_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Authenticated: SELECT own events
CREATE POLICY "user_can_read_own_analytics"
  ON public.analytics_events
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ─── download_cta_events ─────────────────────────────────
-- Public: INSERT only
CREATE POLICY "public_can_insert_download_cta"
  ON public.download_cta_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- ─── Verify policies ─────────────────────────────────────
-- Run this query after migration to confirm:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;
