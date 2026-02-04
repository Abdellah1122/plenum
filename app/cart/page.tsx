'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useCart } from '@/context/cart-context';
import Link from 'next/link';

export default function CartPage() {
    const { items, removeFromCart, total, itemCount } = useCart();

    return (
        <>
            <Header />
            <main className="min-h-screen bg-background pt-32 pb-24 px-6 sm:px-12 max-w-[1800px] mx-auto">
                <h1 className="text-4xl md:text-5xl font-heading mb-12">Votre Panier</h1>

                {itemCount === 0 ? (
                    <div className="text-center py-24 border border-dashed border-border">
                        <h2 className="text-2xl font-light mb-6">Votre panier est vide</h2>
                        <Link
                            href="/marketplace"
                            className="px-8 py-3 bg-primary text-white text-xs font-bold tracking-[0.2em] hover:bg-primary/90 transition-colors inline-block"
                        >
                            PARCOURIR LA GALERIE
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-12 gap-16">
                        <div className="lg:col-span-8 space-y-8">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-6 p-6 border border-border items-start bg-card/50">
                                    {item.imageUrl && (
                                        <div className="w-24 h-24 bg-muted flex-shrink-0 relative overflow-hidden">
                                            {/* Using img for simplicity, next/image would require configuring domains if external */}
                                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-heading">{item.title}</h3>
                                            <p className="font-bold">{item.price} €</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-4">{item.details}</p>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-xs text-red-500 hover:text-red-700 underline tracking-wider uppercase"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-4">
                            <div className="bg-card p-8 border border-border sticky top-32">
                                <h3 className="text-xl font-heading mb-6">Résumé</h3>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Sous-total</span>
                                        <span>{total} €</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Livraison</span>
                                        <span>Calculé à l'étape suivante</span>
                                    </div>
                                    <div className="h-[1px] bg-border my-4" />
                                    <div className="flex justify-between text-xl font-bold">
                                        <span>Total</span>
                                        <span>{total} €</span>
                                    </div>
                                </div>
                                <button className="w-full py-4 bg-primary text-white text-xs font-bold tracking-[0.2em] hover:bg-primary/90 transition-colors uppercase">
                                    Procéder au paiement
                                </button>
                                <p className="text-xs text-center text-muted-foreground mt-4">
                                    Paiement sécurisé via Stripe
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
