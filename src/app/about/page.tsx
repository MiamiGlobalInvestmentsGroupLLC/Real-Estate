import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white border-b border-zinc-100 py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">About Us</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 mb-5">
              Built by investors, for investors
            </h1>
            <p className="text-lg text-zinc-500 leading-relaxed">
              DealEdge AI is a product of Miami Global Investments Group LLC — a real estate investment company
              based in Miami, Florida. We built the tool we always wished we had.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="text-2xl font-extrabold text-zinc-900 mb-4">Our Mission</h2>
          <p className="text-zinc-600 leading-relaxed mb-4">
            Real estate investing is one of the most powerful wealth-building vehicles available — but most
            investors waste hours on spreadsheets, make emotional decisions under pressure, and lose money on
            deals that were never going to work.
          </p>
          <p className="text-zinc-600 leading-relaxed mb-4">
            We built DealEdge AI to give every wholesaler and flipper the same analytical edge that institutional
            investors have had for decades — in under 30 seconds, on any device, with no spreadsheets required.
          </p>
          <p className="text-zinc-600 leading-relaxed">
            Our goal: help you avoid one bad deal. That&apos;s it. One saved deal easily covers years of
            subscription costs — and gives you the confidence to move fast on the good ones.
          </p>
        </section>

        {/* What we do */}
        <section className="bg-zinc-50 border-y border-zinc-100 py-14">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-extrabold text-zinc-900 mb-8">What DealEdge AI Does</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                {
                  title: 'Instant Deal Analysis',
                  desc: 'Enter any deal and get a complete analysis — profit, ROI, deal score, risk level, and AI decision — in under 2 seconds.',
                  icon: '📊',
                },
                {
                  title: 'AI Decision Engine',
                  desc: 'Our algorithm evaluates margin, price vs. MAO, ROI, and risk to give you a clear BUY, NEGOTIATE, or PASS recommendation.',
                  icon: '🤖',
                },
                {
                  title: 'SMS Deal Parser',
                  desc: 'Paste any plain-text deal description — from a text, email, or voicemail — and we extract the numbers automatically.',
                  icon: '📱',
                },
                {
                  title: 'Offer Generator',
                  desc: 'Generate professional seller SMS messages with your branding in seconds.',
                  icon: '📄',
                },
                {
                  title: 'Multi-Strategy Analysis',
                  desc: 'Analyze deals as a flip, wholesale assignment, or buy-and-hold rental with metrics tailored to each strategy.',
                  icon: '🏠',
                },
                {
                  title: 'Red Flag Detection',
                  desc: 'Automatically surface critical issues like negative margins, over-MAO pricing, and dangerously high repair ratios.',
                  icon: '🚨',
                },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-2xl border border-zinc-200 p-5">
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <p className="font-bold text-zinc-900 mb-1">{item.title}</p>
                  <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="text-2xl font-extrabold text-zinc-900 mb-4">About Miami Global Investments Group LLC</h2>
          <p className="text-zinc-600 leading-relaxed mb-4">
            Miami Global Investments Group LLC is a real estate investment company operating across South Florida
            and beyond. We specialize in off-market acquisitions, wholesaling, and value-add residential properties.
          </p>
          <p className="text-zinc-600 leading-relaxed mb-6">
            DealEdge AI was born out of our own internal need for faster, more consistent deal analysis. After
            using it internally and seeing how much time it saved, we decided to make it available to the broader
            investor community.
          </p>
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
            <p className="text-sm font-semibold text-indigo-800 mb-1">Headquartered in Miami, Florida</p>
            <p className="text-sm text-indigo-600">
              Miami Global Investments Group LLC · All rights reserved
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 text-center">
          <div className="bg-gradient-to-br from-indigo-600 to-cyan-600 rounded-2xl p-8 text-white">
            <p className="text-2xl font-extrabold mb-2">Ready to analyze your first deal?</p>
            <p className="text-indigo-100 text-sm mb-6">Free, no signup required. Results in under 2 seconds.</p>
            <Link href="/analyzer" className="inline-block bg-white text-indigo-700 hover:bg-indigo-50 font-bold px-6 py-3 rounded-xl text-sm transition-all">
              Start Analyzing Deals →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
