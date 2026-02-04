'use server';

import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAdmin = createClient(supabaseUrl!, serviceRoleKey!);

export async function submitArtwork(formData: {
    title: string;
    price: number;
    image_url: string;
    description?: string;
}) {
    const user = await currentUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    // Verify Artist Role
    // For now, let's allow anyone to submit if they are logged in, 
    // OR strictly check if role is 'artist'.
    // Let's implement the check for safety.
    const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single();

    // Allow 'artist' and 'admin' (for testing)
    if (!profile || !['artist', 'admin'].includes(profile.role)) {
        // For the prototype, maybe we relax this? 
        // User said "only if it won't affect normal use".
        // If a regular user tries to access /artist, they shouldn't be able to submit.
        return { success: false, error: 'Unauthorized: Artist role required.' };
    }

    const { error } = await supabaseAdmin.from('artworks').insert({
        title: formData.title,
        artist: profile.full_name || 'Unknown Artist',
        artist_id: user.id,
        price: formData.price,
        image_url: formData.image_url,
        status: 'pending_approval',
        year: new Date().getFullYear().toString(),
        category: 'Peinture' // Default
    });

    if (error) return { success: false, error: error.message };

    return { success: true };
}
