'use client';

import { useState } from 'react';
import { AIDecisionResult } from '@/lib/aiDecision';
import { DealResults, formatCurrency } from '@/lib/calculations';
import { cn } from '@/lib/utils';

interface AIDecisionProps {
  decision: AIDecisionResult;
  results: DealResults;
}

const config = {
  BUY: {
    bg: 'bg-gradient-to-br from-emerald-500 to-teal-500',
    badge: 'bg-white/20 text-white',
    text: 'text-white',
    sub: 'text-emerald-100',
    icon: '✓',
    nextAction: 'Move fast — lock it up at the suggested price.',
    bulletColor: 'text-emerald-600',
    bulletBg: 'bg-emerald-50 border-emerald-200',
  },
  PASS: {
    bg: 'bg-gradient-to-br from-red-500 to-rose-600',
    badge: 'bg-white/20 text-white',
    text: 'text-white',
    sub: 'text-red-100',
    icon: '✕',
    nextAction: 'Walk away. Better deals exist — don\'t force bad numbers.',
    bulletColor: 'text-red-600',
    bulletBg: 'bg-red-50 border-red-200',
  },
  NEGOTIATE: {
    bg: 'bg-gradient-to-br from-amber-500 to-orange-500',
    badge: 'bg-white/20 text-white',
    text: 'text-white',
    sub: 'text-amber-100',
    icon: '↕',
    nextAction: 'Counter at the suggested price. Don\'t pay asking.',
    bulletColor: 'text-amber-600',
    bulletBg: 'bg-amber-50 border-amber-200',
  },
};

const strategyColors: Record<string, string> = {
  Flip: 'bg-blue-100 text-blue-700',
  Wholesale: 'bg-purple-100 text-purple-700',
  Rental: 'bg-teal-100 text-teal-700',
  'Flip or Rental': 'bg-indigo-100 text-indigo-700',
};

function getEducationBullets(decision: AIDecisionResult, results: DealResults): string[] {
  const { dealScore, marginPercent, roi, maxAllowableOffer } = results;
  const { decision: dec } = decision;
  const bullets: string[] = [];

  if (dec === 'BUY') {
    bullets.push(`Score ${dealScore}/100 — above the 65-point buy threshold`);
    bullets.push(`${marginPercent.toFixed(1)}% margin — meets the 15% minimum for a safe flip`);
    if (roi >= 20) bullets.push(`${roi.toFixed(1)}% ROI — exceptional return on investment`);
    else bullets.push(`${roi.toFixed(1)}% ROI — solid return on your total investment`);
    bullets.push(`Price is at or under your Max Allowable Offer (MAO) — room to profit`);
  } else if (dec === 'NEGOTIATE') {
    bullets.push(`Score ${dealScore}/100 — potential exists but numbers need improvement`);
    bullets.push(`${marginPercent.toFixed(1)}% margin — ideally you want 15%+ for a safe buffer`);
    if (maxAllowableOffer > 0) {
      const gap = decision.suggestedOffer - maxAllowableOffer;
      if (gap < 0) {
        bullets.push(`Suggested offer targets MAO — pushes price into profitable range`);
      } else {
        bullets.push(`Lowering price by $${Math.abs(Math.round(gap / 1000))}k would hit your MAO target`);
      }
    }
    bullets.push(`Profit exists but thin — one cost overrun could erase the margin`);
  } else {
    if (results.flipProfit < 0) {
      bullets.push(`Negative profit — this deal loses money at current numbers`);
    } else {
      bullets.push(`Score ${dealScore}/100 — below the minimum acceptable range`);
    }
    bullets.push(`${marginPercent.toFixed(1)}% margin — not enough buffer for cost overruns`);
    bullets.push(`Even with negotiation, numbers don't support a profitable exit`);
    bullets.push(`Better capital allocation exists — wait for a better deal`);
  }

  return bullets;
}

export default function AIDecision({ decision, results }: AIDecisionProps) {
  const [showWhy, setShowWhy] = useState(false);
  const cfg = config[decision.decision];
  const bullets = getEducationBullets(decision, results);

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
      <div className="bg-white border border-t-0 border-zinc-200 p-4">
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
        <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-100 mb-3">
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

        {/* Why this decision? toggle */}
        <button
          onClick={() => setShowWhy(!showWhy)}
          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-700 transition-colors"
        >
          <svg
            className={cn('w-3.5 h-3.5 transition-transform', showWhy && 'rotate-180')}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
          Why this decision?
        </button>

        {showWhy && (
          <div className={cn('mt-3 rounded-xl border p-3.5 space-y-2', cfg.bulletBg)}>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Key Factors</p>
            {bullets.map((bullet, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className={cn('text-xs mt-0.5 shrink-0 font-bold', cfg.bulletColor)}>
                  {decision.decision === 'BUY' ? '✓' : decision.decision === 'PASS' ? '✕' : '→'}
                </span>
                <p className="text-xs text-zinc-700 leading-relaxed">{bullet}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
