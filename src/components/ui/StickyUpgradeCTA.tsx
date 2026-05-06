'use client';

import Link from 'next/link';
import { useApp } from '@/context/AppContext';

export default function StickyUpgradeCTA() {
  const { user } = useApp();
  if (user?.plan && user.plan !== 'free') return null;

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
