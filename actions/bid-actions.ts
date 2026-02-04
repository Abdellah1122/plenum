'use server';

import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAdmin = createClient(supabaseUrl!, serviceRoleKey!);

async function createNotification(userId: string, title: string, message: string, type: 'info' | 'success' | 'warning' | 'error', link?: string) {
    await supabaseAdmin.from('notifications').insert({
        user_id: userId,
        title,
        message,
        type,
        read: false,
        link
    });
}

export async function placeBid(auctionId: string, amount: number) {
    const user = await currentUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    // 1. Fetch Auction & Verify
    const { data: auction, error: fetchError } = await supabaseAdmin
        .from('auctions')
        .select('*')
        .eq('id', auctionId)
        .single();

    if (fetchError || !auction) return { success: false, error: 'Auction not found' };

    // Check if active
    const now = new Date();
    if (new Date(auction.end_time) < now) return { success: false, error: 'Auction ended' };
    if (new Date(auction.start_time) > now) return { success: false, error: 'Auction not started' };

    // Check amount
    if (amount <= auction.current_bid) return { success: false, error: 'Bid must be higher than current price' };

    // 2. Insert Bid
    const { error: bidError } = await supabaseAdmin.from('bids').insert({
        auction_id: auctionId,
        bidder_id: user.id,
        amount: amount
    });

    if (bidError) return { success: false, error: bidError.message };

    // 3. Update Auction
    const previousBidderId = auction.bidder_id;
    await supabaseAdmin
        .from('auctions')
        .update({
            current_bid: amount,
            bidder_id: user.id
        })
        .eq('id', auctionId);

    // 4. Notifications
    // Notify Previous Bidder (Outbid)
    if (previousBidderId && previousBidderId !== user.id) {
        await createNotification(
            previousBidderId,
            'Surenchère !',
            `Une offre de ${amount}€ a été placée. Vous n'êtes plus le meilleur enchérisseur.`,
            'warning',
            `/marketplace` // Can't easily get artwork ID unless we join, simplifying for speed
        );
    }

    revalidatePath(`/marketplace`);
    return { success: true };
}
