const features = [
  {
    title: 'Faster Than Any Competitor',
    description:
      'Results in under 2 seconds. No page reloads, no submit buttons, no waiting. Numbers update live as you type.',
    badge: '⚡ Speed',
    badgeColor: 'bg-amber-100 text-amber-700',
    metric: '< 2s',
    metricLabel: 'analysis time',
  },
  {
    title: 'AI Decisions, Not Just Numbers',
    description:
      'Get a clear BUY / PASS / NEGOTIATE verdict from our AI — built to think like a senior investor. No interpretation needed.',
    badge: '🧠 Intelligence',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    metric: '3',
    metricLabel: 'clear decisions',
  },
  {
    title: 'Simpler Than Any Alternative',
    description:
      'No spreadsheets, no cluttered dashboards. Clean UI designed for mobile. Enter a deal in under 10 seconds.',
    badge: '✦ Simplicity',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    metric: '6',
    metricLabel: 'inputs total',
  },
  {
    title: 'SMS Deal Engine',
    description:
      'Paste deal descriptions from text messages, emails, or voicemails. We parse the numbers automatically and run the analysis.',
    badge: '📱 SMS Parser',
    badgeColor: 'bg-cyan-100 text-cyan-700',
    metric: '100%',
    metricLabel: 'auto-extracted',
  },
  {
    title: 'Red Flag Detection',
    description:
      'Automatic warnings for overpriced deals, unrealistic rehab estimates, thin margins, and high-risk flips — before you make an offer.',
    badge: '🚨 Risk Engine',
    badgeColor: 'bg-red-100 text-red-700',
    metric: '9+',
    metricLabel: 'risk checks',
  },
  {
    title: 'Instant Offer Generator',
    description:
      'Generate a professional seller SMS in one click. Ready to copy and send — no formatting required.',
    badge: '📄 Offers',
    badgeColor: 'bg-purple-100 text-purple-700',
    metric: '1-click',
    metricLabel: 'offer ready',
  },
];

const comparisons = [
  { feature: 'Results in < 2 seconds', dealedge: true, competitors: false },
  { feature: 'AI BUY / PASS / NEGOTIATE decision', dealedge: true, competitors: false },
  { feature: 'SMS text parsing', dealedge: true, competitors: false },
  { feature: 'Red flag auto-detection', dealedge: true, competitors: false },
  { feature: 'Instant offer generator', dealedge: true, competitors: true },
  { feature: 'Mobile-first design', dealedge: true, competitors: false },
  { feature: 'Starts at $9/month', dealedge: true, competitors: false },
];

export default function WhyDifferent() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">
            Why DealEdge AI
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 mb-4">
            Smarter. Faster. Simpler.
          </h2>
          <p className="text-base text-zinc-500 max-w-xl mx-auto">
            Built specifically for wholesalers and flippers — not enterprise tools with a learning curve.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-zinc-50 rounded-2xl border border-zinc-200 p-6 hover:bg-white hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${f.badgeColor}`}>
                  {f.badge}
                </span>
                <div className="text-right">
                  <p className="text-xl font-extrabold text-zinc-900 tabular-nums">{f.metric}</p>
                  <p className="text-[10px] text-zinc-400 font-medium">{f.metricLabel}</p>
                </div>
              </div>
              <h3 className="text-base font-bold text-zinc-900 mb-2">{f.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div className="max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-zinc-900 text-center mb-6">
            How we compare
          </h3>
          <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
            <div className="grid grid-cols-3 bg-zinc-50 border-b border-zinc-200 text-xs font-bold text-zinc-500 uppercase tracking-wider">
              <div className="col-span-1 px-5 py-3">Feature</div>
              <div className="px-5 py-3 text-center text-indigo-600">DealEdge AI</div>
              <div className="px-5 py-3 text-center">Competitors</div>
            </div>
            {comparisons.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-3 text-sm ${i < comparisons.length - 1 ? 'border-b border-zinc-100' : ''}`}
              >
                <div className="col-span-1 px-5 py-3.5 text-zinc-700 font-medium">{row.feature}</div>
                <div className="px-5 py-3.5 flex justify-center">
                  {row.dealedge ? (
                    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div className="px-5 py-3.5 flex justify-center">
                  {row.competitors ? (
                    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
