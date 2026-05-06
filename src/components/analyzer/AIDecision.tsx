import { AIDecisionResult } from '@/lib/aiDecision';
import { formatCurrency } from '@/lib/calculations';
import { cn } from '@/lib/utils';

interface AIDecisionProps {
  decision: AIDecisionResult;
}

const decisionConfig = {
  BUY: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    badge: 'bg-emerald-500 text-white',
    text: 'text-emerald-800',
    icon: (
      <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: '✓ BUY',
  },
  PASS: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-500 text-white',
    text: 'text-red-800',
    icon: (
      <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: '✕ PASS',
  },
  NEGOTIATE: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badge: 'bg-amber-500 text-white',
    text: 'text-amber-800',
    icon: (
      <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
    label: '↕ NEGOTIATE',
  },
};

const strategyColors: Record<string, string> = {
  Flip: 'bg-blue-100 text-blue-700',
  Wholesale: 'bg-purple-100 text-purple-700',
  Rental: 'bg-teal-100 text-teal-700',
  'Flip or Rental': 'bg-indigo-100 text-indigo-700',
};

export default function AIDecision({ decision }: AIDecisionProps) {
  const cfg = decisionConfig[decision.decision];

  return (
    <div className={cn('rounded-2xl border p-5 animate-fadeIn', cfg.bg, cfg.border)}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          {cfg.icon}
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">
              AI Decision
            </p>
            <span
              className={cn(
                'inline-block text-sm font-extrabold px-3 py-1 rounded-lg tracking-wide',
                cfg.badge,
              )}
            >
              {cfg.label}
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] text-zinc-400 font-medium">Confidence</p>
          <p className="text-sm font-bold text-zinc-700">{decision.confidence}%</p>
        </div>
      </div>

      <p className={cn('text-sm font-medium leading-snug mb-3', cfg.text)}>
        {decision.reason}
      </p>

      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-black/5">
        <div>
          <span className="text-[10px] text-zinc-400 block font-medium">Strategy</span>
          <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-md', strategyColors[decision.strategy])}>
            {decision.strategy}
          </span>
        </div>
        <div className="ml-auto text-right">
          <span className="text-[10px] text-zinc-400 block font-medium">Suggested Offer</span>
          <span className="text-sm font-bold text-zinc-900 tabular-nums">
            {formatCurrency(decision.suggestedOffer)}
          </span>
        </div>
      </div>
    </div>
  );
}
