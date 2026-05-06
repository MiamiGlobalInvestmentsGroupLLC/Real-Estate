'use client';

import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { FREE_DAILY_LIMIT } from '@/lib/usage';
import { cn } from '@/lib/utils';

export default function UsageCounter() {
  const { user, usageCount } = useApp();
  if (user?.plan && user.plan !== 'free') return null;

  const remaining = Math.max(0, FREE_DAILY_LIMIT - usageCount);
  const pct = (usageCount / FREE_DAILY_LIMIT) * 100;
  const isLow = remaining <= 2;
  const isEmpty = remaining === 0;

  return (
    <div className={cn(
      'rounded-xl border p-3.5',
      isEmpty ? 'bg-red-50 border-red-200' :
      isLow ? 'bg-amber-50 border-amber-200' :
      'bg-zinc-50 border-zinc-200',
    )}>
      <div className="flex items-center justify-between mb-2">
        <p className={cn(
          'text-xs font-semibold',
          isEmpty ? 'text-red-700' : isLow ? 'text-amber-700' : 'text-zinc-600',
        )}>
          {isEmpty ? 'Daily limit reached' : `${remaining} free ${remaining === 1 ? 'analysis' : 'analyses'} left today`}
        </p>
        <Link href="/pricing" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
          Upgrade →
        </Link>
      </div>
      <div className="h-1.5 bg-white/80 rounded-full overflow-hidden border border-black/5">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            isEmpty ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-indigo-500',
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
