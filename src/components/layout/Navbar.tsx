'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/analyzer', label: 'Analyzer' },
    { href: '/pricing', label: 'Pricing' },
  ];

  const planBadge: Record<string, string> = {
    pro: 'bg-indigo-100 text-indigo-700',
    investor: 'bg-amber-100 text-amber-700',
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <span className="text-base font-bold text-zinc-900">
              DealEdge <span className="text-indigo-600">AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3.5 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100',
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-zinc-100 transition-colors"
                >
                  <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-indigo-700">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-zinc-700">{user.name.split(' ')[0]}</span>
                  {user.plan !== 'free' && (
                    <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full capitalize', planBadge[user.plan])}>
                      {user.plan}
                    </span>
                  )}
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-zinc-200 rounded-xl shadow-lg py-1 z-50">
                    <div className="px-3 py-2 border-b border-zinc-100">
                      <p className="text-xs font-semibold text-zinc-700 truncate">{user.email}</p>
                      <p className="text-xs text-zinc-400 capitalize mt-0.5">{user.plan} plan</p>
                    </div>
                    {user.plan === 'free' && (
                      <Link href="/pricing" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        Upgrade to Pro
                      </Link>
                    )}
                    <button onClick={() => { logout(); setProfileOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-zinc-500 hover:bg-zinc-50 transition-colors">
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 px-3 py-2 rounded-lg hover:bg-zinc-100 transition-colors">
                  Sign in
                </Link>
                <Link href="/analyzer"
                  className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm">
                  Analyze a Deal
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 rounded-lg text-zinc-600 hover:bg-zinc-100" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-100 bg-white px-4 py-3 space-y-1">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              className={cn('block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                pathname === link.href ? 'bg-indigo-50 text-indigo-700' : 'text-zinc-700 hover:bg-zinc-50')}>
              {link.label}
            </Link>
          ))}
          <div className="border-t border-zinc-100 pt-2 mt-2 space-y-1">
            {user ? (
              <>
                <p className="px-3 py-1 text-xs text-zinc-400">{user.email} · {user.plan} plan</p>
                <button onClick={() => { logout(); setMobileOpen(false); }}
                  className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-500 hover:bg-zinc-50">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50">
                  Sign in
                </Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)}
                  className="block text-center bg-indigo-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl">
                  Create Free Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
