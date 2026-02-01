import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Header />
      <main className="bg-background selection:bg-secondary/30">

        {/* Full Screen Hero */}
        <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
          {/* Subtle animated background */}
          <div className="absolute inset-0 bg-primary/5" />
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] mix-blend-multiply animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] mix-blend-multiply" />

          <div className="relative z-10 max-w-[1800px] mx-auto px-6 sm:px-12 w-full text-center">
            <p className="text-secondary font-bold tracking-[0.3em] uppercase mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Est. MMXXII
            </p>
            <h1 className="text-[12vw] leading-[0.85] font-heading font-medium text-primary tracking-tighter mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
              MODERN<br />
              <span className="font-serif italic text-secondary/80">Héritage</span>
            </h1>
            <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              <p className="max-w-xl text-lg md:text-xl font-light text-foreground/80 leading-relaxed">
                Connectez-vous avec l'avant-garde de l'art contemporain. Un écosystème curaté pour le collectionneur moderne.
              </p>
              <div className="mt-8 flex gap-8">
                <Link
                  href="/marketplace"
                  className="px-12 py-4 bg-primary text-white text-xs font-bold tracking-[0.2em] hover:bg-primary/90 transition-all duration-300"
                >
                  ACQUÉRIR
                </Link>
                <Link
                  href="/auction"
                  className="px-12 py-4 border border-primary text-primary text-xs font-bold tracking-[0.2em] hover:bg-primary hover:text-white transition-all duration-300"
                >
                  ENCHÉRIR
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy / About Scroll Section */}
        <section className="py-32 px-6 sm:px-12 max-w-[1800px] mx-auto">
          <div className="grid md:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-6xl md:text-8xl font-heading text-primary leading-[0.9] mb-12">
                Curater <br /><span className="italic font-serif text-secondary">l'Excellence</span>
              </h2>
            </div>
            <div className="space-y-8">
              <p className="text-2xl font-light text-foreground/90 leading-relaxed">
                Plenum Qrts est plus qu'une simple galerie. C'est un dialogue entre le créateur et l'observateur. Nous sélectionnons des œuvres qui interpellent, inspirent et perdurent.
              </p>
              <div className="h-[1px] w-full bg-border" />
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xs font-bold tracking-[0.2em] text-secondary mb-2">ORIGINAL</h3>
                  <p className="text-sm text-muted-foreground">Œuvres authentifiées directement des studios d'artistes.</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold tracking-[0.2em] text-secondary mb-2">SÉCURISÉ</h3>
                  <p className="text-sm text-muted-foreground">Livraison mondiale assurée et gestion transparente.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Works - Asymmetrical Grid */}
        <section className="py-32 bg-primary text-primary-foreground">
          <div className="max-w-[1800px] mx-auto px-6 sm:px-12">
            <div className="flex justify-between items-end mb-24">
              <div>
                <p className="text-xs font-bold tracking-[0.2em] text-secondary mb-4">SÉLECTION</p>
                <h2 className="text-6xl md:text-7xl font-heading">Œuvres en Vedette</h2>
              </div>
              <Link href="/marketplace" className="text-xs font-bold tracking-[0.2em] border-b border-secondary pb-1 hover:text-secondary transition-colors uppercase">
                Voir la Collection
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
              {/* Large Featured Item */}
              <div className="md:col-span-8 group cursor-pointer">
                <div className="aspect-[16/10] bg-primary-foreground/5 relative overflow-hidden mb-6">
                  <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-heading text-9xl text-primary-foreground/5 group-hover:text-primary-foreground/10 transition-colors duration-700">01</span>
                  </div>
                </div>
                <div className="flex justify-between items-start border-t border-primary-foreground/20 pt-6">
                  <div>
                    <h3 className="text-3xl font-heading mb-2">Composition Abstraite IV</h3>
                    <p className="text-sm font-bold tracking-widest text-secondary">ELENA VOSK</p>
                  </div>
                  <p className="text-xl font-light">12 500 €</p>
                </div>
              </div>

              {/* Smaller Column */}
              <div className="md:col-span-4 flex flex-col gap-16 md:pt-32">
                <div className="group cursor-pointer">
                  <div className="aspect-[4/5] bg-primary-foreground/5 relative overflow-hidden mb-6">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-heading text-8xl text-primary-foreground/5 group-hover:text-primary-foreground/10 transition-colors duration-700">02</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-start border-t border-primary-foreground/20 pt-6">
                    <div>
                      <h3 className="text-xl font-heading mb-1">Silence en Bleu</h3>
                      <p className="text-xs font-bold tracking-widest text-secondary">MARCUS REED</p>
                    </div>
                    <p className="text-lg font-light">4 200 €</p>
                  </div>
                </div>

                <div className="group cursor-pointer">
                  <div className="aspect-square bg-primary-foreground/5 relative overflow-hidden mb-6">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-heading text-8xl text-primary-foreground/5 group-hover:text-primary-foreground/10 transition-colors duration-700">03</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-start border-t border-primary-foreground/20 pt-6">
                    <div>
                      <h3 className="text-xl font-heading mb-1">Forme Structurelle</h3>
                      <p className="text-xs font-bold tracking-widest text-secondary">SARAH J.</p>
                    </div>
                    <p className="text-lg font-light">6 800 €</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Editorial / Services Section */}
        <section className="py-32 px-6 sm:px-12 max-w-[1800px] mx-auto">
          <div className="grid md:grid-cols-3 gap-px bg-border border border-border">
            {[
              { title: 'Tirages d\'Art', desc: 'Reproductions de qualité muséale.', link: 'Studios' },
              { title: 'Enchères Live', desc: 'Événements d\'enchères en temps réel.', link: 'Calendrier' },
              { title: 'Conseil', desc: 'Services de curation experts.', link: 'Contact' }
            ].map((service, i) => (
              <div key={i} className="bg-background p-12 md:p-16 hover:bg-secondary/5 transition-colors duration-500 group">
                <h3 className="text-3xl font-heading mb-4 text-primary group-hover:translate-x-2 transition-transform duration-300">{service.title}</h3>
                <p className="text-muted-foreground mb-12 max-w-xs">{service.desc}</p>
                <span className="text-xs font-bold tracking-[0.2em] text-secondary border-b border-secondary/30 pb-1 group-hover:text-primary group-hover:border-primary transition-colors uppercase">
                  {service.link}
                </span>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
