'use client';

import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-24 pb-12 border-t border-primary-foreground/10">
      <div className="max-w-[1800px] mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">

          {/* Brand Column */}
          <div className="md:col-span-4">
            <Link href="/" className="inline-block mb-8">
              <h2 className="text-4xl font-heading font-bold">PLENUM.</h2>
            </Link>
            <p className="text-primary-foreground/60 text-lg font-light leading-relaxed max-w-sm mb-8">
              Une plateforme dédiée à la collection d'art contemporain et au soutien des artistes visionnaires.
            </p>
            <div className="flex gap-4">
              {['Instagram', 'Twitter', 'LinkedIn'].map((social) => (
                <a key={social} href="#" className="text-xs font-bold tracking-[0.2em] uppercase hover:text-secondary transition-colors">
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="md:col-span-2 md:col-start-6">
            <h3 className="text-xs font-bold tracking-[0.2em] text-secondary mb-8">NAVIGATION</h3>
            <ul className="space-y-4">
              {[
                { label: 'Accueil', href: '/' },
                { label: 'Galerie', href: '/marketplace' },
                { label: 'Enchères', href: '/auction' },
                { label: 'Studio', href: '/print-on-demand' },
                { label: 'À Propos', href: '/about' }
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm font-medium hover:text-secondary transition-colors opacity-80 hover:opacity-100">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-bold tracking-[0.2em] text-secondary mb-8">LÉGAL</h3>
            <ul className="space-y-4">
              {[
                { label: 'Termes & Conditions', href: '/legal/terms' },
                { label: 'Confidentialité', href: '/legal/privacy' },
                { label: 'Mentions Légales', href: '/legal/legal-notice' },
                { label: 'Expédition', href: '/legal/shipping' }
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm font-medium hover:text-secondary transition-colors opacity-80 hover:opacity-100">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-bold tracking-[0.2em] text-secondary mb-8">NEWSLETTER</h3>
            <p className="text-sm text-primary-foreground/60 mb-6 font-light">
              Recevez nos dernières acquisitions et invitations exclusives.
            </p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                // @ts-ignore
                const email = e.target.elements.email.value;
                if (!email) return;

                const { error } = await supabase.from('newsletter_subscribers').insert({ email });
                if (error) {
                  if (error.code === '23505') alert('Vous êtes déjà inscrit !');
                  else alert('Erreur: ' + error.message);
                } else {
                  alert('Inscription réussie !');
                  // @ts-ignore
                  e.target.reset();
                }
              }}
              className="flex border-b border-primary-foreground/30 pb-2"
            >
              <input
                name="email"
                type="email"
                placeholder="Votre email"
                className="bg-transparent border-none focus:outline-none w-full placeholder:text-primary-foreground/30 text-sm"
              />
              <button className="text-xs font-bold tracking-widest hover:text-secondary transition-colors uppercase">
                S'inscrire
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end border-t border-primary-foreground/10 pt-8 opacity-40">
          <p className="text-xs font-heading">© 2024 PLENUM Arts. TOUS DROITS RÉSERVÉS.</p>
          <p className="text-[10vw] leading-[0.8] font-heading font-bold text-primary-foreground/10 select-none hidden md:block">
            ART / WORK
          </p>
        </div>
      </div>
    </footer>
  )
}
