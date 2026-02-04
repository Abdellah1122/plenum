-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  email text UNIQUE NOT NULL,
  active boolean DEFAULT true
);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow ANYONE (including anonymous) to insert
DROP POLICY IF EXISTS "Anyone can subscribe" ON newsletter_subscribers;
CREATE POLICY "Anyone can subscribe" 
ON newsletter_subscribers FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow admins to read
-- Correcting for Clerk IDs (text) using auth.jwt() ->> 'sub'
DROP POLICY IF EXISTS "Admins can view subscribers" ON newsletter_subscribers;
CREATE POLICY "Admins can view subscribers" 
ON newsletter_subscribers FOR SELECT 
TO authenticated 
USING ( 
    (select auth.jwt() ->> 'role') = 'admin' 
    OR 
    (select role from profiles where id = (select auth.jwt() ->> 'sub')) = 'admin'
); 
