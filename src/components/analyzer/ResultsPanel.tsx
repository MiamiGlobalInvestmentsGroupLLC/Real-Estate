'use client';

import { DealResults, formatCurrency } from '@/lib/calculations';
import { AIDecisionResult } from '@/lib/aiDecision';
import { RedFlag } from '@/lib/redFlags';
import DealScore from '@/components/ui/DealScore';
import RiskBadge from '@/components/ui/RiskBadge';
import MetricCard from '@/components/ui/MetricCard';
import AIDecision from './AIDecision';
import RedFlagDetector from './RedFlagDetector';
import { cn } from '@/lib/utils';

interface ResultsPanelProps {
  results: DealResults | null;
  aiDecision: AIDecisionResult | null;
  redFlags: RedFlag[];
}

const ratingConfig = {
  Excellent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Good: 'bg-blue-50 text-blue-700 border-blue-200',
  Borderline: 'bg-amber-50 text-amber-700 border-amber-200',
  Bad: 'bg-red-50 text-red-700 border-red-200',
};

export default function ResultsPanel({ results, aiDecision, redFlags }: ResultsPanelProps) {
  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[460px] text-center p-8">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-cyan-100 rounded-2xl flex items-center justify-center mb-5 shadow-sm">
          <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-base font-semibold text-zinc-700">Enter deal details to the left</p>
        <p className="text-sm text-zinc-400 mt-1.5 max-w-xs">
          Results appear instantly — no submit needed
        </p>
        <div className="mt-8 w-full grid grid-cols-2 gap-3 opacity-30 pointer-events-none select-none">
          {['AI Decision', 'Flip Profit', 'Deal Score', 'Max Offer'].map((l) => (
            <div key={l} className="rounded-xl border border-zinc-200 bg-white p-4">
              <p className="text-xs text-zinc-400 mb-2">{l}</p>
              <div className="h-5 bg-zinc-100 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const isProfit = results.flipProfit >= 0;
  const scoreColor = results.dealScore >= 65 ? 'bg-emerald-500' : results.dealScore >= 40 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="space-y-4 animate-fadeIn">

      {/* 1. AI Decision — TOP (most important) */}
      {aiDecision && <AIDecision decision={aiDecision} />}

      {/* 2. Profit + rating */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Flip Profit</p>
            <p className={cn(
              'text-4xl sm:text-5xl font-extrabold tabular-nums leading-none',
              isProfit ? 'text-emerald-500' : 'text-red-500',
            )}>
              {formatCurrency(results.flipProfit)}
            </p>
            <p className="text-sm text-zinc-500 mt-1.5 font-medium">
              {results.marginPercent >= 0 ? '+' : ''}{results.marginPercent.toFixed(1)}% margin
              &nbsp;·&nbsp;
              {results.roi.toFixed(1)}% ROI
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <RiskBadge level={results.riskLevel} />
            <span className={cn('text-xs font-bold px-2.5 py-1 rounded-lg border', ratingConfig[results.dealRating])}>
              {results.dealRating}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Deal Score */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Deal Score</p>
            <p className="text-2xl font-extrabold text-zinc-900 tabular-nums">
              {results.dealScore}<span className="text-sm font-semibold text-zinc-400">/100</span>
            </p>
          </div>
          <DealScore score={results.dealScore} />
        </div>
        <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-700', scoreColor)}
            style={{ width: `${results.dealScore}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-zinc-400">0 – Bad</span>
          <span className="text-[10px] text-zinc-400">50 – Borderline</span>
          <span className="text-[10px] text-zinc-400">75+ Excellent</span>
        </div>
      </div>

      {/* 4. Key metrics */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard label="Max Allowable Offer" value={formatCurrency(results.maxAllowableOffer)} subtext="70% Rule" highlight />
        <MetricCard label="Total Investment" value={formatCurrency(results.totalInvestment)} subtext="All-in cost" />
        <MetricCard label="ROI" value={`${results.roi.toFixed(1)}%`} subtext="Return on investment" positive={results.roi >= 15} negative={results.roi < 0} />
        <MetricCard label="Equity Gained" value={formatCurrency(results.equityGained)} subtext="ARV minus purchase" positive={results.equityGained > 0} negative={results.equityGained < 0} />
      </div>

      {/* 5. Rental cash flow */}
      {results.rentalCashFlow !== null && (
        <div className={cn(
          'rounded-2xl border p-5',
          results.rentalCashFlow >= 0 ? 'bg-teal-50 border-teal-200' : 'bg-red-50 border-red-200',
        )}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Monthly Rental Cash Flow</p>
              <p className={cn('text-3xl font-extrabold tabular-nums', results.rentalCashFlow >= 0 ? 'text-teal-600' : 'text-red-600')}>
                {formatCurrency(results.rentalCashFlow)}<span className="text-sm font-semibold text-zinc-400">/mo</span>
              </p>
            </div>
            <span className={cn(
              'text-xs font-bold px-2.5 py-1 rounded-lg',
              results.rentalCashFlow >= 200 ? 'bg-teal-100 text-teal-700' :
              results.rentalCashFlow >= 0 ? 'bg-zinc-100 text-zinc-600' :
              'bg-red-100 text-red-600',
            )}>
              {results.rentalCashFlow >= 200 ? 'Cash Flows' : results.rentalCashFlow >= 0 ? 'Break Even' : 'Negative'}
            </span>
          </div>
          {results.monthlyMortgage && (
            <p className="text-xs text-zinc-500 mt-2">
              After {formatCurrency(results.monthlyMortgage)}/mo mortgage (20% down, 7%, 30yr)
            </p>
          )}
        </div>
      )}

      {/* 6. Red flags */}
      <RedFlagDetector flags={redFlags} />

      {/* Urgency nudge */}
      <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 p-3.5 text-center">
        <p className="text-white text-xs font-semibold">
          💡 Avoid one bad deal = save $10,000+ · Used by investors daily
        </p>
      </div>
    </div>
  );
}
