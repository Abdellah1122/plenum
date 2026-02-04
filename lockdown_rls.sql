-- LOCK DOWN: Enforce Read-Only for Client Side

-- 1. Artworks
-- Drop existing permissive policies
drop policy if exists "Public view approved" on artworks;
drop policy if exists "Anyone can insert" on artworks;
drop policy if exists "Anyone can update" on artworks;
drop policy if exists "Public view approved artworks" on artworks;
drop policy if exists "Artists view own works" on artworks;
drop policy if exists "Artists insert works" on artworks;
drop policy if exists "Admins view all" on artworks;
drop policy if exists "Admins update all" on artworks;

-- Re-enable RLS just in case
alter table artworks enable row level security;

-- ALLOW: Public Read of Approved Works
create policy "Public Read Approved" on artworks
  for select using (status in ('approved', 'sold', 'auction'));

-- ALLOW: Artists and Admins Read Access
-- (Requires Clerk JWT integration for auth.uid() to work on client)
-- If JWT is NOT setup, client-side fetching for "My Submissions" might fail if we filter by auth.uid().
-- However, we moved mutations to Server Actions. 
-- For fetching, we can leave it slightly open or require JWT. 
-- Let's assume we want to protect data visibility too.

create policy "Artists Read Own" on artworks
  for select using (artist_id = auth.uid()::text); 

create policy "Admins Read All" on artworks
  for select using (
     exists (select 1 from profiles where id = auth.uid()::text and role = 'admin')
  );

-- DENY: ALL Client-Side Inserts/Updates/Deletes
-- No policies created for INSERT/UPDATE/DELETE implies they are forbidden by default.
-- Server Actions override this by using the Service Role Key.

-- 2. Profiles
-- Drop open policies
drop policy if exists "Users can view own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;
drop policy if exists "Public profiles viewable" on profiles;

-- Re-enable RLS
alter table profiles enable row level security;

-- Allow Public Read (Basic Info)
create policy "Public Read Profiles" on profiles
  for select using (true);

-- Allow Users Update Own (Client Side still useful for simple profile edits like avatar)
create policy "Users Update Own" on profiles
  for update using (id = auth.uid()::text);

-- 3. Logs (Read Only for Admin)
alter table access_logs enable row level security;
create policy "Admins View Logs" on access_logs
  for select using (
    exists (select 1 from profiles where id = auth.uid()::text and role = 'admin')
  );
