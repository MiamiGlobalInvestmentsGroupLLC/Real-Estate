'use client';

import { useState, useEffect } from 'react';
import { getSavedDeals, deleteSavedDeal, SavedDeal } from '@/lib/savedDeals';
import { formatCurrency } from '@/lib/calculations';
import { cn } from '@/lib/utils';

const decisionStyle = {
  BUY: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  NEGOTIATE: 'bg-amber-50 text-amber-700 border-amber-200',
  PASS: 'bg-red-50 text-red-700 border-red-200',
};

export default function SavedDeals() {
  const [deals, setDeals] = useState<SavedDeal[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) setDeals(getSavedDeals());
  }, [open]);

  function handleDelete(id: string) {
    deleteSavedDeal(id);
    setDeals((prev) => prev.filter((d) => d.id !== id));
  }

  const count = typeof window !== 'undefined' ? getSavedDeals().length : 0;

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-zinc-50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
          </svg>
          <span className="text-sm font-bold text-zinc-800">Saved Deals</span>
          {count > 0 && (
            <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{count}</span>
          )}
        </div>
        <svg
          className={cn('w-4 h-4 text-zinc-400 transition-transform', open && 'rotate-180')}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-zinc-100">
          {deals.length === 0 ? (
            <div className="px-5 py-6 text-center">
              <p className="text-sm text-zinc-500">No saved deals yet</p>
              <p className="text-xs text-zinc-400 mt-1">Analyze a deal and click "Save Deal"</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {deals.map((deal) => (
                <div key={deal.id} className="px-5 py-3.5 hover:bg-zinc-50 transition-colors group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded border', decisionStyle[deal.decision.decision])}>
                          {deal.decision.decision}
                        </span>
                        <span className="text-[10px] text-zinc-400 capitalize">{deal.strategy}</span>
                      </div>
                      <p className="text-xs font-semibold text-zinc-800 truncate">{deal.label}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-zinc-500">
                          Profit: <span className={cn('font-bold', deal.results.flipProfit >= 0 ? 'text-emerald-600' : 'text-red-600')}>
                            {formatCurrency(deal.results.flipProfit)}
                          </span>
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          Score: {deal.results.dealScore}/100
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <p className="text-[10px] text-zinc-400">
                        {new Date(deal.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                      <button
                        onClick={() => handleDelete(deal.id)}
                        className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
