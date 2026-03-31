import { Metadata } from 'next';
import Link from 'next/link';
import { getAllBriefings, getBriefingBySlug, getTypeLabel } from '@/lib/briefings';
import { notFound } from 'next/navigation';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllBriefings().map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await getBriefingBySlug(params.slug);
  if (!item) return { title: 'Not Found' };
  return { title: item.title, description: item.description };
}

export default async function BriefingPage({ params }: Props) {
  const item = await getBriefingBySlug(params.slug);
  if (!item) notFound();

  const allBriefings = getAllBriefings();
  const related = allBriefings
    .filter((b) => b.slug !== item.slug && b.month === item.month)
    .slice(0, 4);
  const recent = allBriefings
    .filter((b) => b.slug !== item.slug)
    .slice(0, 4);

  return (
    <>
      <article>
        <header className="border-b border-ink-100">
          <div className="container-article py-10 md:py-14">
            <Link
              href="/briefings"
              className="category-tag hover:text-brand-red-dark transition-colors"
            >
              {getTypeLabel(item.type)}
            </Link>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-ink-900 mt-3 leading-tight">
              {item.title}
            </h1>
            <p className="mt-4 text-lg text-ink-500 leading-relaxed">
              {item.description}
            </p>
            <p className="mt-6 text-sm text-ink-400">
              <span className="font-medium text-ink-700">{item.author}</span>
            </p>
          </div>
        </header>

        <div className="container-article py-10 md:py-14">
          <div
            className="prose-content"
            dangerouslySetInnerHTML={{ __html: item.contentHtml || '' }}
          />
        </div>
      </article>

      {/* Related from same month */}
      {related.length > 0 && (
        <section className="border-t border-ink-100 section-padding">
          <div className="container-wide">
            <h2 className="section-label">Also This Month</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((b) => (
                <Link
                  key={b.slug}
                  href={`/briefings/${b.slug}`}
                  className="block group"
                >
                  <p className="category-tag text-[10px] mb-1">
                    {getTypeLabel(b.type)}
                  </p>
                  <h3 className="text-sm font-semibold text-ink-900 group-hover:text-brand-red transition-colors leading-snug">
                    {b.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent briefings */}
      <section className="bg-ink-50 section-padding">
        <div className="container-wide">
          <h2 className="section-label">Recent Briefings</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recent.map((b) => (
              <Link
                key={b.slug}
                href={`/briefings/${b.slug}`}
                className="block group"
              >
                <p className="category-tag text-[10px] mb-1">
                  {getTypeLabel(b.type)}
                </p>
                <h3 className="text-sm font-semibold text-ink-900 group-hover:text-brand-red transition-colors leading-snug">
                  {b.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
