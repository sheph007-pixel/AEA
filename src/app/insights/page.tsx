import { Metadata } from 'next';
import Link from 'next/link';
import { getAllInsights } from '@/lib/content';
import CTASection from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'Latest Updates',
  description:
    'The latest compliance updates, employer guidance, and practical insights from AEA.',
};

export default function InsightsPage() {
  const insights = getAllInsights();

  return (
    <>
      <section className="border-b border-ink-100">
        <div className="container-wide py-8">
          <h1 className="font-serif text-3xl md:text-4.5xl font-bold text-ink-900">
            Latest Updates
          </h1>
          <p className="mt-2 text-ink-500">
            Timely guidance and analysis on the topics that matter most to employers.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="divide-y divide-ink-100">
            {insights.map((insight) => (
              <Link
                key={insight.slug}
                href={`/insights/${insight.slug}`}
                className="article-card flex gap-4 py-6 first:pt-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="category-tag text-[10px] mb-1.5">
                    {insight.category}
                  </p>
                  <h3 className="article-card-title text-lg">{insight.title}</h3>
                  <p className="article-card-excerpt mt-2">
                    {insight.description}
                  </p>
                  <p className="article-card-meta mt-3">
                    {insight.author}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Stay informed"
        description="AEA members receive compliance alerts and updates as regulations change."
      />
    </>
  );
}
