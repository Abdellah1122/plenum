-- 1. Create Bids Table
CREATE TABLE IF NOT EXISTS bids (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    auction_id uuid REFERENCES auctions(id) NOT NULL,
    bidder_id text NOT NULL, -- Clerk User ID
    amount numeric NOT NULL
);

-- 2. Add current_bid tracking to auctions if not exists
ALTER TABLE auctions 
ADD COLUMN IF NOT EXISTS current_bid numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS bidder_id text; -- Last bidder

-- 3. Enable RLS
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Public read access for bids (to show history)
DROP POLICY IF EXISTS "Public can view bids" ON bids;
CREATE POLICY "Public can view bids" ON bids FOR SELECT TO public USING (true);

-- Authenticated users capture via Server Action (Service Role), so generic insert policy isn't strictly needed for client, 
-- but if we use client-side logic later:
DROP POLICY IF EXISTS "Users can place bids" ON bids;
CREATE POLICY "Users can place bids" ON bids FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = bidder_id);
