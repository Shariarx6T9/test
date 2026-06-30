-- BUG 1 FIX: Profile Update RLS Policies and Auto-creation Trigger
-- This file must be run in Supabase SQL Editor to enable users to:
-- 1. INSERT their own profile row (fixes "row violates row-level security policy" error)
-- 2. Auto-create user row on signup (prevents "Cannot coerce to single JSON object" error)

-- Step 1: Add INSERT policy for users table
-- Allow authenticated users to insert their own profile row
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
CREATE POLICY "Users can insert own profile"
ON users FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Step 2: Verify SELECT and UPDATE policies exist
-- These should already exist, but let's ensure they're correct
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Step 3: Create trigger to auto-insert user row on signup
-- This prevents the "missing row" error entirely
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, phone, display_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'Traveler'),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger on auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 4: Verify the policies are active
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'users';

-- Expected output: 3 policies
-- 1. "Users can view own profile" - SELECT
-- 2. "Users can update own profile" - UPDATE
-- 3. "Users can insert own profile" - INSERT
