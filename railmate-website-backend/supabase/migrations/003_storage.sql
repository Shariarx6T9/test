-- ============================================================
-- RailMate Bangladesh – Migration 003
-- Supabase Storage bucket configuration & RLS policies
-- ============================================================

-- ─── Create buckets (idempotent) ─────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'avatars',
    'avatars',
    true,                        -- Public read (avatar URLs embedded in UI)
    5242880,                     -- 5 MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  ),
  (
    'community-photos',
    'community-photos',
    true,                        -- Public read
    10485760,                    -- 10 MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  )
ON CONFLICT (id) DO UPDATE SET
  file_size_limit    = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ─── avatars RLS ─────────────────────────────────────────
-- Public read (all objects in avatars bucket are public)
CREATE POLICY "avatars_public_read"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'avatars');

-- Authenticated users can insert their own avatar
CREATE POLICY "avatars_user_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = 'avatars'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

-- Users can update/delete only their own avatars
CREATE POLICY "avatars_user_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

CREATE POLICY "avatars_user_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

-- ─── community-photos RLS ─────────────────────────────────
-- Public read
CREATE POLICY "community_photos_public_read"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'community-photos');

-- Authenticated insert
CREATE POLICY "community_photos_user_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'community-photos'
    AND (storage.foldername(name))[1] = 'community'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

-- Users can delete their own photos
CREATE POLICY "community_photos_user_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'community-photos'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );
