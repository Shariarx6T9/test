-- DIAGNOSTIC: Check current RLS policies and triggers before applying fix
-- Run this FIRST to see current state

-- 1. Check existing policies on users table
SELECT
    schemaname,
    tablename,
    policyname,
    cmd as command,
    roles,
    CASE
        WHEN cmd = 'SELECT' THEN 'Can read own profile'
        WHEN cmd = 'UPDATE' THEN 'Can update own profile'
        WHEN cmd = 'INSERT' THEN 'Can create own profile'
        WHEN cmd = 'DELETE' THEN 'Can delete own profile'
    END as description
FROM pg_policies
WHERE tablename = 'users'
ORDER BY cmd;

-- 2. Check if auto-user-creation trigger exists
SELECT
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 3. Check if handle_new_user function exists
SELECT
    routine_name,
    routine_type,
    data_type as return_type
FROM information_schema.routines
WHERE routine_name = 'handle_new_user'
AND routine_schema = 'public';

-- 4. Test query: Count how many auth users DON'T have a users table row
SELECT
    'Auth users without profile row' as issue,
    COUNT(*) as count
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- INTERPRETATION:
-- If you see 0 policies → RLS not configured (BAD)
-- If you see 1-2 policies but no INSERT policy → Missing INSERT permission (BAD)
-- If you see 0 rows for trigger → Auto-creation not working (BAD)
-- If "Auth users without profile row" > 0 → Broken accounts exist (BAD)
