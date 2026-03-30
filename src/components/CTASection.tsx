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
  title = 'Built for employers who want to do things right',
  description = 'AEA members get access to practical tools, compliance support, and cost-saving programs designed for businesses with 2-500 employees.',
  primaryLabel = 'Become a Member',
  primaryHref = '/membership',
  secondaryLabel = 'Learn More',
  secondaryHref = '/why-join',
}: CTASectionProps) {
  return (
    <section className="bg-ink-900">
      <div className="container-wide py-16 md:py-20 text-center">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-white">
          {title}
        </h2>
        <p className="mt-4 text-ink-400 max-w-xl mx-auto leading-relaxed">
          {description}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={primaryHref}
            className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold text-ink-900 bg-white rounded hover:bg-ink-100 transition-colors"
          >
            {primaryLabel}
          </Link>
          <Link
            href={secondaryHref}
            className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold text-white border border-ink-600 rounded hover:border-ink-400 transition-colors"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
