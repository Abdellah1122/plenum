import { supabase } from "@/lib/supabase";

export type UserRole = 'admin' | 'artist' | 'user' | 'collector';

export async function getUserRole(userId: string): Promise<UserRole | null> {
    if (!userId) return null;

    const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

    if (error || !data) {
        console.error('Error fetching role:', error);
        return null;
    }

    return data.role as UserRole;
}

export async function isAdmin(userId: string) {
    const role = await getUserRole(userId);
    return role === 'admin';
}

export async function isArtist(userId: string) {
    const role = await getUserRole(userId);
    return role === 'artist';
}
