-- 1. Fix Auctions Schema (Error Resolution)
ALTER TABLE artworks
ADD COLUMN IF NOT EXISTS desired_start_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS desired_end_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS reserve_price integer;

ALTER TABLE artworks DROP CONSTRAINT IF EXISTS artworks_status_check;
ALTER TABLE artworks ADD CONSTRAINT artworks_status_check 
  CHECK (status IN ('available', 'sold', 'auction', 'pending_approval', 'pending_auction', 'auction_rejected', 'rejected'));

-- 2. Create Notifications System
create table if not exists notifications (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id text not null, -- references Clerk user ID (stored as text usually, or uuid if using supabase auth)
  title text not null,
  message text not null,
  type text default 'info', -- info, success, warning, error
  read boolean default false,
  link text -- optional link to redirect
);

alter table notifications enable row level security;
create policy "Users can see their own notifications" on notifications
  for select using (auth.uid()::text = user_id);

-- 3. Create Newsletter System
create table if not exists newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text unique not null,
  active boolean default true
);

alter table newsletter_subscribers enable row level security;
-- Only admin should read, but anyone can insert
create policy "Anyone can subscribe" on newsletter_subscribers
  for insert with check (true);
