'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar, Check, X, Clock } from 'lucide-react';
import { scheduleAuction, rejectAuction } from '@/actions/admin-actions';

export default function AdminAuctions() {
    const [pendingAuctions, setPendingAuctions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Scheduling State
    const [selectedArtwork, setSelectedArtwork] = useState<any>(null);
    const [scheduleStart, setScheduleStart] = useState('');
    const [scheduleEnd, setScheduleEnd] = useState('');

    useEffect(() => {
        fetchPendingAuctions();
    }, []);

    async function fetchPendingAuctions() {
        // Fetch artworks requesting auction status
        const { data } = await supabase
            .from('artworks')
            .select('*')
            .eq('status', 'pending_auction')
            .order('created_at', { ascending: false });

        setPendingAuctions(data || []);
        setLoading(false);
    }

    async function handleApprove() {
        if (!selectedArtwork || !scheduleStart || !scheduleEnd) return;

        const result = await scheduleAuction({
            artworkId: selectedArtwork.id,
            startPrice: selectedArtwork.price,
            startTime: new Date(scheduleStart).toISOString(),
            endTime: new Date(scheduleEnd).toISOString()
        });

        if (!result.success) {
            alert('Error: ' + result.error);
        } else {
            alert('Auction scheduled successfully!');
            setSelectedArtwork(null);
            fetchPendingAuctions();
        }
    }

    async function handleReject(id: string) {
        if (!confirm('Are you sure you want to reject this auction request?')) return;

        const result = await rejectAuction(id);

        if (!result.success) {
            alert('Error: ' + result.error);
        } else {
            fetchPendingAuctions();
        }
    }

    return (
        <>
            <Header />
            <main className="bg-background min-h-screen pt-32 pb-24">
                <div className="max-w-[1800px] mx-auto px-6 sm:px-12">
                    <h1 className="text-4xl font-heading mb-12 text-primary">Auction Scheduler</h1>

                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* List Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <h2 className="text-xl font-bold uppercase tracking-widest mb-6">Pending Requests</h2>

                            {loading ? <p>Loading...</p> : pendingAuctions.length === 0 ? (
                                <p className="text-muted-foreground italic">No pending auction requests.</p>
                            ) : (
                                pendingAuctions.map(item => (
                                    <div key={item.id} className={`bg-card border p-6 flex gap-6 items-start transition-all ${selectedArtwork?.id === item.id ? 'border-primary ring-1 ring-primary' : 'border-border'}`}>
                                        <div className="w-24 h-24 bg-muted shrink-0">
                                            {item.image_url && <img src={item.image_url} className="w-full h-full object-cover" />}
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-heading text-xl">{item.title}</h3>
                                                    <p className="text-sm font-bold text-secondary uppercase tracking-wider">{item.artist}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-mono font-bold">{item.price} €</p>
                                                    {item.reserve_price && <p className="text-xs text-muted-foreground">Res: {item.reserve_price}€</p>}
                                                </div>
                                            </div>

                                            <div className="mt-4 flex gap-8 text-sm text-foreground/80">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-primary" />
                                                    <span>Pref: {item.desired_start_date || 'None'}</span>
                                                </div>
                                            </div>

                                            <div className="mt-6 flex gap-4">
                                                <button
                                                    onClick={() => {
                                                        setSelectedArtwork(item);
                                                        // Pre-fill dates if helpful
                                                        if (item.desired_start_date) setScheduleStart(item.desired_start_date.split('T')[0]);
                                                        if (item.desired_end_date) setScheduleEnd(item.desired_end_date.split('T')[0]);
                                                    }}
                                                    className="px-4 py-2 bg-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-primary/90"
                                                >
                                                    Select to Schedule
                                                </button>
                                                <button
                                                    onClick={() => handleReject(item.id)}
                                                    className="px-4 py-2 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-widest hover:bg-red-50"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Action Column */}
                        <div className="bg-muted/30 border border-border p-8 h-fit sticky top-32">
                            <h2 className="text-xl font-bold uppercase tracking-widest mb-6">Schedule Auction</h2>
                            {selectedArtwork ? (
                                <div className="space-y-6">
                                    <div className="pb-4 border-b border-border">
                                        <p className="text-xs text-muted-foreground uppercase mb-1">Selected Item</p>
                                        <p className="font-heading text-lg">{selectedArtwork.title}</p>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase mb-2">Start Date/Time</label>
                                        <input
                                            type="datetime-local"
                                            className="w-full bg-background border border-border p-2 text-sm"
                                            value={scheduleStart}
                                            onChange={e => setScheduleStart(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase mb-2">End Date/Time</label>
                                        <input
                                            type="datetime-local"
                                            className="w-full bg-background border border-border p-2 text-sm"
                                            value={scheduleEnd}
                                            onChange={e => setScheduleEnd(e.target.value)}
                                        />
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            onClick={handleApprove}
                                            className="w-full py-4 bg-green-600 text-white font-bold uppercase tracking-widest hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Clock className="w-4 h-4" />
                                            Confirm Schedule
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    <p>Select an item from the list to schedule.</p>
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
