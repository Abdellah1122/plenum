-- 1. Handle Enum Updates (if it is an enum)
-- We wrap in a DO block to avoid errors if values already exist or type doesn't exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'artwork_status') THEN
        -- It is an enum, add new values interactively
        -- Postgres cannot add multiple values in one command, need separate statements
        -- We suppress errors if value already exists by checking or just letting it run (ALTER TYPE ADD VALUE IF NOT EXISTS is supported in newer PG versions)
        -- Using safe approach:
        ALTER TYPE artwork_status ADD VALUE IF NOT EXISTS 'pending_approval';
        ALTER TYPE artwork_status ADD VALUE IF NOT EXISTS 'pending_auction';
        ALTER TYPE artwork_status ADD VALUE IF NOT EXISTS 'auction_rejected';
        ALTER TYPE artwork_status ADD VALUE IF NOT EXISTS 'rejected';
        ALTER TYPE artwork_status ADD VALUE IF NOT EXISTS 'auction';
    ELSE
        -- It is likely text with a check constraint, so we update the check constraint
        -- Drop old constraint if it exists to replace it
        ALTER TABLE artworks DROP CONSTRAINT IF EXISTS artworks_status_check;
        ALTER TABLE artworks ADD CONSTRAINT artworks_status_check 
            CHECK (status IN ('available', 'sold', 'auction', 'pending_approval', 'pending_auction', 'auction_rejected', 'rejected'));
    END IF;
END $$;

-- 2. Add Missing Columns (Safe to run)
ALTER TABLE artworks
ADD COLUMN IF NOT EXISTS desired_start_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS desired_end_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS reserve_price integer;

-- 3. Create Notifications System
create table if not exists notifications (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id text not null, 
  title text not null,
  message text not null,
  type text default 'info', 
  read boolean default false,
  link text
);

alter table notifications enable row level security;
-- Drop policy if exists to avoid error on rerun
drop policy if exists "Users can see their own notifications" on notifications;
create policy "Users can see their own notifications" on notifications
  for select using (auth.uid()::text = user_id);

-- 4. Create Newsletter System
create table if not exists newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text unique not null,
  active boolean default true
);

alter table newsletter_subscribers enable row level security;
drop policy if exists "Anyone can subscribe" on newsletter_subscribers;
create policy "Anyone can subscribe" on newsletter_subscribers
  for insert with check (true);
