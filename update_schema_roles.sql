-- 1. Profiles & Roles
-- Ensure role enum exists and handle potential conflicts if re-running
do $$ 
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum ('admin', 'artist', 'user', 'collector');
  end if;
end $$;

-- Update profiles table to add role column
alter table profiles 
  add column if not exists role user_role default 'user';

-- If the column already existed as text (from previous attempts), ensure it is cast correctly
-- But since we just added it as user_role, we might not need to cast if it didn't exist.
-- To be safe, if you had a text column named 'role', you would need to drop and re-add or cast.
-- For now, let's assume if it exists, it might be text, so we handle that case or just force it.
-- Simplest approach for this "fix":
-- alter table profiles drop column if exists role;
-- alter table profiles add column role user_role default 'user';
-- But that loses data.
-- Better:
-- alter table profiles alter column role type user_role using role::user_role; 
-- The error said "column role does not exist", so "add column" is the fix.

-- 2. Artworks Status & Artist Link
do $$ 
begin
  if not exists (select 1 from pg_type where typname = 'artwork_status') then
    create type artwork_status as enum ('pending_approval', 'approved', 'rejected', 'sold', 'auction');
  end if;
end $$;

alter table artworks 
  add column if not exists artist_id uuid references profiles(id),
  add column if not exists admin_notes text,
  drop column if exists status, -- Drop old text column to replace with enum safely or cast it
  add column status artwork_status default 'pending_approval';

-- 3. Notifications Table
create table if not exists notifications (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references profiles(id) not null,
  type text check (type in ('info', 'success', 'warning', 'error')),
  message text not null,
  is_read boolean default false
);

-- 4. Access Logs Table
create table if not exists access_logs (
  id uuid default gen_random_uuid() primary key,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null,
  actor_id uuid references profiles(id),
  action text not null,
  details jsonb
);

-- RLS Policies

-- Notifications
alter table notifications enable row level security;
create policy "Users can view their own notifications" on notifications
  for select using ((select auth.uid()) = user_id);

-- Access Logs
alter table access_logs enable row level security;
create policy "Admins can view all logs" on access_logs
  for select using (
    exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin')
  );

-- Artworks Policies for Roles
-- Everyone can see 'approved', 'sold', 'auction'
create policy "Public view approved artworks" on artworks
  for select using (status in ('approved', 'sold', 'auction'));

-- Artists can see their own pending/rejected works
create policy "Artists view own works" on artworks
  for select using ((select auth.uid()) = artist_id);

-- Admins can see ALL artworks
create policy "Admins view all works" on artworks
  for select using (
    exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin')
  );

-- Artists can insert works
create policy "Artists insert works" on artworks
  for insert with check (
    -- Must be artist or admin
    exists (select 1 from profiles where id = (select auth.uid()) and role in ('artist', 'admin'))
  );

-- Admins can update works (approve/reject)
create policy "Admins update works" on artworks
  for update using (
    exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin')
  );
