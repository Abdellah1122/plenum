'use server';

import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

export async function syncUserProfile() {
    const user = await currentUser();

    if (!user) {
        return { success: false, error: 'Not authenticated' };
    }

    // Use Service Role Key to bypass RLS
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!serviceRoleKey || !supabaseUrl) {
        console.error('Missing Supabase Service Key');
        return { success: false, error: 'Server configuration error' };
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Sync Profile
    const { error } = await supabaseAdmin.from('profiles').upsert({
        id: user.id, // Clerk ID (text) matches our new schema
        email: user.emailAddresses[0]?.emailAddress,
        username: user.username || 'User',
        full_name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        avatar_url: user.imageUrl,
        updated_at: new Date().toISOString()
    }, { onConflict: 'id' });

    if (error) {
        console.error('Supabase Sync Error:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}
