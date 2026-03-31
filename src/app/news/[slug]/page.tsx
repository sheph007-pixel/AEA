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
            <p className="mt-6 text-sm text-ink-400">
              <span className="font-medium text-ink-700">{item.author}</span>
            </p>
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
