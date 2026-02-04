-- DEV MODE: Disable RLS on artworks to unblock testing
-- This removes the security checks temporarily.

ALTER TABLE artworks DISABLE ROW LEVEL SECURITY;

-- Alternatively, if you want to keep RLS enabled but allow all inserts:
-- DROP POLICY IF EXISTS "Artists can insert their own artworks" ON artworks;
-- CREATE POLICY "Allow all inserts" ON artworks FOR INSERT WITH CHECK (true);
