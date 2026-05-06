import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const LAST_UPDATED = 'May 6, 2026';
const COMPANY = 'Miami Global Investments Group LLC';
const EMAIL = 'legal@miamiglobalinvestments.com';

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white">
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">Legal</p>
          <h1 className="text-3xl font-extrabold text-zinc-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-zinc-400 mb-10">Last updated: {LAST_UPDATED}</p>

          <div className="prose prose-zinc prose-sm max-w-none space-y-8 text-zinc-600 leading-relaxed">

            <section>
              <h2 className="text-lg font-bold text-zinc-900 mb-2">1. Introduction</h2>
              <p>
                {COMPANY} ("we," "us," or "our") operates DealEdge AI (the "Service"). This Privacy Policy
                explains how we collect, use, and protect information when you use our Service. By using
                DealEdge AI, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-900 mb-2">2. Information We Collect</h2>
              <p className="mb-3"><strong className="text-zinc-800">Account Information:</strong> When you create an account, we collect your name, email address, and password (stored as a hashed credential).</p>
              <p className="mb-3"><strong className="text-zinc-800">Deal Data:</strong> When you analyze deals, the inputs you enter (purchase price, ARV, repair costs, etc.) are processed to generate your results. Deals you choose to save are stored locally in your browser.</p>
              <p className="mb-3"><strong className="text-zinc-800">Payment Information:</strong> If you upgrade to a paid plan, payment processing is handled entirely by Stripe. We do not store your credit card number or full payment details on our servers.</p>
              <p><strong className="text-zinc-800">Usage Data:</strong> We may collect anonymized usage statistics such as page views and feature usage to improve the product.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-900 mb-2">3. How We Use Your Information</h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>To provide, operate, and maintain the Service</li>
                <li>To manage your account and subscription</li>
                <li>To process payments through Stripe</li>
                <li>To send transactional emails related to your account</li>
                <li>To improve and develop new features</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-900 mb-2">4. Data Storage</h2>
              <p>
                Account data and session information are currently stored in your browser&apos;s localStorage.
                This means your data is stored on your device and is not transmitted to external databases
                unless explicitly noted (e.g., during payment processing via Stripe). We do not sell,
                trade, or rent your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-900 mb-2">5. Cookies</h2>
              <p>
                We use browser storage (localStorage) to remember your session and preferences. We may also
                use standard analytics cookies to understand how users interact with our Service. You can
                control cookie settings through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-900 mb-2">6. Third-Party Services</h2>
              <p className="mb-3"><strong className="text-zinc-800">Stripe:</strong> Payment processing is handled by Stripe, Inc. Your payment information is governed by Stripe&apos;s Privacy Policy.</p>
              <p><strong className="text-zinc-800">Analytics:</strong> We may use third-party analytics services to understand usage patterns. These services collect anonymized data.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-900 mb-2">7. Data Security</h2>
              <p>
                We take reasonable technical measures to protect your information. However, no method of
                transmission over the internet or electronic storage is 100% secure. We encourage you to
                use strong, unique passwords for your account.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-900 mb-2">8. Your Rights</h2>
              <p className="mb-2">Depending on your location, you may have the right to:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Access the personal information we hold about you</li>
                <li>Request correction or deletion of your personal information</li>
                <li>Object to or restrict processing of your information</li>
                <li>Request a copy of your data in a portable format</li>
              </ul>
              <p className="mt-3">To exercise these rights, contact us at <a href={`mailto:${EMAIL}`} className="text-indigo-600 underline">{EMAIL}</a>.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-900 mb-2">9. Children&apos;s Privacy</h2>
              <p>
                DealEdge AI is not directed at children under 13. We do not knowingly collect personal
                information from children under 13. If we discover we have collected such information,
                we will delete it immediately.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-900 mb-2">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of significant
                changes by posting the new policy on this page with an updated date. Your continued use
                of the Service after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-zinc-900 mb-2">11. Contact Us</h2>
              <p>
                For questions or concerns about this Privacy Policy, contact us at:{' '}
                <a href={`mailto:${EMAIL}`} className="text-indigo-600 underline">{EMAIL}</a>
              </p>
              <p className="mt-2">
                {COMPANY}<br />
                Miami, Florida
              </p>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
