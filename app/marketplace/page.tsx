'use client';

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Marketplace() {
  /* 
  // OLD MOCK DATA - REMOVED
  const artworks = Array.from({ length: 12 }, (_, i) => ({ ... })) 
  */

  const [artworks, setArtworks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchArtworks() {
      const { data, error } = await supabase.from('artworks').select('*')
      if (data) {
        setArtworks(data)
      } else {
        console.error(error)
        // Fallback to empty or error state
      }
      setLoading(false)
    }
    fetchArtworks()
  }, [])

  return (
    <>
      <Header />
      <main className="bg-background min-h-screen pt-32 pb-24">

        {/* Header Section */}
        <section className="px-6 sm:px-12 max-w-[1800px] mx-auto mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-border pb-8">
            <div>
              <p className="text-secondary font-bold tracking-[0.2em] uppercase mb-4 text-xs">Sélection Curatée</p>
              <h1 className="text-5xl md:text-7xl font-heading font-medium text-primary tracking-tighter">
                Acquérir
              </h1>
            </div>
            <div className="max-w-md">
              <p className="text-muted-foreground font-light leading-relaxed">
                Découvrez une collection d'œuvres originales authentifiées. Chaque pièce est sélectionnée pour sa maîtrise technique et sa profondeur conceptuelle.
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-[1800px] mx-auto px-6 sm:px-12">
          {/* Minimalist Controls */}
          <div className="flex flex-col md:flex-row gap-8 mb-16 items-start md:items-center justify-between sticky top-24 z-30 py-4 bg-background/90 backdrop-blur-sm">
            <div className="flex gap-8 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar mask-gradient">
              {['Toutes', 'Peinture', 'Sculpture', 'Photographie', 'Éditions'].map((filter, i) => (
                <button
                  key={filter}
                  className={`text-sm tracking-[0.1em] uppercase transition-all whitespace-nowrap hover:text-primary ${i === 0
                    ? 'text-primary font-bold border-b border-secondary'
                    : 'text-muted-foreground font-medium'
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="flex gap-8 items-center w-full md:w-auto border-t md:border-t-0 border-border pt-4 md:pt-0">
              <div className="relative flex-1 md:w-64">
                <input
                  type="text"
                  placeholder="Rechercher artiste ou mot-clé..."
                  className="w-full bg-transparent border-b border-border py-2 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-secondary transition-colors text-sm"
                />
              </div>
              <button className="text-xs uppercase tracking-[0.2em] font-bold text-primary whitespace-nowrap">
                Trier +
              </button>
            </div>
          </div>

          {/* Artworks Grid - Masonry Feel */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-24">
            {artworks.map((artwork, i) => (
              <Link href={`/marketplace/${artwork.id}`} key={artwork.id} className="block">
                <div
                  className={`group cursor-pointer ${i % 2 === 0 ? 'md:translate-y-12' : ''}`}
                >
                  <div className="relative aspect-[3/4] bg-muted mb-6 overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 transition-colors duration-700" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-secondary/10">
                      <span className="text-xs font-bold tracking-[0.3em] text-white uppercase border border-white px-6 py-3 hover:bg-white hover:text-primary transition-colors">
                        Voir l'Œuvre
                      </span>
                    </div>
                    {/* Mock Image Placeholder */}
                    <div className="absolute bottom-4 right-4 text-[4rem] font-heading text-primary/10 select-none">
                      {i + 1}
                    </div>
                  </div>

                  <div className="space-y-1 pr-4 border-l border-transparent group-hover:border-secondary pl-0 group-hover:pl-4 transition-all duration-300">
                    <h3 className="font-heading text-2xl text-foreground font-medium">
                      {artwork.title}
                    </h3>
                    <div className="flex justify-between items-baseline">
                      <p className="text-sm font-bold tracking-widest text-secondary uppercase">{artwork.artist}</p>
                      <p className="font-light text-foreground text-lg">
                        {artwork.price.toLocaleString()} €
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground pt-2">{artwork.category} • {artwork.year}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          < div className="flex justify-center items-center gap-12 mt-40" >
            <button className="text-xs font-bold tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors disabled:opacity-30">
              PRÉC
            </button>
            <div className="flex gap-4">
              <span className="text-sm font-serif italic text-primary">Page 1 sur 5</span>
            </div>
            <button className="text-xs font-bold tracking-[0.2em] text-primary hover:text-secondary transition-colors">
              SUIV
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
