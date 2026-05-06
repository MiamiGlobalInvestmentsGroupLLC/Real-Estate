'use client';

import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { EARLY_ACCESS } from '@/lib/config';

export default function StickyUpgradeCTA() {
  const { user } = useApp();

  // Hide for paid users regardless of mode
  if (user?.plan && user.plan !== 'free') return null;

  if (EARLY_ACCESS) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white/90 backdrop-blur border-t border-zinc-200 px-4 py-2.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <p className="text-xs font-semibold text-zinc-700 truncate">Early access — free for now</p>
          </div>
          <Link
            href="/pricing"
            className="shrink-0 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            See plans →
          </Link>
        </div>
      </div>
    );
  }

  // Hard upgrade CTA when early access ends
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white border-t border-zinc-200 p-3 shadow-lg">
      <Link
        href="/pricing"
        className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Upgrade to Pro — Unlimited Deals
      </Link>
    </div>
  );
}
