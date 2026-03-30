import { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import { getAllInsights } from '@/lib/content';
import CTASection from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'Insights & Updates',
  description:
    'The latest compliance updates, employer guidance, and practical insights from AEA.',
};

export default function InsightsPage() {
  const insights = getAllInsights();

  return (
    <>
      <PageHero
        title="Insights & Updates"
        subtitle="Timely guidance and analysis on the topics that matter most to employers."
        breadcrumb="Insights"
      />

      <section className="section-padding">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {insights.map((insight) => (
              <Link
                key={insight.slug}
                href={`/insights/${insight.slug}`}
                className="card group"
              >
                <p className="text-xs font-medium text-accent-600 uppercase tracking-wide mb-2">
                  {insight.category}
                </p>
                <h3 className="text-lg font-semibold text-navy-900 group-hover:text-accent-700 transition-colors mb-2 leading-snug">
                  {insight.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
                  {insight.description}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">
                    {new Date(insight.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  <div className="flex gap-1.5">
                    {insight.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded"
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
      </section>

      <CTASection
        title="Stay informed"
        description="AEA members receive compliance alerts and updates as they happen - not days or weeks later."
      />
    </>
  );
}
