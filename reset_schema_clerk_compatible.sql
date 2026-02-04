-- DROP EVERYTHING to start fresh with correct types
drop table if exists notifications;
drop table if exists access_logs;
drop table if exists auctions;
drop table if exists artworks;
drop table if exists profiles;

-- Recreate Types (if they don't exist, though drop table doesn't drop types)
do $$ 
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum ('admin', 'artist', 'user', 'collector');
  end if;
  if not exists (select 1 from pg_type where typname = 'artwork_status') then
    create type artwork_status as enum ('pending_approval', 'approved', 'rejected', 'sold', 'auction');
  end if;
end $$;

-- 1. Profiles (Clerk Compatible)
create table profiles (
  id text primary key, -- Changed from uuid references auth.users to text
  updated_at timestamp with time zone,
  username text,
  full_name text,
  avatar_url text,
  email text,
  website text,
  role user_role default 'user'
);

-- Disable RLS for Profiles to allow Clerk Sync from Client Side
alter table profiles disable row level security;

-- 2. Artworks
create table artworks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  artist text not null,
  artist_id text references profiles(id), -- Changed to text
  year text,
  price integer,
  image_url text,
  category text,
  status artwork_status default 'pending_approval',
  admin_notes text
);

alter table artworks enable row level security;
create policy "Public view approved" on artworks for select using (status in ('approved', 'sold', 'auction'));
create policy "Anyone can insert" on artworks for insert with check (true); -- Relaxed for prototype
create policy "Anyone can update" on artworks for update using (true); -- Relaxed for prototype

-- 3. Auctions
create table auctions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  artwork_id uuid references artworks(id) not null,
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  start_price integer,
  current_bid integer
);
alter table auctions disable row level security;

-- 4. Notifications
create table notifications (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id text references profiles(id) not null, -- Changed to text
  type text,
  message text not null,
  is_read boolean default false
);
alter table notifications disable row level security;

-- 5. Access Logs
create table access_logs (
  id uuid default gen_random_uuid() primary key,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null,
  actor_id text references profiles(id), -- Changed to text
  action text not null,
  details jsonb
);
alter table access_logs disable row level security;

-- Seed Data (Optional - Artworks)
insert into artworks (title, artist, year, price, category, status) values
('Composition Abstraite IV', 'Elena Vosk', '2023', 12500, 'Peinture', 'approved'),
('Silence en Bleu', 'Marcus Reed', '2024', 4200, 'Photographie', 'approved'),
('Forme Structurelle', 'Sarah J.', '2022', 6800, 'Sculpture', 'approved');
