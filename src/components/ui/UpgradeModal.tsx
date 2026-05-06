'use client';

import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { EARLY_ACCESS } from '@/lib/config';

export default function UpgradeModal() {
  const { showUpgradeModal, setShowUpgradeModal, user } = useApp();

  // Never interrupt in early access mode
  if (EARLY_ACCESS) return null;

  if (!showUpgradeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setShowUpgradeModal(false)}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fadeIn">
        {/* Close */}
        <button
          onClick={() => setShowUpgradeModal(false)}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Icon */}
        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-200">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        <h2 className="text-2xl font-extrabold text-zinc-900 text-center mb-2">
          You've reached your free limit
        </h2>
        <p className="text-zinc-500 text-center text-sm mb-6">
          Free accounts get 5 deal analyses per day. Upgrade to Pro for unlimited deals — starting at just $9/month.
        </p>

        {/* Value prop */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-sm font-semibold text-amber-800 text-center">
            💡 Avoid one bad deal = save $10,000+
          </p>
          <p className="text-xs text-amber-700 text-center mt-1">
            DealEdge Pro pays for itself on a single deal
          </p>
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <Link
            href="/pricing"
            onClick={() => setShowUpgradeModal(false)}
            className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm shadow-indigo-200"
          >
            Unlock Unlimited Deals — $9/mo
          </Link>

          {!user ? (
            <Link
              href="/signup"
              onClick={() => setShowUpgradeModal(false)}
              className="block w-full text-center bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-semibold py-3 rounded-xl border border-zinc-200 transition-colors text-sm"
            >
              Create free account (resets daily limit)
            </Link>
          ) : null}

          <button
            onClick={() => setShowUpgradeModal(false)}
            className="block w-full text-center text-zinc-400 hover:text-zinc-600 text-sm transition-colors py-1"
          >
            Maybe later
          </button>
        </div>

        {/* Trust signal */}
        <p className="text-center text-xs text-zinc-400 mt-4">
          Used by real estate investors daily · Cancel anytime
        </p>
      </div>
    </div>
  );
}
