-- Re-enable RLS to ensure security.
-- Our new implementation uses a Server Action (Admin Client) to insert data,
-- so it naturally bypasses RLS safely on the backend.
-- The RLS policies below ensure that CLIENTS (browsers) cannot write directly,
-- which makes the app STRONGER.

ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;

-- Ensure read access exists so users can see the gallery
-- (This might already exist, but running it again is safe or will just error if matched name)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'artworks' AND policyname = 'Public can view available artworks'
    ) THEN
        CREATE POLICY "Public can view available artworks" ON artworks FOR SELECT USING (true);
    END IF;
END $$;
