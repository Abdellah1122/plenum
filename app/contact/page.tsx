import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function Contact() {
  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Hero Section */}
        <section className="border-b border-border py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
            <h1 className="text-6xl font-bold text-foreground mb-4 text-balance tracking-tight">
              GET IN TOUCH
            </h1>
            <p className="text-lg text-muted-foreground">
              We'd love to hear from you. Reach out with any questions or feedback.
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 py-20">
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {[
              {
                icon: '+',
                title: 'EMAIL',
                desc: 'Send us a message',
                value: 'hello@plenumArts.com',
              },
              {
                icon: '◆',
                title: 'OFFICE',
                desc: 'Visit us in person',
                value: 'San Francisco, CA',
              },
              {
                icon: '◆',
                title: 'SUPPORT',
                desc: 'Chat with our team',
                value: 'Available 9AM - 6PM PST',
              },
            ].map((contact, i) => (
              <div key={i} className="text-center p-8 bg-white border border-border">
                <div className="text-4xl mb-4 text-primary/30">{contact.icon}</div>
                <h3 className="text-xs font-bold text-foreground mb-2 tracking-widest">{contact.title}</h3>
                <p className="text-xs text-muted-foreground mb-4">{contact.desc}</p>
                <p className="font-semibold text-foreground">{contact.value}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-16 pt-12 border-t border-border">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-8 tracking-tight">SEND A MESSAGE</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-4 py-2 border border-border rounded bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border border-border rounded bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Subject
                  </label>
                  <select className="w-full px-4 py-2 border border-border rounded bg-card text-foreground focus:outline-none focus:border-primary">
                    <option>General Inquiry</option>
                    <option>Artist Application</option>
                    <option>Technical Support</option>
                    <option>Partnership</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell us what's on your mind..."
                    className="w-full px-4 py-2 border border-border rounded bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary resize-none"
                  />
                </div>

                <button className="w-full px-6 py-3 bg-primary text-white font-semibold tracking-wider text-sm hover:bg-secondary transition-colors">
                  SEND MESSAGE
                </button>
              </form>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-8 tracking-tight">FAQ</h2>

              <div className="space-y-4">
                {[
                  {
                    q: 'How do I list my artwork?',
                    a: 'Sign up as an artist, complete your profile, and start uploading your works through our simple submission process.',
                  },
                  {
                    q: 'What are your commission fees?',
                    a: 'We take a 15% commission on each sale. Artists receive 85% of the sale price directly.',
                  },
                  {
                    q: 'How long does shipping take?',
                    a: 'Standard shipping takes 5-10 business days. Express options are available at checkout.',
                  },
                  {
                    q: 'Can I return artwork?',
                    a: 'Yes, we offer 30-day returns for undamaged items. Please review our full return policy.',
                  },
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-white border border-border">
                    <h3 className="font-bold text-foreground mb-3 text-sm">{item.q}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-muted py-20 border-t border-border">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-8 text-center">
            <h2 className="text-5xl font-bold text-foreground mb-6 tracking-tight">
              JOIN OUR NEWSLETTER
            </h2>
            <p className="text-muted-foreground mb-12 text-lg leading-relaxed">
              Get updates on new artworks and exclusive opportunities
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-border bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary text-sm"
              />
              <button className="px-8 py-3 bg-primary text-white font-semibold tracking-wider text-sm hover:bg-secondary transition-colors">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
