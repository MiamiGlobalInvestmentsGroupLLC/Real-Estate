'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-start gap-3">
      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
        <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-extrabold text-amber-800 mb-0.5 uppercase tracking-wide">
          For Informational Use Only — Not Financial Advice
        </p>
        <p className="text-xs text-amber-700 leading-relaxed">
          Results are estimates only. DealEdge AI does not recommend buying or investing in any property.
          Always verify with licensed professionals before making any investment decision.{' '}
          <Link href="/disclaimer" className="font-bold underline hover:text-amber-900 transition-colors" target="_blank">
            Read full disclaimer →
          </Link>
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-amber-400 hover:text-amber-600 transition-colors shrink-0 mt-0.5"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
