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
                { href: '/analyzer#sms', label: 'SMS Engine' },
                { href: '/analyzer#offer', label: 'Offer Generator' },
                { href: '/pricing', label: 'Pricing' },
              ].map((item) => (
                <li key={item.href}>
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
                { href: '#', label: 'About' },
                { href: '#', label: 'Privacy Policy' },
                { href: '#', label: 'Terms of Service' },
                { href: '#', label: 'Contact' },
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

        <div className="mt-10 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-400">
            © {new Date().getFullYear()} DealEdge AI. All rights reserved.
          </p>
          <p className="text-xs text-zinc-400">
            Results are estimates. Always verify with licensed professionals.
          </p>
        </div>
      </div>
    </footer>
  );
}
