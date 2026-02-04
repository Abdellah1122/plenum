'use client';

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Link from 'next/link'

export default function PrintOnDemand() {
  const products = [
    {
      id: 1,
      name: 'Tirage d’Art',
      price: 85,
      description: 'Papier de qualité galerie avec options d’encadrement.',
      features: ['Hahnemühle Photo Rag', 'Passe-partout sur mesure', 'Verre anti-UV']
    },
    {
      id: 2,
      name: 'Toile tendue',
      price: 150,
      description: 'Toile tendue à la main sur châssis en bois massif.',
      features: ['Encre pigmentaire', 'Finition satinée', 'Prêt à accrocher']
    },
    {
      id: 3,
      name: 'Tirage sur Métal',
      price: 220,
      description: 'Impression sur aluminium haute brillance pour un rendu moderne.',
      features: ['Surface durable', 'Fixation flottante', 'Couleurs vibrantes']
    }
  ];

  return (
    <>
      <Header />
      <main className="bg-background min-h-screen pt-32 pb-24">

        {/* Studio/Editions Hero */}
        <section className="px-6 sm:px-12 max-w-[1800px] mx-auto mb-32">
          <div className="grid md:grid-cols-2 gap-16 md:gap-32 items-center">
            <div>
              <p className="text-secondary font-bold tracking-[0.2em] uppercase mb-8 text-xs">Le Studio</p>
              <h1 className="text-5xl md:text-7xl font-heading font-medium text-primary tracking-tighter mb-8 leading-[0.9]">
                Éditions <br />
                <span className="italic font-serif text-secondary/80">Archivales</span>
              </h1>
              <p className="text-xl font-light text-foreground/80 leading-relaxed max-w-md mb-12">
                Reproductions de qualité muséale produites selon les normes exigeantes de l'artiste.
              </p>
              <div className="flex gap-8">
                <Link href="/print-on-demand/configurator" className="px-8 py-4 bg-primary text-white text-xs font-bold tracking-[0.2em] hover:bg-primary/90 transition-colors block text-center">
                  CRÉER MAINTENANT
                </Link>
                <button className="px-8 py-4 border border-foreground/20 text-foreground text-xs font-bold tracking-[0.2em] hover:border-primary hover:text-primary transition-colors">
                  VOIR LE CATALOGUE
                </button>
              </div>
            </div>

            <div className="relative aspect-square md:aspect-[4/5] bg-muted overflow-hidden">
              <div className="absolute inset-0 bg-secondary/10" />
              {/* Decorative layout elements */}
              <div className="absolute top-8 right-8 w-24 h-24 border border-primary/20 rounded-full animate-[spin_10s_linear_infinite]" />
              <div className="absolute bottom-12 left-12">
                <p className="font-heading text-9xl text-primary/5">01</p>
              </div>
            </div>
          </div>
        </section>

        {/* Material Selection */}
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="max-w-[1800px] mx-auto px-6 sm:px-12">
            <div className="flex justify-between items-end mb-24">
              <div>
                <h2 className="text-4xl md:text-6xl font-heading mb-4">Supports</h2>
                <p className="text-primary-foreground/60 font-light max-w-md">Choisissez parmi notre sélection curatée de surfaces premium.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-px bg-primary-foreground/20 border border-primary-foreground/20">
              {[
                { name: 'Hahnemühle Photo Rag', desc: '100% coton, papier d’art.' },
                { name: 'Toile d’Exposition', desc: 'Mélange poly-coton, finition satinée.' },
                { name: 'Métal Chromaluxe', desc: 'Aluminium haute définition, durable.' }
              ].map((material, i) => (
                <div key={i} className="p-12 md:p-16 hover:bg-white/5 transition-colors group cursor-pointer">
                  <span className="block text-xs font-bold tracking-[0.2em] text-secondary mb-8">0{i + 1}</span>
                  <h3 className="text-2xl font-heading mb-4">{material.name}</h3>
                  <p className="text-primary-foreground/60 font-light">{material.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing/Products */}
        <section className="py-32 px-6 sm:px-12 max-w-[1800px] mx-auto">
          <h2 className="text-3xl font-bold font-heading mb-12 text-center">Formats Disponibles</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="border border-border p-8 hover:border-primary transition-all duration-300 group">
                <div className="aspect-video bg-muted mb-6 flex items-center justify-center">
                  <span className="text-4xl text-primary/20 font-heading group-hover:text-primary/40 transition-colors">
                    0{product.id}
                  </span>
                </div>
                <h3 className="text-2xl font-bold font-heading mb-2">{product.name}</h3>
                <p className="text-3xl font-bold text-primary mb-4">
                  <span className="text-sm font-normal text-muted-foreground mr-2">à partir de</span>
                  {product.price} €
                </p>
                <p className="text-sm text-muted-foreground mb-6">{product.description}</p>

                <ul className="space-y-3 mb-8">
                  {product.features.map((feat, i) => (
                    <li key={i} className="flex items-center text-sm text-foreground">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/print-on-demand/configurator?material=${product.id === 1 ? 'paper' : product.id === 2 ? 'canvas' : 'metal'}`}
                  className="block w-full py-3 border border-foreground text-foreground text-sm font-bold tracking-wider hover:bg-foreground hover:text-white transition-colors text-center">
                  COMMENCER
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-32 px-6 sm:px-12 max-w-[1800px] mx-auto bg-muted/30">
          <div className="grid md:grid-cols-12 gap-16">
            <div className="md:col-span-4">
              <h2 className="text-4xl font-heading text-primary mb-8">Le Processus</h2>
            </div>
            <div className="md:col-span-8 space-y-24">
              {[
                { step: 'Sélection', desc: 'Parcourez nos archives exclusives d\'œuvres sous licence disponibles pour une édition personnalisée.' },
                { step: 'Configuration', desc: 'Spécifiez la taille, le matériau et les options d\'encadrement pour convenir à votre espace.' },
                { step: 'Production', desc: 'Chaque pièce est imprimée sur commande dans notre studio de Londres, inspectée et certifiée.' }
              ].map((item, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-8 md:gap-16 border-t border-border pt-8">
                  <span className="text-xs font-bold tracking-[0.2em] text-secondary w-24 pt-2">ÉTAPE 0{i + 1}</span>
                  <div>
                    <h3 className="text-2xl font-heading mb-4 text-foreground">{item.step}</h3>
                    <p className="text-lg font-light text-muted-foreground leading-relaxed max-w-xl">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
