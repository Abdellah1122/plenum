'use server';

import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAdmin = createClient(supabaseUrl!, serviceRoleKey!);

async function verifyAdmin() {
    const user = await currentUser();
    if (!user) return false;

    // Direct DB check bypassing RLS
    const { data } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single();
    return data?.role === 'admin';
}

export async function getAdminData(type: 'validation' | 'users' | 'logs') {
    if (!await verifyAdmin()) return { error: 'Unauthorized' };

    if (type === 'validation') {
        const { data, error } = await supabaseAdmin
            .from('artworks')
            .select('*, profiles(username)')
            .eq('status', 'pending_approval');
        return { data, error: error?.message };
    }

    if (type === 'users') {
        const { data, error } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .order('updated_at', { ascending: false });
        return { data, error: error?.message };
    }

    if (type === 'logs') {
        // join actor_id to profiles to get names? Not strictly necessary but nice.
        const { data, error } = await supabaseAdmin
            .from('access_logs')
            .select('*')
            .order('timestamp', { ascending: false })
            .limit(50);
        return { data, error: error?.message };
    }

    return { data: [], error: null };
}

export async function updateUserRole(userId: string, newRole: 'admin' | 'artist' | 'user' | 'collector') {
    if (!await verifyAdmin()) return { success: false, error: 'Unauthorized' };

    const { error } = await supabaseAdmin
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

    if (error) return { success: false, error: error.message };
    return { success: true };
}
