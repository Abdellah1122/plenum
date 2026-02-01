import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function Terms() {
  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Header */}
        <section className="border-b border-border py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-8">
            <h1 className="text-6xl font-bold text-foreground mb-4 text-balance tracking-tight">
              TERMS OF SERVICE
            </h1>
            <p className="text-lg text-muted-foreground">
              Last updated: January 2024
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-8 py-20">
          <div className="max-w-none space-y-12">
            {/* Section 1 */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight">1. ACCEPTANCE OF TERMS</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using Plenum Qrts ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight">2. USE LICENSE</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Permission is granted to temporarily download one copy of the materials (information or software) on Plenum Qrts for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Modifying or copying the materials</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Using the materials for any commercial purpose or for any public display</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Attempting to decompile or reverse engineer any software contained on the Platform</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Removing any copyright or other proprietary notations from the materials</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Transferring the materials to another person or "mirroring" the materials on any other server</span>
                </li>
              </ul>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-2xl font-light text-foreground mb-4">3. User Responsibilities</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                As a user of Plenum Qrts, you are responsible for:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Maintaining the confidentiality of your account information</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Accepting responsibility for all activities that occur under your account</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Ensuring that all information provided is accurate and current</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Complying with all applicable laws and regulations</span>
                </li>
              </ul>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-2xl font-light text-foreground mb-4">4. Artwork Authenticity</h2>
              <p className="text-muted-foreground leading-relaxed">
                Artists certify that all artworks submitted to Plenum Qrts are their original creations or that they have obtained proper permissions for sale. Artists are solely responsible for any disputes regarding ownership or copyright. Plenum Qrts reserves the right to remove any artwork suspected of infringement.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-2xl font-light text-foreground mb-4">5. Commission Structure</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Plenum Qrts charges a 15% commission on all sales facilitated through the Platform. This covers:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Platform maintenance and development</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Payment processing and security</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Artist support and customer service</span>
                </li>
              </ul>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-2xl font-light text-foreground mb-4">6. Payment Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                Payment must be made in full at the time of purchase. All payments are processed securely through our payment partners. Refunds are processed within 30 days of return request and approval. Artists receive payment within 15 business days of confirmed sale.
              </p>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="text-2xl font-light text-foreground mb-4">7. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                The materials on Plenum Qrts are provided on an 'as is' basis. Plenum Qrts makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </div>

            {/* Section 8 */}
            <div>
              <h2 className="text-2xl font-light text-foreground mb-4">8. Intellectual Property Rights</h2>
              <p className="text-muted-foreground leading-relaxed">
                The content, organization, graphics, design, compilation, magnetic translation, digital conversion, and other matters related to the Platform are protected under applicable copyrights, trademarks, and other proprietary rights. All rights reserved.
              </p>
            </div>

            {/* Section 9 */}
            <div>
              <h2 className="text-2xl font-light text-foreground mb-4">9. Account Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                Plenum Qrts reserves the right, in its sole discretion, to terminate any account or user access if the user violates these terms or engages in conduct deemed harmful to the Platform, other users, or artists.
              </p>
            </div>

            {/* Section 10 */}
            <div>
              <h2 className="text-2xl font-light text-foreground mb-4">10. Dispute Resolution</h2>
              <p className="text-muted-foreground leading-relaxed">
                Any dispute arising from the use of Plenum Qrts shall be resolved through mutual negotiation. If unresolved within 30 days, disputes shall be subject to binding arbitration under the rules of the American Arbitration Association.
              </p>
            </div>

            {/* Section 11 */}
            <div>
              <h2 className="text-2xl font-light text-foreground mb-4">11. Modifications to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                Plenum Qrts may revise these terms of service for its Platform at any time without notice. By using this Platform, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </div>

            {/* Section 12 */}
            <div>
              <h2 className="text-2xl font-light text-foreground mb-4">12. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These conditions and terms are governed by and construed in accordance with the laws of the State of California, United States, and you irrevocably submit to the exclusive jurisdiction of the courts located in this state.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-card p-8 rounded-lg border border-border mt-12">
              <h3 className="text-lg font-medium text-foreground mb-4">Questions About These Terms?</h3>
              <p className="text-muted-foreground mb-4">
                If you have questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-primary font-medium">legal@plenumqrts.com</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
