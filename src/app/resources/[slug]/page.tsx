import { Metadata } from 'next';
import Link from 'next/link';
import { getAllResources, getResourceBySlug } from '@/lib/content';
import PageHero from '@/components/PageHero';
import CTASection from '@/components/CTASection';
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
  if (!resource) return { title: 'Resource Not Found' };
  return {
    title: resource.title,
    description: resource.description,
  };
}

export default async function ResourcePage({ params }: Props) {
  const resource = await getResourceBySlug(params.slug);
  if (!resource) notFound();

  const allResources = getAllResources();
  const related = allResources
    .filter((r) => r.category === resource.category && r.slug !== resource.slug)
    .slice(0, 3);

  return (
    <>
      <PageHero
        title={resource.title}
        subtitle={resource.description}
        breadcrumb={`Resources / ${resource.category}`}
      />

      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-8">
                {resource.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-navy-600 bg-navy-50 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div
                className="prose-content"
                dangerouslySetInnerHTML={{ __html: resource.contentHtml || '' }}
              />
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-28 space-y-8">
                {/* Meta */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-sm font-semibold text-navy-700 uppercase tracking-wide mb-4">
                    About this resource
                  </h3>
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="text-gray-500">Category</dt>
                      <dd className="font-medium text-navy-900">
                        {resource.category}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Last updated</dt>
                      <dd className="font-medium text-navy-900">
                        {new Date(resource.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Related */}
                {related.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-sm font-semibold text-navy-700 uppercase tracking-wide mb-4">
                      Related resources
                    </h3>
                    <ul className="space-y-3">
                      {related.map((r) => (
                        <li key={r.slug}>
                          <Link
                            href={`/resources/${r.slug}`}
                            className="text-sm font-medium text-navy-900 hover:text-accent-600 transition-colors leading-snug block"
                          >
                            {r.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA */}
                <div className="bg-navy-800 rounded-xl p-6 text-white">
                  <h3 className="font-semibold mb-2">Access more resources</h3>
                  <p className="text-sm text-navy-200 mb-4">
                    AEA members get full access to our growing resource library.
                  </p>
                  <Link
                    href="/membership"
                    className="inline-flex items-center text-sm font-semibold text-white hover:text-accent-300 transition-colors"
                  >
                    Learn about membership &rarr;
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
