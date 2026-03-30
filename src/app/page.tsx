import Link from 'next/link';
import {
  getAllContent,
  getFeaturedContent,
  getRecentContent,
  getContentByCategory,
} from '@/lib/content';

export default function HomePage() {
  const allContent = getAllContent();
  const featured = getFeaturedContent();
  const recent = getRecentContent(20);
  const byCategory = getContentByCategory();

  const heroArticle = featured[0] || recent[0];
  const secondaryArticles = recent.filter((a) => a.slug !== heroArticle?.slug).slice(0, 3);
  const sidebarArticles = recent.filter(
    (a) => a.slug !== heroArticle?.slug && !secondaryArticles.some((s) => s.slug === a.slug)
  ).slice(0, 5);

  const topCategories = Object.entries(byCategory)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 4);

  const editorPicks = featured.length > 1
    ? featured.slice(1, 5)
    : recent.filter((a) => a.slug !== heroArticle?.slug).slice(5, 9);

  return (
    <>
      {/* Hero Section */}
      <section className="border-b border-ink-100">
        <div className="container-wide py-8 md:py-12">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              {heroArticle && (
                <Link href={`/resources/${heroArticle.slug}`} className="article-card block">
                  <p className="category-tag mb-3">{heroArticle.category}</p>
                  <h1 className="featured-card-title">{heroArticle.title}</h1>
                  <p className="mt-4 text-ink-500 text-lg leading-relaxed max-w-2xl">
                    {heroArticle.description}
                  </p>
                  <p className="article-card-meta mt-4">
                    {heroArticle.author}
                  </p>
                </Link>
              )}
            </div>

            <div className="lg:border-l lg:border-ink-100 lg:pl-8 space-y-6">
              {secondaryArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/resources/${article.slug}`}
                  className="article-card block"
                >
                  <p className="category-tag text-[10px] mb-1">{article.category}</p>
                  <h3 className="font-serif text-base font-bold text-ink-900 group-hover:text-brand-red transition-colors leading-snug">
                    {article.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest + Sidebar */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              <h2 className="section-label">Latest</h2>
              <div className="space-y-0 divide-y divide-ink-100">
                {recent.slice(0, 8).map((article) => (
                  <Link
                    key={article.slug}
                    href={`/resources/${article.slug}`}
                    className="article-card flex gap-4 py-5 first:pt-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="category-tag text-[10px] mb-1">
                        {article.category}
                      </p>
                      <h3 className="article-card-title">{article.title}</h3>
                      <p className="article-card-excerpt mt-1.5 hidden sm:block">
                        {article.description}
                      </p>
                      <p className="article-card-meta mt-2">
                        {article.author}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  href="/resources"
                  className="text-sm font-semibold text-brand-red hover:text-brand-red-dark"
                >
                  View all {allContent.length} articles &rarr;
                </Link>
              </div>
            </div>

            <div className="space-y-10">
              <div>
                <h3 className="section-label">Most Read</h3>
                <div className="space-y-4">
                  {sidebarArticles.map((article, i) => (
                    <Link
                      key={article.slug}
                      href={`/resources/${article.slug}`}
                      className="numbered-item group"
                    >
                      <span className="numbered-item-rank">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold text-ink-900 group-hover:text-brand-red transition-colors leading-snug">
                          {article.title}
                        </h4>
                        <p className="text-xs text-ink-400 mt-1">
                          {article.category}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-ink-50 border border-ink-100 p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-3">
                  For Employers
                </p>
                <h3 className="font-serif text-lg font-bold text-ink-900 mb-2">
                  Join the American Employers Alliance
                </h3>
                <p className="text-sm text-ink-500 leading-relaxed mb-4">
                  Access compliance tools, employer resources, and cost-saving
                  programs designed for businesses with 2-500 employees.
                </p>
                <Link href="/membership" className="btn-primary text-xs w-full text-center">
                  Become a Member
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Sections */}
      {topCategories.map(([category, articles]) => (
        <section key={category} className="border-t border-ink-100 section-padding">
          <div className="container-wide">
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-label mb-0 pb-0 border-0">{category}</h2>
              <Link
                href={`/resources?category=${encodeURIComponent(category)}`}
                className="text-xs font-semibold text-brand-red hover:text-brand-red-dark hidden sm:block"
              >
                More in {category} &rarr;
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {articles.slice(0, 4).map((article) => (
                <Link
                  key={article.slug}
                  href={`/resources/${article.slug}`}
                  className="article-card"
                >
                  <h3 className="font-serif text-base font-bold text-ink-900 group-hover:text-brand-red transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="article-card-excerpt mt-2">
                    {article.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Editor's Picks */}
      <section className="bg-ink-900 section-padding">
        <div className="container-wide">
          <h2 className="text-xs font-bold uppercase tracking-widest text-ink-400 pb-3 border-b border-ink-700 mb-8">
            Editor&apos;s Picks
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {editorPicks.map((article) => (
              <Link
                key={article.slug}
                href={`/resources/${article.slug}`}
                className="group"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-2">
                  {article.category}
                </p>
                <h3 className="font-serif text-base font-bold text-white group-hover:text-brand-red-light transition-colors leading-snug">
                  {article.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About the Association */}
      <section className="border-t border-ink-100 bg-ink-50">
        <div className="container-wide py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-serif font-bold text-ink-900">2013</p>
              <p className="text-xs text-ink-500 mt-1 uppercase tracking-wide">
                Established
              </p>
            </div>
            <div>
              <p className="text-3xl font-serif font-bold text-ink-900">50</p>
              <p className="text-xs text-ink-500 mt-1 uppercase tracking-wide">
                States Served
              </p>
            </div>
            <div>
              <p className="text-3xl font-serif font-bold text-ink-900">
                2-500
              </p>
              <p className="text-xs text-ink-500 mt-1 uppercase tracking-wide">
                Employees Per Member
              </p>
            </div>
            <div>
              <p className="text-3xl font-serif font-bold text-ink-900">All</p>
              <p className="text-xs text-ink-500 mt-1 uppercase tracking-wide">
                Industries Served
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple membership CTA */}
      <section className="bg-ink-900">
        <div className="container-wide py-14 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-white">
            Practical resources for employers who want to do things right
          </h2>
          <p className="mt-3 text-ink-400 max-w-lg mx-auto">
            Join AEA for access to compliance tools, employer resources, and
            cost-saving programs.
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
