-- Ensure profiles.id is compatible (it should be text or uuid depending on setup, but typically profiles.id matches user id)
-- We'll assume profiles.id is the Primary Key.

-- Add FK
ALTER TABLE bids 
ADD CONSTRAINT fk_bids_profiles 
FOREIGN KEY (bidder_id) REFERENCES profiles(id);

-- Check if auctions need it too for 'bidder_id' column
ALTER TABLE auctions
ADD CONSTRAINT fk_auctions_profile 
FOREIGN KEY (bidder_id) REFERENCES profiles(id);
