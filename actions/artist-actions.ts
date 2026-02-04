'use server';

import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAdmin = createClient(supabaseUrl!, serviceRoleKey!);

type ArtworkSubmission = {
    title: string;
    price: number;
    image_url: string;
    category: string;
    sellingMethod: 'fixed' | 'auction';
    // Auction fields
    reservePrice?: number;
    desiredStartDate?: string;
    desiredEndDate?: string;
}

export async function submitArtwork(formData: ArtworkSubmission) {
    const user = await currentUser();
    if (!user) return { success: false, error: 'Unauthorized: Please login.' };

    // 1. Verify Artist Role
    const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single();

    if (!profile) {
        return { success: false, error: 'Profile not found. Please complete onboarding.' };
    }

    // Strict role check: must be artist or admin
    if (!['artist', 'admin'].includes(profile.role)) {
        return { success: false, error: 'Unauthorized: Artist role required.' };
    }

    const status = formData.sellingMethod === 'auction' ? 'pending_auction' : 'pending_approval';

    // 2. AdminInsert artwork (Bypasses RLS)
    const { error } = await supabaseAdmin.from('artworks').insert({
        title: formData.title,
        artist: profile.full_name || 'Unknown Artist',
        artist_id: user.id,
        price: formData.price,
        image_url: formData.image_url,
        status: status,
        year: new Date().getFullYear().toString(),
        category: formData.category,
        reserve_price: formData.sellingMethod === 'auction' && formData.reservePrice ? formData.reservePrice : null,
        desired_start_date: formData.sellingMethod === 'auction' ? formData.desiredStartDate : null,
        desired_end_date: formData.sellingMethod === 'auction' ? formData.desiredEndDate : null,
    });

    if (error) {
        console.error('Server Action Error:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}
