'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export default function ArtworkDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [artwork, setArtwork] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchArtwork() {
            if (!id) return;

            const { data, error } = await supabase
                .from('artworks')
                .select('*')
                .eq('id', id)
                .single();

            if (data) {
                setArtwork(data);
            } else {
                console.error(error);
            }
            setLoading(false);
        }
        fetchArtwork();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
    if (!artwork) return <div className="min-h-screen bg-background flex items-center justify-center">Artwork Not Found</div>;

    return (
        <>
            <Header />
            <main className="bg-background min-h-screen pt-32 pb-24">
                <div className="max-w-[1800px] mx-auto px-6 sm:px-12">
                    <div className="grid md:grid-cols-2 gap-16">

                        {/* Image Section */}
                        <div className="aspect-[4/5] bg-muted relative overflow-hidden">
                            <div className="absolute inset-0 bg-primary/5" />
                            {artwork.image_url ? (
                                <img src={artwork.image_url} alt={artwork.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="font-heading text-9xl text-primary/10">{artwork.title[0]}</span>
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="space-y-8">
                            <div>
                                <p className="text-sm font-bold tracking-[0.2em] text-secondary uppercase mb-2">{artwork.artist}</p>
                                <h1 className="text-5xl md:text-6xl font-heading text-primary leading-tight">{artwork.title}</h1>
                            </div>

                            <div className="h-[1px] w-full bg-border" />

                            <div className="flex justify-between items-center">
                                <span className="text-3xl font-light">{artwork.price.toLocaleString()} €</span>
                                <span className="px-4 py-1 border border-primary text-xs uppercase tracking-widest">{artwork.status}</span>
                            </div>

                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                <p>
                                    Cette œuvre unique ("{artwork.title}") créée en {artwork.year || '2024'} incarne la vision distinctive de l'artiste.
                                    Disponible exclusivement sur Plenum Qrts.
                                </p>
                                <ul className="list-none space-y-2 text-sm mt-4">
                                    <li><strong>Catégorie:</strong> {artwork.category}</li>
                                    <li><strong>Année:</strong> {artwork.year}</li>
                                    <li><strong>Authenticité:</strong> Certificat inclus</li>
                                </ul>
                            </div>

                            <div className="pt-8">
                                <button className="w-full py-6 bg-primary text-primary-foreground text-sm font-bold tracking-[0.2em] hover:bg-primary/90 transition-all uppercase">
                                    Acquérir l'Œuvre
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
