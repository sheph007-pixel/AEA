import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LiveAgent from '@/components/LiveAgent';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#111111',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.americanemployers.org'),
  title: {
    default:
      'American Employers Alliance | HR Compliance, Risk Management & Employer Tools',
    template: '%s | American Employers Alliance',
  },
  description:
    'AEA is a national employer association providing AI-powered HR tools, compliance guidance, risk management, and cost-saving programs for businesses with 2-500 employees.',
  keywords: [
    'employer association',
    'HR compliance',
    'employer resources',
    'small business support',
    'workplace compliance',
    'employer tools',
    'national association',
    'risk management',
    'AI HR tools',
  ],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/icon.svg',
  },
  appleWebApp: {
    capable: true,
    title: 'AEA',
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    type: 'website',
    siteName: 'American Employers Alliance',
    title:
      'American Employers Alliance | HR Compliance, Risk Management & Employer Tools',
    description:
      'AEA is a national employer association providing AI-powered HR tools, compliance guidance, risk management, and cost-saving programs for businesses with 2-500 employees.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <LiveAgent />
      </body>
    </html>
  );
}
