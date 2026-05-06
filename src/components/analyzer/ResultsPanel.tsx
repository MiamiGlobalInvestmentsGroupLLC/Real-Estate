'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DealInputs, DealResults, formatCurrency } from '@/lib/calculations';
import { AIDecisionResult } from '@/lib/aiDecision';
import { RedFlag } from '@/lib/redFlags';
import { saveDeal } from '@/lib/savedDeals';
import DealScore from '@/components/ui/DealScore';
import RiskBadge from '@/components/ui/RiskBadge';
import MetricCard from '@/components/ui/MetricCard';
import AIDecision from './AIDecision';
import RedFlagDetector from './RedFlagDetector';
import { cn } from '@/lib/utils';

type Strategy = 'flip' | 'wholesale' | 'rental';

interface ResultsPanelProps {
  results: DealResults | null;
  aiDecision: AIDecisionResult | null;
  redFlags: RedFlag[];
  inputs: DealInputs | null;
  strategy: Strategy;
}

const ratingConfig = {
  Excellent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Good: 'bg-blue-50 text-blue-700 border-blue-200',
  Borderline: 'bg-amber-50 text-amber-700 border-amber-200',
  Bad: 'bg-red-50 text-red-700 border-red-200',
};

export default function ResultsPanel({ results, aiDecision, redFlags, inputs, strategy }: ResultsPanelProps) {
  const [saved, setSaved] = useState(false);

  if (!results || !inputs) {
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

  function handleSave() {
    if (!results || !inputs || !aiDecision) return;
    const label = inputs.arv > 0
      ? `${formatCurrency(inputs.arv)} ARV · ${formatCurrency(inputs.purchasePrice)}`
      : `Deal saved`;
    saveDeal({ label, strategy, inputs, results, decision: aiDecision });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-4 animate-fadeIn">

      {/* Save deal button */}
      {aiDecision && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saved}
            className={cn(
              'flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg border transition-all',
              saved
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300',
            )}
          >
            {saved ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Saved!
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
                Save Deal
              </>
            )}
          </button>
        </div>
      )}

      {/* 1. AI Decision */}
      {aiDecision && <AIDecision decision={aiDecision} results={results} />}

      {/* 2. Strategy-specific primary metric */}
      {strategy === 'wholesale' ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Assignment Fee</p>
              <p className={cn(
                'text-4xl sm:text-5xl font-extrabold tabular-nums leading-none',
                results.wholesaleAssignmentFee >= 0 ? 'text-emerald-500' : 'text-red-500',
              )}>
                {formatCurrency(results.wholesaleAssignmentFee)}
              </p>
              <p className="text-sm text-zinc-500 mt-1.5 font-medium">
                MAO {formatCurrency(results.maxAllowableOffer)} − Purchase {formatCurrency(inputs.purchasePrice)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <RiskBadge level={results.riskLevel} />
              <span className={cn('text-xs font-bold px-2.5 py-1 rounded-lg border', ratingConfig[results.dealRating])}>
                {results.dealRating}
              </span>
            </div>
          </div>
          {results.wholesaleAssignmentFee < 0 && (
            <p className="mt-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">
              Purchase price exceeds MAO — hard to assign profitably at this price.
            </p>
          )}
        </div>
      ) : strategy === 'rental' && results.rentalCashFlow !== null ? (
        <div className={cn(
          'rounded-2xl border p-5',
          results.rentalCashFlow >= 0 ? 'bg-teal-50 border-teal-200' : 'bg-red-50 border-red-200',
        )}>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Monthly Cash Flow</p>
          <div className="flex items-end gap-4 mb-4">
            <p className={cn('text-4xl sm:text-5xl font-extrabold tabular-nums leading-none', results.rentalCashFlow >= 0 ? 'text-teal-600' : 'text-red-600')}>
              {formatCurrency(results.rentalCashFlow)}<span className="text-sm font-semibold text-zinc-400">/mo</span>
            </p>
            <span className={cn(
              'text-xs font-bold px-2.5 py-1 rounded-lg mb-1',
              results.rentalCashFlow >= 200 ? 'bg-teal-100 text-teal-700' :
              results.rentalCashFlow >= 0 ? 'bg-zinc-100 text-zinc-600' :
              'bg-red-100 text-red-600',
            )}>
              {results.rentalCashFlow >= 200 ? 'Cash Flows' : results.rentalCashFlow >= 0 ? 'Break Even' : 'Negative'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/70 rounded-xl p-3 border border-teal-100">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Cap Rate</p>
              <p className="text-lg font-extrabold text-zinc-900">{results.capRate !== null ? `${results.capRate.toFixed(1)}%` : '—'}</p>
              <p className="text-[10px] text-zinc-500">Annual NOI / Price</p>
            </div>
            <div className="bg-white/70 rounded-xl p-3 border border-teal-100">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Cash-on-Cash</p>
              <p className="text-lg font-extrabold text-zinc-900">{results.cashOnCash !== null ? `${results.cashOnCash.toFixed(1)}%` : '—'}</p>
              <p className="text-[10px] text-zinc-500">Annual CF / Down pmt</p>
            </div>
          </div>
          {results.monthlyMortgage && (
            <p className="text-xs text-zinc-500 mt-2.5">
              After {formatCurrency(results.monthlyMortgage)}/mo mortgage (20% down, 7%, 30yr)
            </p>
          )}
        </div>
      ) : (
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
      )}

      {/* 3. Deal Breakdown card */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm">
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Deal Breakdown</p>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-500">Purchase Price</span>
            <span className="font-semibold text-zinc-900 tabular-nums">{formatCurrency(inputs.purchasePrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">+ Repair Costs</span>
            <span className="font-semibold text-zinc-900 tabular-nums">{formatCurrency(inputs.repairCosts)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">+ Holding Costs</span>
            <span className="font-semibold text-zinc-900 tabular-nums">{formatCurrency(inputs.holdingCosts)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">+ Closing Costs</span>
            <span className="font-semibold text-zinc-900 tabular-nums">{formatCurrency(inputs.closingCosts)}</span>
          </div>
          <div className="h-px bg-zinc-100 my-2" />
          <div className="flex justify-between font-bold">
            <span className="text-zinc-700">Total Investment</span>
            <span className="text-zinc-900 tabular-nums">{formatCurrency(results.totalInvestment)}</span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-zinc-500">After Repair Value (ARV)</span>
            <span className="font-semibold text-zinc-900 tabular-nums">{formatCurrency(inputs.arv)}</span>
          </div>
          <div className="h-px bg-zinc-100 my-2" />
          <div className="flex justify-between font-extrabold">
            <span className={isProfit ? 'text-emerald-600' : 'text-red-600'}>
              {strategy === 'wholesale' ? 'Assignment Fee' : strategy === 'rental' ? 'Profit (if flipped)' : 'Flip Profit'}
            </span>
            <span className={cn('tabular-nums', isProfit ? 'text-emerald-600' : 'text-red-600')}>
              {formatCurrency(strategy === 'wholesale' ? results.wholesaleAssignmentFee : results.flipProfit)}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Deal Score */}
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

      {/* 5. Key metrics */}
      {strategy === 'wholesale' ? (
        <div className="grid grid-cols-2 gap-3">
          <MetricCard label="Max Allowable Offer" value={formatCurrency(results.maxAllowableOffer)} subtext="70% Rule" highlight />
          <MetricCard label="Assignment Fee" value={formatCurrency(results.wholesaleAssignmentFee)} subtext="MAO minus price" positive={results.wholesaleAssignmentFee > 0} negative={results.wholesaleAssignmentFee < 0} />
          <MetricCard label="Purchase Price" value={formatCurrency(inputs.purchasePrice)} subtext="Your cost basis" />
          <MetricCard label="Equity Gained" value={formatCurrency(results.equityGained)} subtext="ARV minus purchase" positive={results.equityGained > 0} negative={results.equityGained < 0} />
        </div>
      ) : strategy === 'rental' ? (
        <div className="grid grid-cols-2 gap-3">
          <MetricCard label="Max Allowable Offer" value={formatCurrency(results.maxAllowableOffer)} subtext="70% Rule" highlight />
          <MetricCard label="Annual Cash Flow" value={results.rentalCashFlow !== null ? formatCurrency(results.rentalCashFlow * 12) : '—'} subtext="Monthly × 12" positive={(results.rentalCashFlow ?? 0) > 0} negative={(results.rentalCashFlow ?? 0) < 0} />
          <MetricCard label="Cap Rate" value={results.capRate !== null ? `${results.capRate.toFixed(1)}%` : '—'} subtext="NOI / purchase price" positive={(results.capRate ?? 0) >= 6} />
          <MetricCard label="Cash-on-Cash" value={results.cashOnCash !== null ? `${results.cashOnCash.toFixed(1)}%` : '—'} subtext="CF / down payment" positive={(results.cashOnCash ?? 0) >= 8} negative={(results.cashOnCash ?? 0) < 0} />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <MetricCard label="Max Allowable Offer" value={formatCurrency(results.maxAllowableOffer)} subtext="70% Rule" highlight />
          <MetricCard label="Total Investment" value={formatCurrency(results.totalInvestment)} subtext="All-in cost" />
          <MetricCard label="ROI" value={`${results.roi.toFixed(1)}%`} subtext="Return on investment" positive={results.roi >= 15} negative={results.roi < 0} />
          <MetricCard label="Equity Gained" value={formatCurrency(results.equityGained)} subtext="ARV minus purchase" positive={results.equityGained > 0} negative={results.equityGained < 0} />
        </div>
      )}

      {/* 6. Rental cash flow (flip strategy only, if rent entered) */}
      {strategy === 'flip' && results.rentalCashFlow !== null && (
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

      {/* 7. Red flags */}
      <RedFlagDetector flags={redFlags} />

      {/* Urgency nudge */}
      <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 p-3.5 text-center">
        <p className="text-white text-xs font-semibold">
          💡 Avoid one bad deal = save $10,000+ · Used by investors daily
        </p>
      </div>

      {/* Legal micro-disclaimer */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-3.5">
        <div className="flex items-start gap-2">
          <svg className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="text-[10px] text-amber-800 leading-relaxed">
            <span className="font-bold">Disclaimer:</span> These results are mathematical estimates for informational
            purposes only — not financial, investment, or legal advice. DealEdge AI does not recommend buying or
            investing in any property. Always verify with licensed professionals before making any investment
            decision. You assume full responsibility for your financial choices.{' '}
            <Link href="/disclaimer" className="font-bold underline hover:text-amber-900" target="_blank">
              Full disclaimer
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
