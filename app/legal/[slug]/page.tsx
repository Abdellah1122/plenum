import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    return [
        { slug: 'terms' },
        { slug: 'privacy' },
        { slug: 'legal-notice' },
        { slug: 'shipping' },
    ];
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const content: Record<string, { title: string; body: string }> = {
        'terms': {
            title: 'Termes & Conditions',
            body: 'Bienvenue sur Plenum Arts. En utilisant notre site, vous acceptez nos conditions générales de vente et d\'utilisation. [Contenu complet à venir]'
        },
        'privacy': {
            title: 'Politique de Confidentialité',
            body: 'Nous prenons votre vie privée au sérieux. Vos données sont sécurisées et ne seront jamais vendues. [Contenu complet à venir]'
        },
        'legal-notice': {
            title: 'Mentions Légales',
            body: 'PLENUM Arts SARL. Siège social : Paris, France. [Contenu complet à venir]'
        },
        'shipping': {
            title: 'Expédition & Livraison',
            body: 'Nous expédions dans le monde entier avec des partenaires logistiques de confiance spécialisés dans le transport d\'œuvres d\'art. [Contenu complet à venir]'
        }
    };

    const page = content[slug];
    if (!page) return notFound();

    return (
        <>
            <Header />
            <main className="bg-background min-h-screen pt-32 pb-24 px-6 sm:px-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-heading mb-12 text-primary">{page.title}</h1>
                    <div className="prose prose-lg text-muted-foreground/80 leading-relaxed">
                        <p>{page.body}</p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
