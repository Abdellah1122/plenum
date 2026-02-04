'use server';

import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Admin Client
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAdmin = createClient(supabaseUrl!, serviceRoleKey!);

async function verifyAdmin() {
    const user = await currentUser();
    if (!user) return false;

    // Check role in DB
    const { data } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    return data?.role === 'admin';
}

export async function approveArtwork(artworkId: string, approved: boolean) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        return { success: false, error: 'Unauthorized: Admin access required.' };
    }

    const status = approved ? 'approved' : 'rejected';

    const { data: artwork, error } = await supabaseAdmin
        .from('artworks')
        .update({ status })
        .eq('id', artworkId)
        .select('artist_id, title')
        .single();

    if (error) return { success: false, error: error.message };

    // Notify Artist
    if (artwork?.artist_id) {
        await createNotification(
            artwork.artist_id,
            approved ? 'Œuvre Approuvée' : 'Œuvre Rejetée',
            approved ? `Votre œuvre "${artwork.title}" est maintenant en ligne.` : `Votre œuvre "${artwork.title}" a été rejetée.`,
            approved ? 'success' : 'error',
            '/artist'
        );
    }

    // Log action
    const user = await currentUser();
    await supabaseAdmin.from('access_logs').insert({
        action: `artwork_${status}`,
        actor_id: user?.id,
        details: { artwork_id: artworkId }
    });

    return { success: true };
}

// Helper to Create Notification
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

export async function scheduleAuction(auctionData: {
    artworkId: string;
    startPrice: number;
    startTime: string;
    endTime: string;
}) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        return { success: false, error: 'Unauthorized: Admin access required.' };
    }

    // 1. Create Auction
    const { error: auctionError } = await supabaseAdmin.from('auctions').insert({
        artwork_id: auctionData.artworkId,
        start_price: auctionData.startPrice,
        current_bid: auctionData.startPrice,
        start_time: auctionData.startTime,
        end_time: auctionData.endTime
    });

    if (auctionError) return { success: false, error: 'Auction Error: ' + auctionError.message };

    // 2. Update Artwork Status & Get Artist ID
    const { data: artwork, error: artworkError } = await supabaseAdmin
        .from('artworks')
        .update({ status: 'auction' })
        .eq('id', auctionData.artworkId)
        .select('artist_id, title')
        .single();

    if (artworkError) return { success: false, error: 'Artwork Update Error: ' + artworkError.message };

    // 3. Notify Artist
    if (artwork?.artist_id) {
        await createNotification(
            artwork.artist_id,
            'Enchère Programmée',
            `Votre œuvre "${artwork.title}" a été programmée pour une enchère.`,
            'success',
            '/artist'
        );
    }

    return { success: true };
}

export async function rejectAuction(artworkId: string) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return { success: false, error: 'Unauthorized' };

    const { data: artwork, error } = await supabaseAdmin
        .from('artworks')
        .update({ status: 'auction_rejected' })
        .eq('id', artworkId)
        .select('artist_id, title')
        .single();

    if (error) return { success: false, error: error.message };

    // Notify Artist
    if (artwork?.artist_id) {
        await createNotification(
            artwork.artist_id,
            'Demande d\'enchère rejetée',
            `Votre demande d'enchère pour "${artwork.title}" a été refusée.`,
            'error',
            '/artist'
        );
    }

    return { success: true };
}
