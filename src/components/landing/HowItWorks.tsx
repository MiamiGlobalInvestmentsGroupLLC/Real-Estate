const steps = [
  {
    number: '01',
    title: 'Enter the Numbers',
    description:
      'Input purchase price, ARV, and repair costs. Or paste a deal description in plain text — our SMS engine extracts everything automatically.',
    color: 'bg-indigo-50 border-indigo-200 text-indigo-600',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Get an Instant Decision',
    description:
      'Our AI decision engine analyzes every metric and returns a clear BUY / PASS / NEGOTIATE verdict in under 2 seconds — with a reason, strategy, and suggested offer.',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-600',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Make Your Move',
    description:
      'Generate a professional offer letter or seller SMS in one click. Know your max offer, ROI, and deal score — then act with confidence.',
    color: 'bg-cyan-50 border-cyan-200 text-cyan-600',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-zinc-50 py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 mb-4">
            From deal to decision in 3 steps
          </h2>
          <p className="text-base text-zinc-500 max-w-xl mx-auto">
            No learning curve. No complexity. Just fast, accurate deal analysis built for how investors actually work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative bg-white rounded-2xl border border-zinc-200 p-7 shadow-sm hover:shadow-md transition-shadow"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Step number */}
              <div className="flex items-start justify-between mb-5">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${step.color}`}>
                  {step.icon}
                </div>
                <span className="text-4xl font-black text-zinc-100">{step.number}</span>
              </div>

              <h3 className="text-lg font-bold text-zinc-900 mb-2">{step.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{step.description}</p>

              {/* Connector arrow */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 -right-4 z-10">
                  <svg className="w-8 h-8 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Time callout */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-2xl p-6 sm:p-8 text-white text-center">
          <p className="text-4xl font-extrabold mb-2">{'< 30 seconds'}</p>
          <p className="text-indigo-100 text-base">
            Average time from entering deal details to getting a full analysis — including AI decision, deal score, and red flags
          </p>
        </div>
      </div>
    </section>
  );
}
