import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import WhyDifferent from '@/components/landing/WhyDifferent';
import PricingPlans from '@/components/landing/PricingPlans';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <WhyDifferent />

        {/* Social proof strip */}
        <section className="bg-white border-y border-zinc-100 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
              {[
                { value: '< 2s', label: 'Average analysis time' },
                { value: '70%', label: 'Rule built-in automatically' },
                { value: '9+', label: 'Automatic risk checks' },
                { value: '$0', label: 'To get started today' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-3xl font-extrabold text-zinc-900 mb-1 tabular-nums">{value}</p>
                  <p className="text-sm text-zinc-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PricingPlans />

        {/* Final CTA */}
        <section className="bg-gradient-to-br from-indigo-600 to-cyan-600 py-20 sm:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Ready to analyze your first deal?
            </h2>
            <p className="text-indigo-100 text-base mb-8 max-w-xl mx-auto">
              Free to start. No credit card required. Get your first analysis in under 30 seconds.
            </p>
            <Link
              href="/analyzer"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 font-bold px-8 py-4 rounded-2xl text-base shadow-lg transition-all"
            >
              Analyze Your First Deal Free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
