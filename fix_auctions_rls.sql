-- Enable RLS on auctions table if not already
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;

-- Allow public read access to auctions
DROP POLICY IF EXISTS "Public can view auctions" ON auctions;
CREATE POLICY "Public can view auctions" 
ON auctions FOR SELECT 
TO public 
USING (true);

-- Allow authenticated users (admins) to insert/update/delete (or rely on service role which bypasses RLS)
-- Ideally strictly admins, but for now authenticated is better than nothing if service role is used properly.
-- The app uses Service Role for admin actions, so we mainly need read access here.

-- Ensure artworks table is also readable (already done, but good to be safe)
DROP POLICY IF EXISTS "Public can view artworks" ON artworks;
CREATE POLICY "Public can view artworks" 
ON artworks FOR SELECT 
TO public 
USING (true);
