import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              </div>
              <span className="text-sm font-bold text-zinc-900">
                DealEdge <span className="text-indigo-600">AI</span>
              </span>
            </div>
            <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
              The fastest real estate decision engine built for wholesalers and flippers. Know your deal in 30 seconds.
            </p>
            <p className="text-xs text-zinc-400 mt-4">
              Powered by{' '}
              <span className="text-zinc-500 font-medium">Miami Global Investments Group LLC</span>
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-3">Product</p>
            <ul className="space-y-2">
              {[
                { href: '/analyzer', label: 'Deal Analyzer' },
                { href: '/analyzer', label: 'SMS Engine' },
                { href: '/analyzer', label: 'Offer Generator' },
                { href: '/pricing', label: 'Pricing' },
                { href: '/dashboard', label: 'Dashboard' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-3">Company</p>
            <ul className="space-y-2">
              {[
                { href: '/about', label: 'About' },
                { href: '/contact', label: 'Contact' },
                { href: '/disclaimer', label: 'Legal Disclaimer' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Service' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-100 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-zinc-400">
              © {new Date().getFullYear()} Miami Global Investments Group LLC. All rights reserved.
            </p>
            <p className="text-xs text-zinc-400">
              Results are estimates. Always verify with licensed professionals.
            </p>
          </div>
          <p className="text-[10px] text-zinc-400 text-center leading-relaxed border-t border-zinc-100 pt-3">
            <strong className="text-zinc-500">Legal Disclaimer:</strong> DealEdge AI is a calculation tool for informational purposes only.
            Nothing on this platform constitutes financial, investment, or legal advice.
            DealEdge AI does not recommend buying or investing in any property.
            You are solely responsible for all investment decisions and their outcomes.
            Miami Global Investments Group LLC bears no liability for any financial losses.{' '}
            <Link href="/disclaimer" className="underline hover:text-zinc-600 transition-colors">Full disclaimer</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
