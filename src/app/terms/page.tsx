import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const LAST_UPDATED = 'May 6, 2026';
const COMPANY = 'Miami Global Investments Group LLC';
const EMAIL = 'legal@miamiglobalinvestments.com';

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white">
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">Legal</p>
          <h1 className="text-3xl font-extrabold text-zinc-900 mb-2">Terms of Service</h1>
          <p className="text-sm text-zinc-400 mb-10">Last updated: {LAST_UPDATED}</p>

          <div className="space-y-8 text-zinc-600 leading-relaxed text-sm">

            <section>
              <h2 className="text-lg font-bold text-zinc-900 mb-2">1. Acceptance of Terms</h2>
              <p>
                By accessing or using DealEdge AI ("the Service"), operated by {COMPANY} ("Company"), you
                agree to be bound by these Terms of Service ("Terms"). If you do not agree, do not use the
                Service. We reserve the right to update these Terms at any time; continued use constitutes
                acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-900 mb-2">2. Description of Service</h2>
              <p>
                DealEdge AI is a web-based real estate deal analysis tool that provides deal calculations,
                AI-driven recommendations, offer generation, and related features for real estate investors.
                The Service is provided for informational and educational purposes only.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-900 mb-2">3. No Investment or Financial Advice</h2>
              <p className="font-semibold text-zinc-800 mb-2">
                DEALEDGE AI DOES NOT PROVIDE INVESTMENT, FINANCIAL, LEGAL, OR TAX ADVICE.
              </p>
              <p>
                All deal analyses, scores, AI decisions, and recommendations provided by the Service are
                estimates based on algorithms and general real estate principles. They do not constitute
                professional advice. Always consult with licensed real estate professionals, attorneys,
                accountants, and financial advisors before making investment decisions. You are solely
                responsible for your investment decisions and their outcomes.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-900 mb-2">4. User Accounts</h2>
              <p className="mb-3">
                You may create a free account using your email address and password. You are responsible
                for maintaining the confidentiality of your credentials and for all activities under your
                account. Notify us immediately of any unauthorized use.
              </p>
              <p>
                You must provide accurate information when creating an account. Accounts are for individual
                use and may not be shared or transferred.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-900 mb-2">5. Subscription and Payments</h2>
              <p className="mb-3">
                Paid plans ("Pro" at $9/month and "Investor" at $19/month) are billed monthly. Payments are
                processed by Stripe, Inc. and are subject to Stripe&apos;s terms and privacy policy.
              </p>
              <p className="mb-3">
                Subscriptions are activated only after successful payment verification. You can cancel your
                subscription at any time from your dashboard. Upon cancellation, you retain access through
                the end of your current billing period. No refunds are issued for partial billing periods.
              </p>
              <p>
                We reserve the right to change pricing with 30 days&apos; notice to existing subscribers.
                Early access pricing is subject to change when the early access period ends.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-900 mb-2">6. Acceptable Use</h2>
              <p className="mb-2">You agree not to:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Use the Service for any unlawful purpose</li>
                <li>Attempt to reverse-engineer, scrape, or copy the Service</li>
                <li>Submit false or misleading information</li>
                <li>Use the Service to harass, defraud, or deceive others</li>
                <li>Circumvent any usage limits or access controls</li>
                <li>Resell or sublicense access to the Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-900 mb-2">7. Intellectual Property</h2>
              <p>
                All content, features, algorithms, designs, and functionality of DealEdge AI are owned by
                {COMPANY} and protected by applicable intellectual property laws. You may not copy,
                reproduce, or create derivative works without our express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-900 mb-2">8. Disclaimer of Warranties</h2>
              <p className="uppercase font-semibold text-zinc-800 mb-2">
                The service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind.
              </p>
              <p>
                We do not warrant that the Service will be uninterrupted, error-free, accurate, or complete.
                Deal analysis results are estimates based on inputs you provide and may not reflect actual
                market conditions, costs, or outcomes.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-900 mb-2">9. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, {COMPANY} and its officers, employees, and agents
                shall not be liable for any indirect, incidental, special, consequential, or punitive
                damages, including loss of profits, data, or goodwill, arising from your use of the Service
                or any investment decisions made based on Service outputs. Our total liability shall not
                exceed the amount you paid for the Service in the 12 months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-900 mb-2">10. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless {COMPANY} and its affiliates from any claims,
                damages, losses, or expenses (including legal fees) arising from your use of the Service,
                violation of these Terms, or any investment decisions made using Service outputs.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-900 mb-2">11. Termination</h2>
              <p>
                We may terminate or suspend your account at any time for violations of these Terms.
                You may also terminate your account by contacting us. Upon termination, your right to
                use the Service ceases immediately. Sections 3, 8, 9, 10, and 12 survive termination.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-900 mb-2">12. Governing Law</h2>
              <p>
                These Terms are governed by the laws of the State of Florida, United States, without regard
                to conflict of law principles. Any disputes shall be resolved in the courts of Miami-Dade
                County, Florida.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-900 mb-2">13. Contact</h2>
              <p>
                Questions about these Terms:{' '}
                <a href={`mailto:${EMAIL}`} className="text-indigo-600 underline">{EMAIL}</a>
              </p>
              <p className="mt-2">{COMPANY} · Miami, Florida</p>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
