import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DealEdge AI — Know in 30 seconds if your deal is worth it',
  description:
    'Real estate decision engine for wholesalers and flippers. Analyze deals instantly, avoid bad investments, generate offers, and make confident decisions in under 30 seconds.',
  keywords: 'real estate, deal analyzer, wholesaler, flipper, ARV calculator, MAO, deal analysis',
  openGraph: {
    title: 'DealEdge AI',
    description: 'Know in 30 seconds if your deal is worth it',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
