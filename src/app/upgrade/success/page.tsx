'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

type VerifyState = 'loading' | 'success' | 'no_session' | 'error';

function SuccessContent() {
  const { updateProfile, user } = useApp();
  const params = useSearchParams();
  const sessionId = params.get('session_id');
  const planParam = (params.get('plan') ?? 'pro') as 'pro' | 'investor';

  const [state, setState] = useState<VerifyState>(sessionId ? 'loading' : 'no_session');
  const [activatedPlan, setActivatedPlan] = useState<string>(planParam);
  const [accessUntil, setAccessUntil] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    async function verify() {
      try {
        const res = await fetch(`/api/stripe/verify-session?session_id=${sessionId}&plan=${planParam}`);
        const data = await res.json();

        if (!res.ok || !data.verified) {
          setState('error');
          return;
        }

        const plan = data.plan ?? planParam;
        setActivatedPlan(plan);
        if (data.currentPeriodEnd) {
          setAccessUntil(new Date(data.currentPeriodEnd).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
          }));
        }

        updateProfile({
          plan,
          stripeCustomerId: data.customerId ?? undefined,
          stripeSubscriptionId: data.subscriptionId ?? undefined,
          subscriptionStatus: 'active',
          subscriptionCurrentPeriodEnd: data.currentPeriodEnd ?? undefined,
          subscriptionValidated: true,
        });

        setState('success');
      } catch {
        setState('error');
      }
    }

    verify();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl max-w-md w-full p-10 text-center">
          <div className="w-14 h-14 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-5" />
          <p className="text-zinc-600 font-semibold">Verifying your payment…</p>
          <p className="text-zinc-400 text-sm mt-1">This only takes a second.</p>
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl max-w-md w-full p-10 text-center">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="text-xl font-extrabold text-zinc-900 mb-2">Payment verification failed</h1>
          <p className="text-zinc-500 text-sm mb-6">
            We couldn&apos;t verify your payment automatically. If you completed checkout, please contact us and we&apos;ll activate your plan manually.
          </p>
          <Link href="/contact" className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm mb-3 transition-colors">
            Contact Support
          </Link>
          <Link href="/pricing" className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors">
            Back to Pricing
          </Link>
        </div>
      </div>
    );
  }

  if (state === 'no_session') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl max-w-md w-full p-10 text-center">
          <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-extrabold text-zinc-900 mb-2">Payment pending confirmation</h1>
          <p className="text-zinc-500 text-sm mb-6">
            Your payment may be processing. If you completed checkout, please contact us with your email to activate your plan.
          </p>
          <Link href="/contact" className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm mb-3 transition-colors">
            Contact Support →
          </Link>
          <Link href="/pricing" className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors">
            Back to Pricing
          </Link>
        </div>
      </div>
    );
  }

  // success
  const planLabel = activatedPlan === 'investor' ? 'Investor' : 'Pro';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl max-w-md w-full p-10 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          Payment Verified
        </div>
        <h1 className="text-2xl font-extrabold text-zinc-900 mb-2">Welcome to {planLabel}!</h1>
        <p className="text-zinc-500 text-sm mb-2">
          Your {planLabel} plan is now active. Enjoy unlimited deal analyses and all premium features.
        </p>
        {accessUntil && (
          <p className="text-xs text-zinc-400 mb-7">Next billing date: {accessUntil}</p>
        )}
        {!accessUntil && <div className="mb-7" />}
        <Link
          href="/analyzer"
          className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-colors text-sm mb-3"
        >
          Start Analyzing Deals →
        </Link>
        <Link href="/dashboard" className="block text-sm text-zinc-400 hover:text-zinc-600 transition-colors">
          View your dashboard
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
