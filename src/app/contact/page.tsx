import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white">
        {/* Header */}
        <section className="relative overflow-hidden bg-gradient-to-b from-zinc-50 to-white border-b border-zinc-100 py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">Contact</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 mb-5">Get in Touch</h1>
            <p className="text-lg text-zinc-500">
              Questions, feedback, or need help with your subscription? We respond within one business day.
            </p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* Contact info */}
            <div>
              <h2 className="text-2xl font-extrabold text-zinc-900 mb-6">Contact Information</h2>
              <div className="space-y-5">
                {[
                  {
                    label: 'General Inquiries',
                    value: 'info@miamiglobalinvestments.com',
                    href: 'mailto:info@miamiglobalinvestments.com',
                    icon: (
                      <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    ),
                  },
                  {
                    label: 'Support & Billing',
                    value: 'support@miamiglobalinvestments.com',
                    href: 'mailto:support@miamiglobalinvestments.com',
                    icon: (
                      <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                      </svg>
                    ),
                  },
                  {
                    label: 'Legal',
                    value: 'legal@miamiglobalinvestments.com',
                    href: 'mailto:legal@miamiglobalinvestments.com',
                    icon: (
                      <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
                      </svg>
                    ),
                  },
                  {
                    label: 'Location',
                    value: 'Miami, Florida, USA',
                    href: null,
                    icon: (
                      <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    ),
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm font-semibold text-zinc-700">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
                <p className="text-sm font-bold text-indigo-900 mb-1">Response Time</p>
                <p className="text-sm text-indigo-700">
                  We aim to respond to all inquiries within 1 business day.
                  For urgent subscription issues, please include your account email in the subject line.
                </p>
              </div>
            </div>

            {/* FAQ shortcuts */}
            <div>
              <h2 className="text-2xl font-extrabold text-zinc-900 mb-6">Quick Help</h2>
              <div className="space-y-3">
                {[
                  {
                    q: 'How do I cancel my subscription?',
                    a: 'Sign in to your account and go to your Dashboard. You\'ll find the cancel option there. You keep access until the end of your billing period.',
                  },
                  {
                    q: 'My subscription isn\'t activating after payment',
                    a: 'If your plan didn\'t activate automatically, email us at support@miamiglobalinvestments.com with your payment confirmation and we\'ll activate it manually within a few hours.',
                  },
                  {
                    q: 'Can I get a refund?',
                    a: 'We don\'t offer refunds for partial billing periods. However, if you\'re unsatisfied within 14 days of your first payment, contact us and we\'ll work something out.',
                  },
                  {
                    q: 'I forgot my password',
                    a: 'Since DealEdge AI uses local storage for accounts, clearing your browser data or using a different device will require creating a new account. Contact support if you need help.',
                  },
                  {
                    q: 'Is my deal data private?',
                    a: 'Yes. Your deal data is stored locally in your browser and is not sent to our servers. See our Privacy Policy for full details.',
                  },
                ].map((item) => (
                  <div key={item.q} className="bg-zinc-50 border border-zinc-200 rounded-xl p-4">
                    <p className="text-sm font-bold text-zinc-900 mb-1.5">{item.q}</p>
                    <p className="text-sm text-zinc-500 leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
