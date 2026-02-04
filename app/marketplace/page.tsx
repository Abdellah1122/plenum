'use client';

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Slider } from '@/components/ui/slider'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Search, SlidersHorizontal, X } from 'lucide-react'

export default function Marketplace() {
  const [artworks, setArtworks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Filter States
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Toutes')
  const [priceRange, setPriceRange] = useState([0, 50000]) // Default max 50k
  const [isPriceOpen, setIsPriceOpen] = useState(false)

  useEffect(() => {
    async function fetchArtworks() {
      const { data, error } = await supabase.from('artworks').select('*')
      if (data) {
        setArtworks(data)
      } else {
        console.error(error)
      }
      setLoading(false)
    }
    fetchArtworks()
  }, [])

  // Filter Logic
  const filteredArtworks = useMemo(() => {
    return artworks.filter(artwork => {
      // Category Filter
      if (selectedCategory !== 'Toutes' && artwork.category !== selectedCategory) {
        return false
      }

      // Price Filter
      if (artwork.price < priceRange[0] || artwork.price > priceRange[1]) {
        return false
      }

      // Search Filter (Title, Artist)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        const matchesTitle = artwork.title?.toLowerCase().includes(searchLower)
        const matchesArtist = artwork.artist?.toLowerCase().includes(searchLower)
        if (!matchesTitle && !matchesArtist) {
          return false
        }
      }

      return true
    })
  }, [artworks, selectedCategory, priceRange, searchTerm])

  return (
    <>
      <Header />
      <main className="bg-background min-h-screen pt-32 pb-24">

        {/* Header Section */}
        <section className="px-6 sm:px-12 max-w-[1800px] mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row gap-8 mb-16 items-start lg:items-center justify-between sticky top-24 z-30 py-6 bg-background/95 backdrop-blur-md border-b border-border/40">

            {/* Categories */}
            <div className="flex gap-8 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto no-scrollbar mask-gradient">
              {['Toutes', 'Peinture', 'Sculpture', 'Photographie', 'Éditions'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedCategory(filter)}
                  className={`text-sm tracking-[0.1em] uppercase transition-all whitespace-nowrap hover:text-primary ${selectedCategory === filter
                      ? 'text-primary font-bold border-b-2 border-secondary pb-1'
                      : 'text-muted-foreground font-medium pb-1 border-b-2 border-transparent'
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-6 items-center w-full lg:w-auto">

              {/* Search Input */}
              <div className="relative w-full sm:w-64 group">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher artiste ou œuvre..."
                  className="w-full bg-transparent border-b border-border py-2 pl-6 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary transition-colors text-sm"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-0 top-1/2 -translate-y-1/2">
                    <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>

              {/* Price Filter Popover */}
              <Popover open={isPriceOpen} onOpenChange={setIsPriceOpen}>
                <PopoverTrigger asChild>
                  <button className={`flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold whitespace-nowrap transition-colors ${isPriceOpen || (priceRange[0] > 0 || priceRange[1] < 50000) ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                    }`}>
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Prix</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-6" align="end">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="font-heading text-lg">Fourchette de prix</h4>
                      <span className="text-xs text-muted-foreground font-mono">
                        {priceRange[0]}€ - {priceRange[1]}€{priceRange[1] === 50000 ? '+' : ''}
                      </span>
                    </div>
                    <Slider
                      defaultValue={[0, 50000]}
                      max={50000}
                      step={100}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground uppercase tracking-wider">
                      <span>0 €</span>
                      <span>50 000 €+</span>
                    </div>
                    <button
                      onClick={() => {
                        setPriceRange([0, 50000])
                        setIsPriceOpen(false)
                      }}
                      className="w-full py-2 text-xs border border-border hover:bg-muted transition-colors uppercase tracking-widest"
                    >
                      Réinitialiser
                    </button>
                  </div>
                </PopoverContent>
              </Popover>

            </div>
          </div>

          {/* Results Count */}
          <div className="mb-8 text-xs font-mono text-muted-foreground uppercase tracking-widest">
            {filteredArtworks.length} RÉSULTATS
          </div>

          {/* Artworks Grid */}
          {filteredArtworks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-24">
              {filteredArtworks.map((artwork, i) => (
                <Link href={`/marketplace/${artwork.id}`} key={artwork.id} className="block">
                  <div
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[3/4] bg-muted mb-6 overflow-hidden">
                      {/* Placeholder Image Logic - replace with actual image component when available */}
                      {artwork.image_url ? (
                        <div className="absolute inset-0">
                          <img src={artwork.image_url} alt={artwork.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-secondary/5 flex items-center justify-center">
                          <span className="font-heading text-4xl text-primary/10">{i + 1}</span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="text-xs font-bold tracking-[0.3em] text-white uppercase border border-white/50 backdrop-blur-sm px-6 py-3 hover:bg-white hover:text-primary transition-colors">
                          Voir l'Œuvre
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-heading text-2xl text-foreground font-medium group-hover:text-primary transition-colors">
                        {artwork.title}
                      </h3>
                      <div className="flex justify-between items-baseline border-t border-border/50 pt-2">
                        <p className="text-xs font-bold tracking-[0.2em] text-secondary uppercase">{artwork.artist}</p>
                        <p className="font-light text-foreground text-lg">
                          {artwork.price.toLocaleString()} €
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">{artwork.category} • {artwork.year}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
              <p className="text-2xl font-heading text-muted-foreground mb-4">Aucune œuvre trouvée</p>
              <p className="text-muted-foreground max-w-sm font-light">
                Essayez d'ajuster vos filtres ou effectuez une nouvelle recherche.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setPriceRange([0, 50000])
                  setSelectedCategory('Toutes')
                }}
                className="mt-8 text-xs font-bold tracking-[0.2em] text-primary border-b border-primary pb-1 hover:text-secondary hover:border-secondary transition-colors"
              >
                EFFACER LES FILTRES
              </button>
            </div>
          )}

          {/* Pagination (Hidden if no results) */}
          {filteredArtworks.length > 0 && (
            <div className="flex justify-center items-center gap-12 mt-40">
              <button className="text-xs font-bold tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors disabled:opacity-30">
                PRÉC
              </button>
              <div className="flex gap-4">
                <span className="text-sm font-serif italic text-primary">Page 1 sur 1</span>
              </div>
              <button className="text-xs font-bold tracking-[0.2em] text-primary hover:text-secondary transition-colors">
                SUIV
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
