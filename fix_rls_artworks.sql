-- Enable RLS on artworks if not already
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;

-- 1. Allow Artists to INSERT their own artworks
-- We assume the user is authenticated.
-- The check ensures the `artist_id` column matches the authenticated user's ID.
DROP POLICY IF EXISTS "Artists can insert their own artworks" ON artworks;
CREATE POLICY "Artists can insert their own artworks" ON artworks
FOR INSERT 
TO authenticated
WITH CHECK (
    auth.uid()::text = artist_id
);

-- 2. Allow Artists to UPDATE their own artworks
DROP POLICY IF EXISTS "Artists can update their own artworks" ON artworks;
CREATE POLICY "Artists can update their own artworks" ON artworks
FOR UPDATE
TO authenticated
USING (auth.uid()::text = artist_id)
WITH CHECK (auth.uid()::text = artist_id);

-- 3. Allow Artists to DELETE their own artworks
DROP POLICY IF EXISTS "Artists can delete their own artworks" ON artworks;
CREATE POLICY "Artists can delete their own artworks" ON artworks
FOR DELETE
TO authenticated
USING (auth.uid()::text = artist_id);

-- 4. Allow Public to SELECT (View) artworks
-- This might already exist, but good to ensure.
DROP POLICY IF EXISTS "Public can view available artworks" ON artworks;
CREATE POLICY "Public can view available artworks" ON artworks
FOR SELECT
USING (true);
