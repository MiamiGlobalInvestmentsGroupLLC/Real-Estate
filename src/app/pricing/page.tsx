import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PricingPlans from '@/components/landing/PricingPlans';
import Link from 'next/link';

const faqs = [
  {
    q: 'Is the free plan actually free forever?',
    a: 'Yes. The Starter plan is completely free with no credit card required. You get 5 deal analyses per day, which is enough for most investors starting out.',
  },
  {
    q: 'What is the 70% rule?',
    a: "The 70% rule states that an investor should pay no more than 70% of the ARV minus repair costs. DealEdge AI calculates this automatically for every deal you analyze.",
  },
  {
    q: 'How accurate is the AI decision engine?',
    a: 'The AI uses a proven algorithm based on margin, ROI, risk profile, and market-standard thresholds used by experienced investors. Results are estimates — always verify with licensed professionals.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes, cancel anytime. No long-term contracts. You keep access until the end of your billing period.',
  },
  {
    q: 'Is there a mobile app?',
    a: 'DealEdge AI is a mobile-first web app that works perfectly on any device, browser, and screen size — no app download needed.',
  },
  {
    q: 'What does the SMS Engine do exactly?',
    a: 'Paste any deal description in plain text (from a text message, email, or voicemail) and our engine automatically extracts the numbers and runs the full analysis.',
  },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white">
        {/* Header */}
        <section className="relative overflow-hidden bg-gradient-to-b from-zinc-50 to-white border-b border-zinc-100 py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">Pricing</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 mb-4">
              Simple, honest pricing
            </h1>
            <p className="text-lg text-zinc-500 max-w-xl mx-auto">
              More affordable than DealCheck, PropStream, and every other real estate tool.
              Start free — upgrade when you are ready.
            </p>
          </div>
        </section>

        <PricingPlans compact />

        {/* ROI callout */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gradient-to-br from-indigo-600 to-cyan-600 rounded-2xl p-8 sm:p-10 text-center text-white">
            <p className="text-5xl font-black mb-3">$10,000+</p>
            <p className="text-indigo-100 text-lg font-medium mb-2">
              Average savings from avoiding one bad deal
            </p>
            <p className="text-indigo-200 text-sm max-w-md mx-auto">
              DealEdge AI Pro costs $9/month. You need to avoid{' '}
              <strong className="text-white">one bad deal per year</strong> to make it worth it — and most investors catch multiple.
            </p>
            <Link
              href="/analyzer"
              className="inline-flex items-center gap-2 mt-6 bg-white text-indigo-700 hover:bg-indigo-50 font-bold px-6 py-3 rounded-xl text-sm transition-all"
            >
              Start Analyzing Deals Free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <h2 className="text-2xl font-extrabold text-zinc-900 mb-8 text-center">
            Frequently asked questions
          </h2>
          <div className="space-y-5">
            {faqs.map(({ q, a }) => (
              <div key={q} className="bg-zinc-50 rounded-2xl border border-zinc-200 p-6">
                <p className="text-base font-bold text-zinc-900 mb-2">{q}</p>
                <p className="text-sm text-zinc-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
