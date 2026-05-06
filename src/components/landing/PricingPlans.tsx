import Link from 'next/link';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    description: 'Perfect for trying DealEdge AI on your first deals.',
    cta: 'Start Free',
    ctaHref: '/analyzer',
    highlighted: false,
    features: [
      '5 deal analyses per day',
      'Full deal calculator',
      'Deal score & risk level',
      'Red flag detection',
      'Mobile-friendly',
    ],
    missing: ['AI decision engine', 'SMS Deal Engine', 'Offer generator', 'Save deals'],
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/month',
    badge: 'Most Popular',
    description: 'Everything you need for active wholesaling and flipping.',
    cta: 'Start Pro',
    ctaHref: '/pricing',
    highlighted: true,
    features: [
      'Unlimited deal analyses',
      'Full AI decision engine',
      'SMS Deal Engine',
      'Red flag auto-detection',
      'Save & track deals',
      'Priority support',
    ],
    missing: ['Offer generator (PDF + SMS)', 'Export reports'],
  },
  {
    name: 'Investor',
    price: '$19',
    period: '/month',
    description: 'For serious investors running multiple deals at once.',
    cta: 'Start Investor',
    ctaHref: '/pricing',
    highlighted: false,
    features: [
      'Everything in Pro',
      'Offer generator (PDF + SMS)',
      'Advanced deal scoring',
      'Export reports',
      'Deal history & analytics',
      'Priority onboarding call',
    ],
    missing: [],
  },
];

export default function PricingPlans({ compact = false }: { compact?: boolean }) {
  return (
    <section className={cn('bg-zinc-50', compact ? 'py-16' : 'py-20 sm:py-28')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 mb-4">
            More affordable than the competition
          </h2>
          <p className="text-base text-zinc-500 max-w-xl mx-auto">
            Avoiding one bad deal saves you{' '}
            <span className="font-semibold text-zinc-700">$10,000 or more</span>.
            DealEdge AI pays for itself on the first deal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'relative rounded-2xl border p-7 flex flex-col transition-all',
                plan.highlighted
                  ? 'bg-indigo-600 border-indigo-500 shadow-2xl shadow-indigo-300/40 scale-[1.02]'
                  : 'bg-white border-zinc-200 shadow-sm hover:shadow-md',
              )}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-amber-400 text-amber-900 text-xs font-extrabold px-3 py-1 rounded-full shadow-sm">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <p className={cn('text-sm font-bold mb-1', plan.highlighted ? 'text-indigo-200' : 'text-zinc-500')}>
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={cn('text-4xl font-extrabold', plan.highlighted ? 'text-white' : 'text-zinc-900')}>
                    {plan.price}
                  </span>
                  <span className={cn('text-sm font-medium', plan.highlighted ? 'text-indigo-300' : 'text-zinc-400')}>
                    {plan.period}
                  </span>
                </div>
                <p className={cn('text-sm', plan.highlighted ? 'text-indigo-200' : 'text-zinc-500')}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-2.5 mb-7 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <svg
                      className={cn('w-4 h-4 mt-0.5 shrink-0', plan.highlighted ? 'text-indigo-300' : 'text-emerald-500')}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className={cn('text-sm', plan.highlighted ? 'text-indigo-100' : 'text-zinc-700')}>
                      {f}
                    </span>
                  </li>
                ))}
                {plan.missing.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 opacity-40">
                    <svg
                      className={cn('w-4 h-4 mt-0.5 shrink-0', plan.highlighted ? 'text-indigo-400' : 'text-zinc-400')}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className={cn('text-sm', plan.highlighted ? 'text-indigo-300' : 'text-zinc-400')}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.ctaHref}
                className={cn(
                  'block text-center py-3 rounded-xl font-bold text-sm transition-all',
                  plan.highlighted
                    ? 'bg-white text-indigo-700 hover:bg-indigo-50'
                    : 'bg-zinc-900 text-white hover:bg-zinc-700',
                )}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {!compact && (
          <p className="text-center text-sm text-zinc-400 mt-8">
            All plans include a 14-day money-back guarantee. Cancel anytime.
          </p>
        )}
      </div>
    </section>
  );
}
