import Link from 'next/link';

interface CTASectionProps {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export default function CTASection({
  title = 'Ready to strengthen your organization?',
  description = 'Join thousands of employers who rely on AEA for practical tools, compliance support, and cost-saving programs.',
  primaryLabel = 'Become a Member',
  primaryHref = '/membership',
  secondaryLabel = 'Contact Us',
  secondaryHref = '/contact',
}: CTASectionProps) {
  return (
    <section className="bg-navy-800">
      <div className="container-wide py-16 md:py-20 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
        <p className="mt-4 text-navy-200 max-w-xl mx-auto leading-relaxed">
          {description}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={primaryHref}
            className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold text-navy-900 bg-white rounded-lg hover:bg-gray-100 transition-colors"
          >
            {primaryLabel}
          </Link>
          <Link
            href={secondaryHref}
            className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold text-white border-2 border-navy-600 rounded-lg hover:border-navy-400 transition-colors"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
