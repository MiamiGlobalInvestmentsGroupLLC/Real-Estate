'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { EARLY_ACCESS } from '@/lib/config';
import UpgradeButton from '@/components/ui/UpgradeButton';

const planColors: Record<string, string> = {
  free: 'bg-zinc-100 text-zinc-700 border-zinc-200',
  pro: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  investor: 'bg-amber-100 text-amber-700 border-amber-200',
};

const planFeatures: Record<string, string[]> = {
  free: ['5 analyses/day', 'Full deal calculator', 'Deal score & risk level'],
  pro: ['Unlimited analyses', 'AI decision engine', 'SMS Engine', 'Offer Generator', 'Save & track deals'],
  investor: ['Everything in Pro', 'Advanced scoring', 'Export reports', 'Deal analytics', 'Priority onboarding'],
};

export default function DashboardPage() {
  const { user, updateProfile, isLoading } = useApp();
  const [cancelState, setCancelState] = useState<'idle' | 'confirming' | 'loading' | 'done' | 'error'>('idle');
  const [cancelError, setCancelError] = useState('');
  const [accessUntil, setAccessUntil] = useState('');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-zinc-50">
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm max-w-sm w-full p-10 text-center">
          <p className="text-lg font-extrabold text-zinc-900 mb-2">Sign in to view your dashboard</p>
          <p className="text-sm text-zinc-500 mb-6">Access your subscription, usage stats, and settings.</p>
          <Link href="/login" className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm transition-colors mb-3">
            Sign In
          </Link>
          <Link href="/signup" className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors">
            Create a free account
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = user.plan !== 'free';
  const periodEnd = user.subscriptionCurrentPeriodEnd
    ? new Date(user.subscriptionCurrentPeriodEnd).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : null;
  const isCanceled = user.subscriptionStatus === 'canceled';

  async function handleCancel() {
    if (!user?.stripeSubscriptionId) {
      // No subscription ID stored — contact support
      setCancelError('No subscription ID found. Please contact support to cancel.');
      setCancelState('error');
      return;
    }
    setCancelState('loading');
    try {
      const res = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: user.stripeSubscriptionId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Cancel failed');
      setAccessUntil(
        data.accessUntil
          ? new Date(data.accessUntil).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
          : '',
      );
      updateProfile({ subscriptionStatus: 'canceled' });
      setCancelState('done');
    } catch (err) {
      setCancelError(err instanceof Error ? err.message : 'Failed to cancel. Please contact support.');
      setCancelState('error');
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-50 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-zinc-900">Dashboard</h1>
            <p className="text-sm text-zinc-500 mt-1">Manage your subscription and account.</p>
          </div>

          {/* Account card */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 mb-5">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-lg font-extrabold text-indigo-700">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-extrabold text-zinc-900">{user.name}</p>
                <p className="text-sm text-zinc-500">{user.email}</p>
              </div>
              <span className={cn('ml-auto text-xs font-bold px-3 py-1 rounded-full border capitalize', planColors[user.plan])}>
                {user.plan}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Plan</p>
                <p className="font-extrabold text-zinc-900 capitalize">{user.plan}</p>
                <ul className="mt-2 space-y-1">
                  {planFeatures[user.plan].map((f) => (
                    <li key={f} className="flex items-center gap-1.5 text-xs text-zinc-600">
                      <svg className="w-3 h-3 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Subscription</p>
                {isPaid ? (
                  <>
                    <p className="font-semibold text-zinc-900 capitalize">
                      {isCanceled ? 'Canceled' : user.subscriptionStatus ?? 'Active'}
                    </p>
                    {periodEnd && (
                      <p className="text-xs text-zinc-500 mt-1">
                        {isCanceled ? 'Access until' : 'Renews'}: {periodEnd}
                      </p>
                    )}
                    {EARLY_ACCESS && (
                      <p className="text-xs text-emerald-600 font-semibold mt-1">
                        Early access — no charge yet
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-zinc-900">Free tier</p>
                    <p className="text-xs text-zinc-500 mt-1">5 analyses per day</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Upgrade prompt for free users */}
          {!isPaid && !EARLY_ACCESS && (
            <div className="bg-gradient-to-br from-indigo-600 to-cyan-600 rounded-2xl p-6 mb-5 text-white">
              <p className="font-extrabold text-lg mb-1">Upgrade to Pro</p>
              <p className="text-indigo-100 text-sm mb-4">Unlock unlimited analyses, AI decisions, and offer generation.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <UpgradeButton
                  plan="pro"
                  className="flex-1 text-center bg-white text-indigo-700 hover:bg-indigo-50 font-bold py-2.5 rounded-xl text-sm transition-colors"
                >
                  Pro — $9/month
                </UpgradeButton>
                <UpgradeButton
                  plan="investor"
                  className="flex-1 text-center bg-white/20 hover:bg-white/30 text-white font-bold py-2.5 rounded-xl text-sm transition-colors border border-white/30"
                >
                  Investor — $19/month
                </UpgradeButton>
              </div>
            </div>
          )}

          {/* Cancel subscription */}
          {isPaid && !isCanceled && cancelState !== 'done' && (
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 mb-5">
              <p className="font-bold text-zinc-900 mb-1">Cancel Subscription</p>
              <p className="text-sm text-zinc-500 mb-4">
                Your access continues until the end of your billing period. No refunds for partial months.
              </p>

              {cancelState === 'idle' && (
                <button
                  onClick={() => setCancelState('confirming')}
                  className="text-sm font-semibold text-red-600 hover:text-red-800 border border-red-200 hover:border-red-300 px-4 py-2 rounded-xl transition-colors"
                >
                  Cancel subscription
                </button>
              )}

              {cancelState === 'confirming' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-red-800 mb-3">
                    Are you sure? You&apos;ll lose access to all Pro features at period end.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleCancel}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
                    >
                      Yes, cancel my subscription
                    </button>
                    <button
                      onClick={() => setCancelState('idle')}
                      className="flex-1 bg-white border border-zinc-200 text-zinc-700 font-semibold py-2.5 rounded-xl text-sm transition-colors hover:bg-zinc-50"
                    >
                      Keep subscription
                    </button>
                  </div>
                </div>
              )}

              {cancelState === 'loading' && (
                <div className="flex items-center gap-2 text-zinc-500 text-sm">
                  <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
                  Canceling…
                </div>
              )}

              {cancelState === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-sm text-red-700">{cancelError}</p>
                  <Link href="/contact" className="text-xs text-indigo-600 underline mt-1 block">Contact support</Link>
                </div>
              )}
            </div>
          )}

          {cancelState === 'done' && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-5">
              <p className="font-bold text-emerald-800 mb-1">Subscription canceled</p>
              <p className="text-sm text-emerald-700">
                Your plan stays active{accessUntil ? ` until ${accessUntil}` : ' through the end of your billing period'}.
                You can resubscribe anytime from the pricing page.
              </p>
            </div>
          )}

          {/* Quick links */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/analyzer', label: 'Deal Analyzer', icon: '📊' },
              { href: '/pricing', label: 'View Plans', icon: '💳' },
              { href: '/contact', label: 'Contact Support', icon: '✉️' },
              { href: '/analyzer', label: 'Analyze a Deal', icon: '🔨' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 bg-white border border-zinc-200 rounded-xl p-4 hover:bg-zinc-50 transition-colors shadow-sm"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-semibold text-zinc-700">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
