import { AIDecisionResult } from '@/lib/aiDecision';
import { formatCurrency } from '@/lib/calculations';
import { cn } from '@/lib/utils';

interface AIDecisionProps {
  decision: AIDecisionResult;
}

const config = {
  BUY: {
    bg: 'bg-gradient-to-br from-emerald-500 to-teal-500',
    lightBg: 'bg-emerald-50 border-emerald-200',
    badge: 'bg-white/20 text-white',
    text: 'text-white',
    sub: 'text-emerald-100',
    icon: '✓',
    nextAction: 'Move fast — lock it up at the suggested price.',
  },
  PASS: {
    bg: 'bg-gradient-to-br from-red-500 to-rose-600',
    lightBg: 'bg-red-50 border-red-200',
    badge: 'bg-white/20 text-white',
    text: 'text-white',
    sub: 'text-red-100',
    icon: '✕',
    nextAction: 'Walk away. Better deals exist — don\'t force bad numbers.',
  },
  NEGOTIATE: {
    bg: 'bg-gradient-to-br from-amber-500 to-orange-500',
    lightBg: 'bg-amber-50 border-amber-200',
    badge: 'bg-white/20 text-white',
    text: 'text-white',
    sub: 'text-amber-100',
    icon: '↕',
    nextAction: 'Counter at the suggested price. Don\'t pay asking.',
  },
};

const strategyColors: Record<string, string> = {
  Flip: 'bg-blue-100 text-blue-700',
  Wholesale: 'bg-purple-100 text-purple-700',
  Rental: 'bg-teal-100 text-teal-700',
  'Flip or Rental': 'bg-indigo-100 text-indigo-700',
};

export default function AIDecision({ decision }: AIDecisionProps) {
  const cfg = config[decision.decision];

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm">
      {/* Main decision card */}
      <div className={cn('p-5', cfg.bg)}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <span className="text-white text-lg font-black">{cfg.icon}</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">AI Decision</p>
              <p className={cn('text-2xl font-extrabold tracking-wide', cfg.text)}>
                {decision.decision}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/60 font-medium">Confidence</p>
            <p className="text-xl font-extrabold text-white">{decision.confidence}%</p>
          </div>
        </div>

        <p className={cn('text-sm font-medium leading-relaxed', cfg.sub)}>
          {decision.reason}
        </p>
      </div>

      {/* Suggested offer + next step */}
      <div className="bg-white border border-t-0 border-zinc-200 rounded-b-2xl p-4">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Suggested Offer</p>
            <p className="text-3xl font-extrabold text-zinc-900 tabular-nums">
              {formatCurrency(decision.suggestedOffer)}
            </p>
          </div>
          <div>
            <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-lg', strategyColors[decision.strategy])}>
              {decision.strategy}
            </span>
          </div>
        </div>

        {/* What to do next */}
        <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-100">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">What to do next</p>
          <p className="text-xs font-medium text-zinc-700">
            → {decision.decision === 'BUY'
              ? `Offer ${formatCurrency(decision.suggestedOffer)} and move quickly`
              : decision.decision === 'PASS'
                ? `Pass on this deal — walk away`
                : `Counter at ${formatCurrency(decision.suggestedOffer)} — don't pay asking`}
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">{cfg.nextAction}</p>
        </div>
      </div>
    </div>
  );
}
