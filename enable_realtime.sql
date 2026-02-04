-- Add tables to the supabase_realtime publication
-- This is necessary for the client to receive 'postgres_changes' events
begin;
  -- Check if publication exists (it should by default)
  -- Add tables
  alter publication supabase_realtime add table auctions;
  alter publication supabase_realtime add table bids;
commit;
