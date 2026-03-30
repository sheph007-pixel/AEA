import { Metadata } from 'next';
import Link from 'next/link';
import { getAllInsights, getInsightBySlug } from '@/lib/content';
import PageHero from '@/components/PageHero';
import CTASection from '@/components/CTASection';
import { notFound } from 'next/navigation';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const insights = getAllInsights();
  return insights.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const insight = await getInsightBySlug(params.slug);
  if (!insight) return { title: 'Not Found' };
  return {
    title: insight.title,
    description: insight.description,
  };
}

export default async function InsightPage({ params }: Props) {
  const insight = await getInsightBySlug(params.slug);
  if (!insight) notFound();

  const allInsights = getAllInsights();
  const related = allInsights
    .filter((i) => i.slug !== insight.slug)
    .slice(0, 4);

  return (
    <>
      <PageHero
        title={insight.title}
        subtitle={insight.description}
        breadcrumb={`Insights / ${insight.category}`}
      />

      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-8 text-sm text-gray-500">
                <time>
                  {new Date(insight.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </time>
                <span>&middot;</span>
                <span>{insight.category}</span>
              </div>
              <div
                className="prose-content"
                dangerouslySetInnerHTML={{ __html: insight.contentHtml || '' }}
              />
            </div>

            <aside className="lg:col-span-1">
              <div className="sticky top-28 space-y-8">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-sm font-semibold text-navy-700 uppercase tracking-wide mb-4">
                    More insights
                  </h3>
                  <ul className="space-y-4">
                    {related.map((r) => (
                      <li key={r.slug}>
                        <Link
                          href={`/insights/${r.slug}`}
                          className="block group"
                        >
                          <p className="text-xs text-gray-400 mb-1">
                            {new Date(r.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                          <p className="text-sm font-medium text-navy-900 group-hover:text-accent-600 transition-colors leading-snug">
                            {r.title}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-navy-800 rounded-xl p-6 text-white">
                  <h3 className="font-semibold mb-2">
                    Get updates delivered
                  </h3>
                  <p className="text-sm text-navy-200 mb-4">
                    AEA members receive compliance alerts and employer
                    insights as they&apos;re published.
                  </p>
                  <Link
                    href="/membership"
                    className="inline-flex items-center text-sm font-semibold text-white hover:text-accent-300 transition-colors"
                  >
                    Join AEA &rarr;
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
