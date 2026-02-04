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

    const { error } = await supabaseAdmin
        .from('artworks')
        .update({ status })
        .eq('id', artworkId);

    if (error) return { success: false, error: error.message };

    // Log action
    const user = await currentUser();
    await supabaseAdmin.from('access_logs').insert({
        action: `artwork_${status}`,
        actor_id: user?.id,
        details: { artwork_id: artworkId }
    });

    return { success: true };
}
