import { Metadata } from 'next';
import Link from 'next/link';
import { getAllBriefings, getBriefingTypes, getTypeLabel, getLatestMonthlyBriefing } from '@/lib/briefings';
import CTASection from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'Employer Briefings & Insights',
  description:
    'Monthly employer briefings, compliance alerts, trends reports, and industry snapshots from the American Employers Alliance.',
};

export default function BriefingsPage() {
  const briefings = getAllBriefings();
  const types = getBriefingTypes();
  const featured = getLatestMonthlyBriefing();

  return (
    <>
      <section className="border-b border-ink-100">
        <div className="container-wide py-8 md:py-12">
          <h1 className="font-serif text-3xl md:text-4.5xl font-bold text-ink-900">
            Employer Briefings & Insights
          </h1>
          <p className="mt-3 text-ink-500 max-w-2xl">
            Monthly briefings, compliance alerts, employer trends, and industry
            analysis prepared by the AEA Editorial Team.
          </p>
        </div>
      </section>

      {/* Type filters */}
      <section className="border-b border-ink-100 bg-ink-50">
        <div className="container-wide py-3 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            <span className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-ink-900 rounded">
              All
            </span>
            {types.map((type) => (
              <a
                key={type}
                href={`#${type}`}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-ink-600 hover:text-ink-900 hover:bg-white rounded transition-colors"
              >
                {getTypeLabel(type)}
              </a>
            ))}
            <Link
              href="/outlook"
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-brand-red hover:text-brand-red-dark rounded transition-colors"
            >
              Employer Outlook &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Featured briefing */}
      {featured && (
        <section className="border-b border-ink-100 section-padding">
          <div className="container-wide">
            <Link
              href={`/briefings/${featured.slug}`}
              className="block max-w-3xl group"
            >
              <p className="category-tag mb-2">{getTypeLabel(featured.type)}</p>
              <h2 className="font-serif text-2xl md:text-4xl font-bold text-ink-900 group-hover:text-brand-red transition-colors leading-tight">
                {featured.title}
              </h2>
              <p className="mt-3 text-ink-500 text-lg leading-relaxed">
                {featured.description}
              </p>
              <p className="article-card-meta mt-4">{featured.author}</p>
            </Link>
          </div>
        </section>
      )}

      {/* Briefings by type */}
      <section className="section-padding">
        <div className="container-wide">
          {types.map((type) => {
            const items = briefings.filter((b) => b.type === type);
            if (items.length === 0) return null;
            return (
              <div key={type} id={type} className="mb-14 last:mb-0">
                <h2 className="section-label mb-0 pb-2 inline-block">
                  {getTypeLabel(type)}
                </h2>
                <div className="mt-6 divide-y divide-ink-100">
                  {items.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/briefings/${item.slug}`}
                      className="block py-5 first:pt-0 group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif text-base font-bold text-ink-900 group-hover:text-brand-red transition-colors leading-snug">
                            {item.title}
                          </h3>
                          <p className="text-sm text-ink-500 mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1.5 shrink-0">
                          {item.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs text-ink-400 bg-ink-50 px-2 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <CTASection
        title="Stay ahead of compliance changes"
        description="AEA members receive monthly briefings, compliance alerts, and employer trend analysis as part of their membership."
      />
    </>
  );
}
