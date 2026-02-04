'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useEffect, useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/cart-context';

function ConfiguratorContent() {
    const searchParams = useSearchParams();
    const { addToCart } = useCart();
    const initialMaterial = searchParams.get('material') || 'paper';

    const [material, setMaterial] = useState(initialMaterial);
    const [artworks, setArtworks] = useState<any[]>([]);
    const [selectedArt, setSelectedArt] = useState<any>(null);
    const [size, setSize] = useState('m');

    const materials = {
        paper: { name: 'Tirage d’Art', basePrice: 50 },
        canvas: { name: 'Toile tendue', basePrice: 100 },
        metal: { name: 'Métal Chromaluxe', basePrice: 150 }
    };

    const sizes = {
        s: { label: '30x40 cm', multiplier: 1 },
        m: { label: '50x70 cm', multiplier: 1.5 },
        l: { label: '70x100 cm', multiplier: 2.2 },
        xl: { label: '100x150 cm', multiplier: 3.5 }
    };

    useEffect(() => {
        async function fetchArt() {
            const { data } = await supabase.from('artworks').select('*').eq('status', 'approved');
            setArtworks(data || []);
        }
        fetchArt();
    }, []);

    const currentPrice = selectedArt
        ? Math.round(materials[material as keyof typeof materials].basePrice * sizes[size as keyof typeof sizes].multiplier)
        : 0;

    return (
        <div className="grid lg:grid-cols-2 gap-12 min-h-[60vh]">
            {/* Left: Preview / Selection */}
            <div className="space-y-8">
                <div>
                    <h2 className="text-xl font-bold mb-4">1. Choisissez une Œuvre</h2>
                    <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
                        {gameArtworks(artworks).map(art => (
                            <div
                                key={art.id}
                                onClick={() => setSelectedArt(art)}
                                className={`aspect-[3/4] bg-muted cursor-pointer border-2 transition-all ${selectedArt?.id === art.id ? 'border-primary' : 'border-transparent hover:border-border'
                                    }`}
                            >
                                {art.image_url ? (
                                    <img src={art.image_url} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground p-2 text-center">
                                        {art.title}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Configuration */}
            <div className="bg-card border border-border p-8 rounded-lg h-fit sticky top-32">
                <h2 className="text-2xl font-heading mb-6">Configuration</h2>

                {/* Material */}
                <div className="mb-8">
                    <label className="block text-xs font-bold uppercase tracking-widest mb-3">Support</label>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(materials).map(([key, info]) => (
                            <button
                                key={key}
                                onClick={() => setMaterial(key)}
                                className={`px-4 py-2 text-sm border transition-all ${material === key ? 'bg-primary text-primary-foreground border-primary' : 'hover:border-primary'
                                    }`}
                            >
                                {info.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Size */}
                <div className="mb-8">
                    <label className="block text-xs font-bold uppercase tracking-widest mb-3">Format</label>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.entries(sizes).map(([key, info]) => (
                            <button
                                key={key}
                                onClick={() => setSize(key)}
                                className={`px-4 py-3 text-sm border text-left flex justify-between transition-all ${size === key ? 'bg-primary text-primary-foreground border-primary' : 'hover:border-primary'
                                    }`}
                            >
                                <span>{info.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Summary */}
                <div className="border-t border-border pt-6 mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-muted-foreground">Œuvre</span>
                        <span className="font-bold text-right truncate w-40">{selectedArt?.title || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center text-2xl font-bold mt-4">
                        <span>Total (Est.)</span>
                        <span>{currentPrice} €</span>
                    </div>
                </div>

                <button
                    className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!selectedArt}
                    onClick={() => {
                        addToCart({
                            id: Date.now().toString(),
                            artworkId: selectedArt.id,
                            title: selectedArt.title,
                            imageUrl: selectedArt.image_url,
                            price: currentPrice,
                            details: `${materials[material as keyof typeof materials].name} (${sizes[size as keyof typeof sizes].label})`
                        });
                        alert('Ajouté au panier !');
                    }}
                >
                    {selectedArt ? 'Ajouter au Panier' : 'Sélectionnez une œuvre'}
                </button>
            </div>
        </div >
    );
}

// Helper to handle empty art scenarios or filter
function gameArtworks(list: any[]) {
    if (!list || list.length === 0) {
        return Array.from({ length: 6 }).map((_, i) => ({
            id: `mock-${i}`,
            title: 'Exemple'
        }));
    }
    return list;
}

export default function ConfiguratorPage() {
    return (
        <>
            <Header />
            <main className="bg-background min-h-screen pt-32 pb-24">
                <div className="max-w-[1800px] mx-auto px-6 sm:px-12">
                    <h1 className="text-4xl font-heading mb-12">Personnaliser votre Édition</h1>
                    <Suspense fallback={<div>Chargement...</div>}>
                        <ConfiguratorContent />
                    </Suspense>
                </div>
            </main>
            <Footer />
        </>
    );
}
