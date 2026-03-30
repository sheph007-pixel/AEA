import { Metadata } from 'next';
import Link from 'next/link';
import { getAllResources, getResourceBySlug } from '@/lib/content';
import { notFound } from 'next/navigation';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const resources = getAllResources();
  return resources.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resource = await getResourceBySlug(params.slug);
  if (!resource) return { title: 'Not Found' };
  return {
    title: resource.title,
    description: resource.description,
  };
}

export default async function ResourcePage({ params }: Props) {
  const resource = await getResourceBySlug(params.slug);
  if (!resource) notFound();

  const allResources = getAllResources();
  const moreInCategory = allResources
    .filter((r) => r.category === resource.category && r.slug !== resource.slug)
    .slice(0, 4);
  const recentArticles = allResources
    .filter((r) => r.slug !== resource.slug)
    .slice(0, 5);

  return (
    <>
      {/* Article Header */}
      <article>
        <header className="border-b border-ink-100">
          <div className="container-article py-10 md:py-14">
            <Link
              href={`/resources?category=${encodeURIComponent(resource.category)}`}
              className="category-tag hover:text-brand-red-dark transition-colors"
            >
              {resource.category}
            </Link>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-ink-900 mt-3 leading-tight">
              {resource.title}
            </h1>
            <p className="mt-4 text-lg text-ink-500 leading-relaxed">
              {resource.description}
            </p>
            <p className="mt-6 text-sm text-ink-400">
              <span className="font-medium text-ink-700">{resource.author}</span>
            </p>
          </div>
        </header>

        {/* Article Body */}
        <div className="container-article py-10 md:py-14">
          <div
            className="prose-content"
            dangerouslySetInnerHTML={{ __html: resource.contentHtml || '' }}
          />

          {/* Tags */}
          {resource.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-ink-100">
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-ink-500 bg-ink-50 px-3 py-1.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* More in Category */}
      {moreInCategory.length > 0 && (
        <section className="border-t border-ink-100 section-padding">
          <div className="container-wide">
            <h2 className="section-label">More in {resource.category}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {moreInCategory.map((article) => (
                <Link
                  key={article.slug}
                  href={`/resources/${article.slug}`}
                  className="article-card"
                >
                  <h3 className="font-serif text-base font-bold text-ink-900 group-hover:text-brand-red transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="article-card-meta mt-2">
                    {article.category}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent articles */}
      <section className="bg-ink-50 section-padding">
        <div className="container-wide">
          <h2 className="section-label">Recent Articles</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {recentArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/resources/${article.slug}`}
                className="article-card"
              >
                <p className="category-tag text-[10px] mb-1">{article.category}</p>
                <h3 className="text-sm font-semibold text-ink-900 group-hover:text-brand-red transition-colors leading-snug">
                  {article.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Membership CTA */}
      <section className="bg-ink-900">
        <div className="container-wide py-12 text-center">
          <p className="text-ink-400 text-sm">
            AEA members get access to compliance tools, employer resources, and cost-saving programs.
          </p>
          <Link
            href="/membership"
            className="inline-flex items-center mt-4 text-sm font-semibold text-white hover:text-brand-red-light transition-colors"
          >
            Become a Member &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}
