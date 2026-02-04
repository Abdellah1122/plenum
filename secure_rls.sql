-- 1. Enable RLS on Profiles
alter table profiles enable row level security;

-- 2. Create Policies

-- Allow Users to View/Edit THEIR OWN data
-- IMPORTANT: This requires Clerk JWT Integration in Supabase Dashboard.
-- Without it, 'auth.uid()' refers to nothing relevant for Clerk users.
-- We cast auth.uid() to text to match our ID column type.
create policy "Users can view own profile" on profiles
  for select using (
    id = auth.uid()::text
  );

create policy "Users can update own profile" on profiles
  for update using (
    id = auth.uid()::text
  );

-- Allow Public to view basic profile info (needed for Marketplace to show artist names)?
-- Adjust as needed. For now, let's allow public read for username/avatar
create policy "Public profiles viewable" on profiles
  for select using (true);


-- 3. Artworks Policies
alter table artworks enable row level security;

-- Public can view approved works
create policy "Public view approved artworks" on artworks
  for select using (status in ('approved', 'sold', 'auction'));

-- Artists can view their own works (pending or otherwise)
create policy "Artists view own works" on artworks
  for select using (artist_id = auth.uid()::text);

-- Artists can insert works
create policy "Artists insert works" on artworks
  for insert with check (
    artist_id = auth.uid()::text
    -- AND ideally check if role is artist, but role check via RLS is complex without custom claims
  );

-- Admins (Requires custom claim 'app_metadata' -> 'role' or database lookup)
-- Simplest Admin Policy for now:
-- If we assume we settled the "admin" role in the Profiles table:
create policy "Admins view all" on artworks
  for select using (
    exists (select 1 from profiles where id = auth.uid()::text and role = 'admin')
  );

create policy "Admins update all" on artworks
  for update using (
    exists (select 1 from profiles where id = auth.uid()::text and role = 'admin')
  );
