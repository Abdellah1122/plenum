-- The current RLS policies rely on "auth.uid()", which is the Supabase User ID.
-- Since we are logging in with Clerk, Supabase sees us as an "anonymous" user.
-- This causes the INSERT into 'profiles' to fail because of the Row Level Security policy.

-- OPTION 1 (QUICK FIX for Prototype): Disable RLS on profiles to allow the Clerk Sync to work.
alter table profiles disable row level security;

-- OPTION 2 (Secure): If you want to keep RLS enabled, we would need to setup Clerk-Supabase JWT integration
-- or use a Service Role Key on the backend.
-- For now, disabling RLS is the fastest way to unblock the Admin Role assignment.

-- Also, let's verify the role column exists (just in case)
alter table profiles 
  add column if not exists role user_role default 'user';
