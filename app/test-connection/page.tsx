'use client'

import { useUser, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import ImageUpload from "@/components/image-upload";

export default function TestConnectionPage() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [supabaseStatus, setSupabaseStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [supabaseMessage, setSupabaseMessage] = useState('');
    const [uploadedImage, setUploadedImage] = useState('');

    useEffect(() => {
        async function checkSupabase() {
            try {
                // Just check if we can connect, even if table doesn't exist or is empty
                const { error, status } = await supabase.from('profiles').select('*').limit(1);

                if (error && status !== 406) {
                    // 406 Not Acceptable is often returned if no rows match but connection is fine? 
                    // actually standard select returns 200 usually.
                    // If table doesn't exist, it definitely returns error.
                    throw error;
                }

                setSupabaseStatus('success');
                setSupabaseMessage('Connected to Supabase successfully.');
            } catch (err: any) {
                setSupabaseStatus('error');
                setSupabaseMessage(err.message || 'Failed to connect to Supabase');
                console.error(err);
            }
        }

        checkSupabase();
    }, []);

    return (
        <div className="p-10 max-w-2xl mx-auto space-y-8 font-sans">
            <h1 className="text-3xl font-bold">System Connection Logic</h1>

            <div className="p-6 border rounded-lg space-y-4">
                <h2 className="text-xl font-semibold">1. Clerk Authentication</h2>
                <div>
                    <p><strong>Status:</strong> {isLoaded ? 'Loaded' : 'Loading...'}</p>
                    <p><strong>Signed In:</strong> {isSignedIn ? 'Yes' : 'No'}</p>
                    {isSignedIn && (
                        <div className="mt-2 p-4 bg-secondary/10 rounded">
                            <p>User ID: {user.id}</p>
                            <p>Email: {user.primaryEmailAddress?.emailAddress}</p>
                        </div>
                    )}
                </div>
                <div className="flex gap-4 items-center">
                    <UserButton afterSignOutUrl="/test-connection" />
                    {!isSignedIn && <p className="text-sm text-muted-foreground">(Sign in using the button above to test full flow)</p>}
                </div>
            </div>

            <div className="p-6 border rounded-lg space-y-4">
                <h2 className="text-xl font-semibold">2. Supabase Database</h2>
                <div className={`p-4 rounded ${supabaseStatus === 'success' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' : supabaseStatus === 'error' ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300' : 'bg-gray-100'}`}>
                    <p><strong>Connection Status:</strong> {supabaseStatus.toUpperCase()}</p>
                    <p className="text-sm mt-1">{supabaseMessage}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                    Note: If this errors with "relation 'profiles' does not exist", please run the SQL script provided.
                </p>
            </div>

            <div className="p-6 border rounded-lg space-y-4">
                <h2 className="text-xl font-semibold">3. Cloudinary Upload</h2>
                <div className="flex flex-col gap-4">
                    <ImageUpload onUpload={(url) => setUploadedImage(url)} />
                    {uploadedImage && (
                        <div className="mt-4">
                            <p className="text-sm font-bold text-green-600 mb-2">Upload Success!</p>
                            <img src={uploadedImage} alt="Uploaded" className="max-w-[200px] h-auto rounded border" />
                            <p className="text-xs text-muted-foreground break-all mt-2">{uploadedImage}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
