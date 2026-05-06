'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const { updateProfile, user } = useApp();
  const params = useSearchParams();
  const plan = params.get('plan') ?? 'pro';

  useEffect(() => {
    if (user) {
      updateProfile({ plan: plan as 'pro' | 'investor' });
    }
  }, [user, plan, updateProfile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl max-w-md w-full p-10 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold text-zinc-900 mb-2">You're all set!</h1>
        <p className="text-zinc-500 text-sm mb-7">
          Your {plan === 'investor' ? 'Investor' : 'Pro'} plan is now active. Enjoy unlimited deal analyses and all premium features.
        </p>
        <Link
          href="/analyzer"
          className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
        >
          Start Analyzing Deals →
        </Link>
        <Link href="/pricing" className="block mt-3 text-sm text-zinc-400 hover:text-zinc-600 transition-colors">
          View your plan details
        </Link>
      </div>
    </div>
  );
}

export default function UpgradeSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
