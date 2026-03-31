import { Metadata } from 'next';
import Link from 'next/link';
import { getAllNews } from '@/lib/news';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Employer News',
  description: 'Daily news and updates for HR professionals, business owners, and employers.',
};

export default function NewsPage() {
  const news = getAllNews();

  return (
    <>
      <PageHero
        title="Employer News"
        subtitle="Daily updates on employment law, HR trends, and business news that matters to employers."
        breadcrumb="News"
      />

      <section className="section-padding">
        <div className="container-wide max-w-4xl">
          <div className="divide-y divide-ink-100">
            {news.map((item) => (
              <Link
                key={item.slug}
                href={`/news/${item.slug}`}
                className="block py-6 first:pt-0 group"
              >
                <p className="category-tag text-[10px] mb-1.5">{item.category}</p>
                <h2 className="font-serif text-lg font-bold text-ink-900 group-hover:text-brand-red transition-colors leading-snug">
                  {item.title}
                </h2>
                <p className="text-sm text-ink-500 mt-2 leading-relaxed">
                  {item.description}
                </p>
                <p className="text-xs text-ink-400 mt-2">{item.author}</p>
              </Link>
            ))}
          </div>
          {news.length === 0 && (
            <p className="text-ink-400 text-center py-12">News articles are published daily. Check back soon.</p>
          )}
        </div>
      </section>
    </>
  );
}
