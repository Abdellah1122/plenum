import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function About() {
  return (
    <>
      <Header />
      <main className="bg-background min-h-screen pt-32">
        {/* Editorial Hero */}
        <section className="px-6 sm:px-12 max-w-[1800px] mx-auto py-24 md:py-40">
          <div className="grid md:grid-cols-2 gap-12 items-end">
            <div>
              <p className="text-secondary font-bold tracking-[0.2em] uppercase mb-8 text-xs">Notre Éthique</p>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading font-medium text-primary tracking-tighter leading-[0.85]">
                Au-delà du <br />
                <span className="italic font-serif text-secondary/80">Commerce</span>
              </h1>
            </div>
            <p className="text-xl md:text-2xl font-light text-foreground/80 leading-relaxed max-w-lg">
              Plenum Arts sert de pont entre le visionnaire et le collectionneur. Nous ne vendons pas seulement de l'art ; nous cultivons une nouvelle génération de mécénat.
            </p>
          </div>
        </section>

        {/* Narrative Section */}
        <section className="py-24 bg-secondary/5">
          <div className="max-w-[1800px] mx-auto px-6 sm:px-12">
            <div className="grid md:grid-cols-12 gap-12">
              <div className="md:col-span-4">
                <h2 className="text-4xl font-heading mb-6 text-primary">Le Collectif</h2>
              </div>
              <div className="md:col-span-8 grid md:grid-cols-2 gap-12 text-lg font-light leading-relaxed text-muted-foreground">
                <p>
                  Fondé en 2022, Plenum a commencé comme une expérience de curation numérique. Nous avons observé un fossé entre l'exclusion des galeries traditionnelles et le bruit chaotique des places de marché ouvertes. Notre réponse a été un écosystème curaté — sur invitation pour les artistes, transparent pour les collectionneurs.
                </p>
                <p>
                  Chaque œuvre sur cette plateforme est authentifiée, chaque artiste vérifié. Nous croyons que l'histoire derrière l'œuvre est aussi vitale que l'œuvre elle-même. En fournissant une profondeur éditoriale aux côtés des canaux d'acquisition, nous redonnons du contexte à l'expérience de l'art numérique.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Grid */}
        <section className="py-32 px-6 sm:px-12 max-w-[1800px] mx-auto">
          <div className="grid md:grid-cols-3 gap-px bg-border border border-border">
            {[
              { title: 'Transparence', text: 'Provenance et prix clairs. Aucune prime cachée.' },
              { title: 'Curation', text: 'Un processus de sélection rigoureux privilégiant la profondeur et la maîtrise.' },
              { title: 'Communauté', text: 'Mécanismes de soutien direct pour nos partenaires artistes.' }
            ].map((value, i) => (
              <div key={i} className="bg-background p-12 hover:bg-primary/5 transition-colors group">
                <h3 className="text-2xl font-heading mb-4 text-primary">{value.title}</h3>
                <p className="text-muted-foreground font-light">{value.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team / Contact */}
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="max-w-[1800px] mx-auto px-6 sm:px-12 text-center">
            <h2 className="text-4xl md:text-6xl font-heading mb-12">Rejoignez le Dialogue</h2>
            <p className="text-xl font-light max-w-2xl mx-auto mb-16 opacity-80">
              Que vous soyez un artiste cherchant une représentation ou un collectionneur en quête de conseils, nous sommes là pour écouter.
            </p>
            <button className="px-12 py-4 bg-secondary text-white text-xs font-bold tracking-[0.2em] hover:bg-white hover:text-primary transition-all duration-300">
              CONTACTEZ-NOUS
            </button>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
