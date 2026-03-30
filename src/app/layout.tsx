import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'American Employers Alliance — National Employer Association',
    template: '%s | American Employers Alliance',
  },
  description:
    'AEA is a national nonprofit employer association helping businesses with 2–500 employees operate efficiently, stay compliant, reduce costs, and access practical tools and support.',
  keywords: [
    'employer association',
    'HR compliance',
    'employer resources',
    'small business support',
    'workplace compliance',
    'employer tools',
    'national association',
  ],
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
      </body>
    </html>
  );
}
