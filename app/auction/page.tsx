'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Playfair_Display } from 'next/font/google';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

const playfair = Playfair_Display({ subsets: ['latin'] });

export default function AuctionPage() {
  const [featuredAuction, setFeaturedAuction] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [loading, setLoading] = useState(true);
  const [upcomingAuctions, setUpcomingAuctions] = useState<any[]>([]);

  useEffect(() => {
    fetchFeaturedAuction();
  }, []);

  useEffect(() => {
    if (!featuredAuction) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const targetDate = new Date(featuredAuction.status === 'active' ? featuredAuction.end_time : featuredAuction.start_time).getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        // Timer finished
        clearInterval(timer);
        fetchFeaturedAuction(); // Refresh to switch status (e.g. Upcoming -> Active)
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const format = (n: number) => n < 10 ? `0${n}` : n;
        setTimeLeft(`${format(days)}:${format(hours)}:${format(minutes)}:${format(seconds)}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [featuredAuction]);

  async function fetchFeaturedAuction() {
    const now = new Date().toISOString();

    // 1. Try to get ACTIVE auction (started but not ended)
    let { data: active } = await supabase
      .from('auctions')
      .select('*, artworks(*)')
      .lt('start_time', now)
      .gt('end_time', now)
      .order('end_time', { ascending: true })
      .limit(1)
      .single();

    if (active) {
      setFeaturedAuction({ ...active, status: 'active' });
    } else {
      // 2. If none active, get NEXT UPCOMING auction
      const { data: upcoming } = await supabase
        .from('auctions')
        .select('*, artworks(*)')
        .gt('start_time', now)
        .order('start_time', { ascending: true })
        .limit(1)
        .single();

      if (upcoming) {
        setFeaturedAuction({ ...upcoming, status: 'upcoming' });
      }
    }

    // 3. Fetch list of other upcoming auctions (excluding featured)
    // For simplicity just getting all upcoming
    const { data: others } = await supabase
      .from('auctions')
      .select('*, artworks(*)')
      .gt('start_time', now)
      .order('start_time', { ascending: true })
      .limit(6);

    if (others) setUpcomingAuctions(others.filter(a => a.id !== active?.id && a.id !== active?.id));

    setLoading(false);
  }

  return (
    <>
      <Header />
      <main className="bg-background min-h-screen">
        {/* Hero / Featured Auction */}
        <section className="relative h-[85vh] flex items-end pb-24 overflow-hidden">
          {/* Background Dynamic Image */}
          <div className="absolute inset-0 z-0 bg-neutral-900">
            {featuredAuction?.artworks?.image_url ? (
              <img
                src={featuredAuction.artworks.image_url}
                className="w-full h-full object-cover opacity-60"
                alt="Auction Hero"
              />
            ) : (
              <div className="w-full h-full bg-[#1a2c24]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-transparent" />
          </div>

          <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row justify-between items-end gap-12">
            <div className="max-w-2xl text-white">
              {featuredAuction ? (
                <>
                  <div className="flex items-center gap-3 mb-6 animate-pulse">
                    <div className={`w-3 h-3 rounded-full ${featuredAuction.status === 'active' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                    <span className="text-xs font-bold tracking-[0.2em] uppercase">
                      {featuredAuction.status === 'active' ? 'EN DIRECT' : 'PROCHAINEMENT'}
                    </span>
                  </div>

                  <h1 className="text-4xl md:text-6xl font-heading mb-4">
                    {featuredAuction.artworks.title}
                  </h1>
                  <p className="text-lg text-white/80 mb-8 max-w-lg">
                    Une œuvre exceptionnelle de {featuredAuction.artworks.artist}.
                    {featuredAuction.status === 'active' ? ' Enchérissez maintenant.' : ' Ne manquez pas le lancement.'}
                  </p>

                  <Link
                    href={`/marketplace/${featuredAuction.artwork_id}`}
                    className="inline-block bg-white text-black px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-white/90 transition-colors"
                  >
                    {featuredAuction.status === 'active' ? 'ENTRER DANS LA SALLE' : 'VOIR LE LOT'}
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 rounded-full bg-gray-500" />
                    <span className="text-xs font-bold tracking-[0.2em] uppercase">AUCUNE VENTE</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-heading mb-4">Prochainement</h1>
                  <p className="text-lg text-white/80 mb-8 max-w-lg">
                    Aucune enchère n&apos;est programmée pour le moment.
                  </p>
                </>
              )}
            </div>

            {featuredAuction && (
              <div className="text-right text-white">
                <p className="text-xs font-bold tracking-[0.2em] uppercase mb-2 opacity-70">
                  {featuredAuction.status === 'active' ? 'TEMPS RESTANT' : 'COMMENCE DANS'}
                </p>
                <div className="text-4xl md:text-6xl font-mono font-bold tracking-tighter tabular-nums">
                  {timeLeft}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Future Lots Section */}
        <section className="py-24 container mx-auto px-6">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-4">Calendrier</p>
          <h2 className={`text-5xl md:text-6xl font-heading mb-16 ${playfair.className}`}>Lots Futurs</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingAuctions.map((auction, i) => (
              <Link href={`/marketplace/${auction.artwork_id}`} key={auction.id} className="block">
                <div className="group cursor-pointer border-b border-border pb-8 hover:border-secondary transition-colors">
                  <div className="aspect-[4/3] bg-muted mb-6 relative overflow-hidden">
                    {auction.artworks?.image_url && (
                      <div className="absolute inset-0">
                        <img src={auction.artworks.image_url} alt={auction.artworks.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-heading mb-1">{auction.artworks?.title}</h3>
                      <p className="text-xs font-bold tracking-widest text-secondary uppercase">{auction.artworks?.artist}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Départ</p>
                      <p className="font-bold text-lg">{new Date(auction.start_time).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
