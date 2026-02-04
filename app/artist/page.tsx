'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/nextjs';
import ImageUpload from '@/components/image-upload';
import { useRouter } from 'next/navigation';
import { submitArtwork } from '@/actions/artist-actions';

export default function ArtistDashboard() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [artworks, setArtworks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // New Submission State
    const [newTitle, setNewTitle] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [newImageUrl, setNewImageUrl] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isLoaded && !user) {
            router.push('/');
            return;
        }
        if (isLoaded && user) fetchMyArtworks();
    }, [isLoaded, user]);

    async function fetchMyArtworks() {
        // NOTE: RLS will handle ensuring we only see our own art if the policy is correct
        // and if we have synced the user ID to 'profiles' table.
        // For now relying on client-side filter or the simple query
        const { data } = await supabase.from('artworks').select('*');
        // Ideally: .eq('artist_id', user.id) -- assumes profiles.id = user.id
        setArtworks(data || []);
        setLoading(false);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!newTitle || !newPrice || !newImageUrl) return;
        setSubmitting(true);

        const { error } = await supabase.from('artworks').insert({
            title: newTitle,
            artist: user?.fullName || 'Unknown Artist', // In real app, verify artist role
            artist_id: user?.id,
            price: parseFloat(newPrice),
            image_url: newImageUrl,
            status: 'pending_approval',
            year: new Date().getFullYear().toString(),
            category: 'Peinture' // TODO: Add select
        });

        if (!error) {
            setNewTitle(''); // Reset form
            setNewPrice('');
            setNewImageUrl('');
            fetchMyArtworks(); // Refresh
            alert('Artwork submitted for approval!');
        } else {
            alert('Error submitting: ' + error.message);
        }
        setSubmitting(false);
    }

    return (
        <>
            <Header />
            <main className="bg-background min-h-screen pt-32 pb-24">
                <div className="max-w-[1800px] mx-auto px-6 sm:px-12">
                    <h1 className="text-4xl font-heading mb-12">Artist Studio</h1>

                    <div className="grid md:grid-cols-2 gap-16">
                        {/* Submission Form */}
                        <div className="bg-card border border-border p-8 rounded-lg">
                            <h2 className="text-2xl font-bold mb-6">Submit New Work</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold uppercase tracking-widest mb-2">Title</label>
                                    <input
                                        className="w-full bg-background border border-border p-3 focus:border-secondary transition-colors outline-none"
                                        value={newTitle}
                                        onChange={e => setNewTitle(e.target.value)}
                                        placeholder="e.g. Sunset Boulevard"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold uppercase tracking-widest mb-2">Price (€)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-background border border-border p-3 focus:border-secondary transition-colors outline-none"
                                        value={newPrice}
                                        onChange={e => setNewPrice(e.target.value)}
                                        placeholder="5000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold uppercase tracking-widest mb-2">Image</label>
                                    <div className="border border-dashed border-border p-6 flex flex-col items-center justify-center gap-4">
                                        {newImageUrl ? (
                                            <img src={newImageUrl} className="max-h-48 object-contain" />
                                        ) : (
                                            <p className="text-sm text-muted-foreground">No image selected</p>
                                        )}
                                        <ImageUpload onUpload={setNewImageUrl} />
                                    </div>
                                </div>
                                <button
                                    disabled={submitting}
                                    className="w-full py-4 bg-primary text-white font-bold uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50"
                                >
                                    {submitting ? 'Submitting...' : 'Submit for Approval'}
                                </button>
                            </form>
                        </div>

                        {/* Submissions List */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6">My Submissions</h2>
                            <div className="space-y-4">
                                {loading ? <p>Loading...</p> : artworks.length === 0 ? <p className="text-muted-foreground">No submissions yet.</p> : artworks.map(art => (
                                    <div key={art.id} className="flex gap-4 p-4 border border-border rounded items-center bg-card">
                                        <div className="w-16 h-16 bg-muted shrink-0 overflow-hidden">
                                            {art.image_url && <img src={art.image_url} className="w-full h-full object-cover" />}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold">{art.title}</h3>
                                            <p className="text-sm text-muted-foreground">{art.price} €</p>
                                        </div>
                                        <div>
                                            <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded ${art.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                art.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {art.status?.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
