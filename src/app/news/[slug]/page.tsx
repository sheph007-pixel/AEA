import { Metadata } from 'next';
import Link from 'next/link';
import { getAllNews, getNewsBySlug } from '@/lib/news';
import { notFound } from 'next/navigation';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllNews().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await getNewsBySlug(params.slug);
  if (!item) return { title: 'Not Found' };
  return { title: item.title, description: item.description };
}

export default async function NewsArticlePage({ params }: Props) {
  const item = await getNewsBySlug(params.slug);
  if (!item) notFound();

  const allNews = getAllNews().filter((n) => n.slug !== item.slug).slice(0, 4);

  return (
    <>
      <article>
        <header className="border-b border-ink-100">
          <div className="container-article py-10 md:py-14">
            <Link href="/news" className="category-tag hover:text-brand-red-dark transition-colors">
              {item.category}
            </Link>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-ink-900 mt-3 leading-tight">
              {item.title}
            </h1>
            <p className="mt-4 text-lg text-ink-500 leading-relaxed">{item.description}</p>
            <div className="mt-6 flex items-center gap-4 text-sm text-ink-400">
              <span className="font-medium text-ink-700">{item.author}</span>
              <span className="inline-flex items-center gap-1 text-green-600 text-xs">
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Verified
              </span>
            </div>
          </div>
        </header>
        <div className="container-article py-10 md:py-14">
          <div className="prose-content" dangerouslySetInnerHTML={{ __html: item.contentHtml || '' }} />
        </div>
      </article>

      {allNews.length > 0 && (
        <section className="bg-ink-50 section-padding">
          <div className="container-wide">
            <h2 className="section-label">More News</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {allNews.map((n) => (
                <Link key={n.slug} href={`/news/${n.slug}`} className="block group">
                  <p className="category-tag text-[10px] mb-1">{n.category}</p>
                  <h3 className="text-sm font-semibold text-ink-900 group-hover:text-brand-red transition-colors leading-snug">
                    {n.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
