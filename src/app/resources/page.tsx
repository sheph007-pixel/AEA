import { Metadata } from 'next';
import Link from 'next/link';
import { getAllResources, getCategories, getFeaturedContent } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Articles & Resources',
  description:
    'Practical guides, compliance updates, and employer resources covering HR, hiring, operations, workplace culture, and more.',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ResourcesPage() {
  const resources = getAllResources();
  const categories = getCategories(resources);
  const featured = getFeaturedContent();
  const heroArticle = featured[0] || resources[0];

  return (
    <>
      {/* Header */}
      <section className="border-b border-ink-100">
        <div className="container-wide py-8">
          <h1 className="font-serif text-3xl md:text-4.5xl font-bold text-ink-900">
            Articles & Resources
          </h1>
          <p className="mt-2 text-ink-500">
            {resources.length} articles across {categories.length} topics for employers
          </p>
        </div>
      </section>

      {/* Category filters */}
      <section className="border-b border-ink-100 bg-ink-50">
        <div className="container-wide py-3 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            <span className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-ink-900 rounded">
              All
            </span>
            {categories.map((cat) => (
              <a
                key={cat}
                href={`#${cat.toLowerCase().replace(/\s+/g, '-')}`}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-ink-600 hover:text-ink-900 hover:bg-white rounded transition-colors"
              >
                {cat}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured article */}
      {heroArticle && (
        <section className="border-b border-ink-100 section-padding">
          <div className="container-wide">
            <Link href={`/resources/${heroArticle.slug}`} className="article-card block max-w-3xl">
              <p className="category-tag mb-2">{heroArticle.category}</p>
              <h2 className="font-serif text-2xl md:text-4xl font-bold text-ink-900 group-hover:text-brand-red transition-colors leading-tight">
                {heroArticle.title}
              </h2>
              <p className="mt-3 text-ink-500 text-lg leading-relaxed">
                {heroArticle.description}
              </p>
              <div className="article-card-meta mt-4">
                <span>{formatDate(heroArticle.date)}</span>
                <span>&middot;</span>
                <span>{heroArticle.readTime}</span>
                <span>&middot;</span>
                <span>{heroArticle.author}</span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Articles by category */}
      <section className="section-padding">
        <div className="container-wide">
          {categories.map((cat) => {
            const catResources = resources.filter((r) => r.category === cat);
            return (
              <div
                key={cat}
                id={cat.toLowerCase().replace(/\s+/g, '-')}
                className="mb-14 last:mb-0"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="section-label mb-0 pb-2 inline-block">
                    {cat}
                    <span className="text-ink-300 font-normal ml-2">
                      {catResources.length}
                    </span>
                  </h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                  {catResources.map((resource) => (
                    <Link
                      key={resource.slug}
                      href={`/resources/${resource.slug}`}
                      className="article-card py-0"
                    >
                      <h3 className="article-card-title text-base">
                        {resource.title}
                      </h3>
                      <p className="article-card-excerpt mt-1.5">
                        {resource.description}
                      </p>
                      <div className="article-card-meta mt-2">
                        <span>{formatDate(resource.date)}</span>
                        <span>&middot;</span>
                        <span>{resource.readTime}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink-900">
        <div className="container-wide py-14 text-center">
          <h2 className="font-serif text-2xl font-bold text-white">
            Get access to all resources and tools
          </h2>
          <p className="mt-3 text-ink-400 max-w-lg mx-auto">
            AEA members receive full access to our growing library, plus compliance
            alerts, employer tools, and cost-saving programs.
          </p>
          <div className="mt-6">
            <Link
              href="/membership"
              className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold text-ink-900 bg-white rounded hover:bg-ink-100 transition-colors"
            >
              Become a Member
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
