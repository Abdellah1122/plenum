-- Enable RLS on notifications table
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own notifications
-- We use auth.jwt() ->> 'sub' because auth.uid() returns a UUID, but Clerk IDs are text (e.g., 'user_2...')
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" 
ON notifications FOR SELECT 
TO authenticated 
USING ( (select auth.jwt() ->> 'sub') = user_id );

-- Allow users to update their own notifications (mark as read)
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" 
ON notifications FOR UPDATE 
TO authenticated 
USING ( (select auth.jwt() ->> 'sub') = user_id );

-- Explicit Allow for Service Role (if needed, though usually automatic)
-- Note: Service role (admin) execution bypasses RLS, so inserts from server actions will work.
