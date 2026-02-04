'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { syncUserProfile } from '@/actions/sync-profile';

export function ProfileSync() {
    const { isLoaded, isSignedIn } = useUser();

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            // Call Server Action
            syncUserProfile().then(result => {
                if (!result.success) {
                    console.error('Profile Sync Failed:', result.error);
                }
            });
        }
    }, [isLoaded, isSignedIn]);

    return null;
}
