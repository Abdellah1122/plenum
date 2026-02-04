-- Add auction preference columns to artworks table
ALTER TABLE artworks
ADD COLUMN IF NOT EXISTS desired_start_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS desired_end_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS reserve_price integer;

-- Update status check constraint to include new statuses
ALTER TABLE artworks DROP CONSTRAINT IF EXISTS artworks_status_check;
ALTER TABLE artworks ADD CONSTRAINT artworks_status_check 
  CHECK (status IN ('available', 'sold', 'auction', 'pending_approval', 'pending_auction', 'auction_rejected', 'rejected'));
