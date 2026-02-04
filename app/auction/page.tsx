'use client';

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Auction() {
  const [auctions, setAuctions] = useState<any[]>([])

  useEffect(() => {
    async function fetchAuctions() {
      // Fetch artworks where status is 'auction' or from auctions table
      // simplified for now: fetching artworks with status='available' (mocking auction items)
      // or effectively using the 'artworks' table for now to populate.
      const { data } = await supabase.from('artworks').select('*').limit(6)
      if (data) setAuctions(data)
    }
    fetchAuctions()
  }, [])

  return (
    <>
      <Header />
      <main className="bg-background min-h-screen pt-32 pb-24">

        {/* Live Auction Hero */}
        <section className="px-6 sm:px-12 max-w-[1800px] mx-auto mb-32">
          {/* ... Hero Content ... */}
          <div className="relative aspect-[16/9] md:aspect-[2.4/1] bg-primary overflow-hidden group">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-700" />
            <div className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center gap-4">
              <span className="animate-pulse w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-white text-xs font-bold tracking-[0.2em] uppercase">En Direct</span>
            </div>

            <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 text-white max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-heading mb-4">La Collection d'Automne</h1>
              <p className="text-white/80 font-light text-lg mb-8">Mettant en vedette des pièces rares du milieu du siècle et des sculptures contemporaines.</p>
              <button className="px-8 py-4 bg-white text-primary text-xs font-bold tracking-[0.2em] hover:bg-secondary hover:text-white transition-colors">
                ENTRER DANS LA SALLE
              </button>
            </div>

            <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 text-right hidden md:block">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/60 mb-2">Temps Restant</p>
              <p className="text-4xl font-mono text-white">02:14:58</p>
            </div>
          </div>
        </section>

        {/* Upcoming Lots */}
        <section className="max-w-[1800px] mx-auto px-6 sm:px-12">
          <div className="flex justify-between items-end mb-16">
            <div>
              <p className="text-secondary font-bold tracking-[0.2em] uppercase mb-4 text-xs">Prochainement</p>
              <h2 className="text-5xl md:text-7xl font-heading font-medium text-primary">Lots Futurs</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {auctions.map((item, i) => (
              <Link href={`/marketplace/${item.id}`} key={item.id} className="block">
                <div className="group cursor-pointer border-b border-border pb-8 hover:border-secondary transition-colors">
                  <div className="aspect-[4/3] bg-muted mb-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 transition-colors duration-500" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 text-xs font-bold tracking-widest text-primary">
                      LOT {i + 1 < 10 ? `00${i + 1}` : `0${i + 1}`}
                    </div>
                  </div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-heading mb-1">{item.title}</h3>
                      <p className="text-xs font-bold tracking-widest text-secondary uppercase">{item.artist}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <p className="text-muted-foreground">Est. {item.price} €</p>
                    <p className="text-primary font-bold tracking-widest uppercase text-xs group-hover:text-secondary transition-colors">S'inscrire</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
