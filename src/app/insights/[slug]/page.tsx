import { Metadata } from 'next';
import Link from 'next/link';
import { getAllInsights, getInsightBySlug, getRecentContent } from '@/lib/content';
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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function InsightPage({ params }: Props) {
  const insight = await getInsightBySlug(params.slug);
  if (!insight) notFound();

  const recentArticles = getRecentContent(5).filter((r) => r.slug !== insight.slug);

  return (
    <>
      <article>
        <header className="border-b border-ink-100">
          <div className="container-article py-10 md:py-14">
            <Link
              href="/insights"
              className="category-tag hover:text-brand-red-dark transition-colors"
            >
              {insight.category}
            </Link>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-ink-900 mt-3 leading-tight">
              {insight.title}
            </h1>
            <p className="mt-4 text-lg text-ink-500 leading-relaxed">
              {insight.description}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-6 text-sm text-ink-400">
              <span className="font-medium text-ink-700">{insight.author}</span>
              <span>&middot;</span>
              <time>{formatDate(insight.date)}</time>
              <span>&middot;</span>
              <span>{insight.readTime}</span>
            </div>
          </div>
        </header>

        <div className="container-article py-10 md:py-14">
          <div
            className="prose-content"
            dangerouslySetInnerHTML={{ __html: insight.contentHtml || '' }}
          />
        </div>
      </article>

      <section className="bg-ink-50 section-padding">
        <div className="container-wide">
          <h2 className="section-label">Recent Articles</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentArticles.slice(0, 4).map((article) => (
              <Link
                key={article.slug}
                href={`/resources/${article.slug}`}
                className="article-card"
              >
                <p className="category-tag text-[10px] mb-1">{article.category}</p>
                <h3 className="text-sm font-semibold text-ink-900 group-hover:text-brand-red transition-colors leading-snug">
                  {article.title}
                </h3>
                <p className="text-xs text-ink-400 mt-2">{formatDate(article.date)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
