'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/nextjs';
import { placeBid } from '@/actions/bid-actions';

export default function ArtworkDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { user } = useUser();
    const [artwork, setArtwork] = useState<any>(null);
    const [auction, setAuction] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Bidding State
    const [bidAmount, setBidAmount] = useState('');
    const [placingBid, setPlacingBid] = useState(false);
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        fetchData();
    }, [id]);

    // Realtime Auction Updates
    useEffect(() => {
        if (!auction) return;

        const channel = supabase
            .channel(`auction_${auction.id}`)
            .on('postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'auctions', filter: `id=eq.${auction.id}` },
                (payload) => {
                    setAuction((prev: any) => ({ ...prev, ...payload.new }));
                }
            )
            .subscribe();

        // Timer
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const end = new Date(auction.end_time).getTime();
            const distance = end - now;

            if (distance < 0) {
                setTimeLeft('TERMINÉ');
            } else {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                const format = (n: number) => n < 10 ? `0${n}` : n;
                setTimeLeft(`${format(days)}:${format(hours)}:${format(minutes)}:${format(seconds)}`);
            }
        }, 1000);

        return () => {
            supabase.removeChannel(channel);
            clearInterval(timer);
        };
    }, [auction?.id]);

    async function fetchData() {
        // 1. Fetch Artwork
        const { data: art, error: artError } = await supabase
            .from('artworks')
            .select('*')
            .eq('id', id)
            .single();

        if (art) {
            setArtwork(art);
            // 2. Fetch Active/Latest Auction for this artwork
            const { data: auc } = await supabase
                .from('auctions')
                .select('*')
                .eq('artwork_id', id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();
            if (auc) setAuction(auc);
        }
        setLoading(false);
    }

    async function handleBid(e: React.FormEvent) {
        e.preventDefault();
        if (!auction || !bidAmount) return;
        setPlacingBid(true);

        const amount = parseFloat(bidAmount);
        const result = await placeBid(auction.id, amount);

        if (result.success) {
            setBidAmount('');
            alert('Enchère placée avec succès !');
        } else {
            alert('Erreur: ' + result.error);
        }
        setPlacingBid(false);
    }

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center">Chargement...</div>;
    if (!artwork) return <div className="min-h-screen bg-background flex items-center justify-center">Œuvre non trouvée</div>;

    const isAuction = artwork.status === 'auction' && auction;

    return (
        <>
            <Header />
            <main className="bg-background min-h-screen pt-32 pb-24">
                <div className="max-w-[1800px] mx-auto px-6 sm:px-12">
                    <div className="grid md:grid-cols-2 gap-16">

                        {/* Image Section */}
                        <div className="aspect-[4/5] bg-muted relative overflow-hidden group">
                            <div className="absolute inset-0 bg-primary/5" />
                            {artwork.image_url ? (
                                <img src={artwork.image_url} alt={artwork.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="font-heading text-9xl text-primary/10">{artwork.title[0]}</span>
                                </div>
                            )}

                            {/* Live Badge */}
                            {isAuction && timeLeft !== 'TERMINÉ' && (
                                <div className="absolute top-6 left-6 flex items-center gap-3 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg animate-pulse">
                                    <span className="w-2 h-2 bg-white rounded-full" />
                                    <span className="text-xs font-bold tracking-widest uppercase">En Direct</span>
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

                            {isAuction ? (
                                <div className="bg-card border border-border p-8 rounded-lg space-y-6">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Enchère Actuelle</p>
                                            <p className="text-5xl font-mono font-bold text-primary tabular-nums">{auction.current_bid} €</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Fin dans</p>
                                            <p className={`text-2xl font-mono font-bold tabular-nums ${timeLeft === 'TERMINÉ' ? 'text-red-500' : 'text-primary'}`}>{timeLeft}</p>
                                        </div>
                                    </div>

                                    {timeLeft !== 'TERMINÉ' && (
                                        <form onSubmit={handleBid} className="space-y-4 pt-4 border-t border-border/50">
                                            <div>
                                                <label className="block text-xs font-bold uppercase mb-2">Placer une offre (&gt; {auction.current_bid} €)</label>
                                                <div className="flex gap-4">
                                                    <input
                                                        type="number"
                                                        value={bidAmount}
                                                        onChange={e => setBidAmount(e.target.value)}
                                                        min={auction.current_bid + 1}
                                                        className="flex-1 bg-background border border-border p-4 font-mono text-lg focus:border-secondary transition-colors outline-none"
                                                        placeholder={(auction.current_bid + 50).toString()}
                                                    />
                                                    <button
                                                        disabled={placingBid}
                                                        className="px-8 bg-primary text-white font-bold uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50"
                                                    >
                                                        {placingBid ? '...' : 'Enchérir'}
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground text-center">
                                                En enchérissant, vous acceptez les conditions de vente de Plenum Arts.
                                            </p>
                                        </form>
                                    )}

                                    {timeLeft === 'TERMINÉ' && (
                                        <div className="p-4 bg-muted/30 text-center">
                                            <p className="font-bold uppercase tracking-widest">Enchère Terminée</p>
                                            <p className="text-sm text-muted-foreground mt-2">Gagnant final: {auction.current_bid} €</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex justify-between items-center">
                                    <span className="text-3xl font-light">{artwork.price.toLocaleString()} €</span>
                                    <span className="px-4 py-1 border border-primary text-xs uppercase tracking-widest">{artwork.status}</span>
                                </div>
                            )}

                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                <p>
                                    Cette œuvre unique ("{artwork.title}") créée en {artwork.year || '2024'} incarne la vision distinctive de l'artiste.
                                    Disponible exclusivement sur Plenum Arts.
                                </p>
                                <ul className="list-none space-y-2 text-sm mt-4">
                                    <li><strong>Catégorie:</strong> {artwork.category}</li>
                                    <li><strong>Année:</strong> {artwork.year}</li>
                                    <li><strong>Authenticité:</strong> Certificat inclus</li>
                                </ul>
                            </div>

                            {!isAuction && (
                                <div className="pt-8">
                                    <button className="w-full py-6 bg-primary text-primary-foreground text-sm font-bold tracking-[0.2em] hover:bg-primary/90 transition-all uppercase">
                                        Acquérir l'Œuvre
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
