'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AccountPage() {
    const { user } = useUser();
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        // In real app, fetch orders and bids
        // For now, let's just fetch notifications if we had them or simple profile data
    }, []);

    return (
        <>
            <Header />
            <main className="bg-background min-h-screen pt-32 pb-24">
                <div className="max-w-[1200px] mx-auto px-6 sm:px-12">
                    <div className="flex justify-between items-center mb-12">
                        <h1 className="text-4xl font-heading">Mon Compte</h1>
                        <SignOutButton>
                            <button className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-600">Déconnexion</button>
                        </SignOutButton>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="md:col-span-1 space-y-8">
                            <div className="p-6 border border-border rounded bg-card">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-full bg-secondary/10 overflow-hidden">
                                        <img src={user?.imageUrl} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-bold">{user?.fullName}</p>
                                        <p className="text-sm text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
                                    </div>
                                </div>
                                <button className="w-full py-2 border border-border text-xs uppercase tracking-widest hover:bg-muted transition-colors">
                                    Modifier le Profil
                                </button>
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-12">
                            <section>
                                <h2 className="text-xl font-bold mb-6 border-b border-border pb-2">Mes Commandes</h2>
                                <div className="text-center py-12 bg-muted/20 rounded">
                                    <p className="text-muted-foreground">Aucune commande récente.</p>
                                    <button className="mt-4 text-xs font-bold text-primary uppercase tracking-widest hover:underline">Découvrir la Galerie</button>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-6 border-b border-border pb-2">Mes Enchères</h2>
                                <div className="text-center py-12 bg-muted/20 rounded">
                                    <p className="text-muted-foreground">Vous ne participez à aucune enchère.</p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-6 border-b border-border pb-2">Notifications</h2>
                                <div className="space-y-4">
                                    {/* Mock Notifications */}
                                    <div className="p-4 bg-background border border-border rounded flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-sm mb-1">Bienvenue sur Plenum</p>
                                            <p className="text-sm text-muted-foreground">Votre compte a été créé avec succès.</p>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground">Il y a 2j</span>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
