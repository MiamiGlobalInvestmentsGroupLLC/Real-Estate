import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3.5 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Early Access — Free Unlimited
            </div>
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold px-3.5 py-1.5 rounded-full">
              Real Estate Decision Engine · Wholesalers &amp; Flippers
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-900 leading-tight tracking-tight mb-6">
            Know in{' '}
            <span className="relative">
              <span className="gradient-text">30 seconds</span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="6"
                viewBox="0 0 200 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 5C50 1 150 1 199 5"
                  stroke="url(#underline-gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="underline-gradient" x1="0" y1="0" x2="200" y2="0">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            {' '}if your deal is worth it
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop guessing. Make smarter offers and avoid costly mistakes.{' '}
            <span className="text-zinc-700 font-medium">DealEdge AI</span> gives you instant deal analysis,
            AI-driven decisions, and offer generation — all in one place.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/analyzer"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-7 py-3.5 rounded-2xl text-base shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-200 transition-all duration-200"
            >
              Analyze Your First Deal Free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-white hover:bg-zinc-50 text-zinc-700 font-semibold px-7 py-3.5 rounded-2xl text-base border border-zinc-300 shadow-sm transition-all"
            >
              View Pricing
            </Link>
          </div>

          {/* Trust signals */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-x-8 gap-y-2 mt-8">
            {[
              'No credit card required',
              '5 free deals/day',
              'Results in under 2 seconds',
            ].map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-sm text-zinc-500">
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Demo card */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="bg-white/80 backdrop-blur rounded-2xl border border-zinc-200 shadow-xl shadow-zinc-200/60 overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-1.5 px-4 py-3 bg-zinc-50 border-b border-zinc-200">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <div className="flex-1 mx-3">
                <div className="bg-zinc-200 rounded-md h-5 w-48 mx-auto" />
              </div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-zinc-100">
              {/* Inputs side */}
              <div className="p-5 space-y-3">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Deal Details</p>
                {[
                  { label: 'Purchase Price', value: '$180,000' },
                  { label: 'ARV', value: '$250,000' },
                  { label: 'Repair Costs', value: '$40,000' },
                  { label: 'Holding Costs', value: '$5,000' },
                  { label: 'Closing Costs', value: '$6,000' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">{label}</span>
                    <span className="text-xs font-bold text-zinc-900 bg-zinc-50 px-2 py-0.5 rounded-md border border-zinc-200">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Results side */}
              <div className="p-5">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Results</p>
                <div className="text-3xl font-extrabold text-emerald-500 mb-1">$19,000</div>
                <div className="text-xs text-zinc-500 mb-4">+8.2% margin · 8.3% ROI</div>

                <div className="inline-flex items-center gap-2 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg mb-4">
                  ↕ NEGOTIATE
                </div>

                <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                  Margin is thin at 8% — push for lower price to build buffer
                </div>

                <div className="mt-3 h-2 bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full w-[52%] bg-amber-400 rounded-full" />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-zinc-400">Score: 52/100</span>
                  <span className="text-[10px] text-amber-500 font-medium">Borderline</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-zinc-400 mt-3">
            Live demo — try it yourself above. Free, no signup needed.
          </p>
        </div>
      </div>
    </section>
  );
}
