import { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import { getAllResources, getCategories } from '@/lib/content';
import CTASection from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'Resource Center',
  description:
    'Practical guides, templates, and checklists for employers covering HR, compliance, hiring, operations, and more.',
};

export default function ResourcesPage() {
  const resources = getAllResources();
  const categories = getCategories(resources);

  return (
    <>
      <PageHero
        title="Resource Center"
        subtitle="Practical guides, templates, and checklists for employers - organized by topic and designed for everyday use."
        breadcrumb="Resources"
      />

      <section className="section-padding">
        <div className="container-wide">
          {/* Category Navigation */}
          <div className="flex flex-wrap gap-2 mb-12">
            <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-navy-800 rounded-full">
              All Resources ({resources.length})
            </span>
            {categories.map((cat) => {
              const count = resources.filter((r) => r.category === cat).length;
              return (
                <a
                  key={cat}
                  href={`#${cat.toLowerCase()}`}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-navy-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {cat} ({count})
                </a>
              );
            })}
          </div>

          {/* Resources by Category */}
          {categories.map((cat) => {
            const catResources = resources.filter((r) => r.category === cat);
            return (
              <div key={cat} id={cat.toLowerCase()} className="mb-16 last:mb-0">
                <h2 className="text-xl font-bold text-navy-900 mb-6 pb-3 border-b border-gray-200">
                  {cat}
                  <span className="text-gray-400 font-normal text-base ml-3">
                    {catResources.length} {catResources.length === 1 ? 'resource' : 'resources'}
                  </span>
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catResources.map((resource) => (
                    <Link
                      key={resource.slug}
                      href={`/resources/${resource.slug}`}
                      className="card group"
                    >
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {resource.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-navy-600 bg-navy-50 px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-semibold text-navy-900 group-hover:text-accent-700 transition-colors mb-2 leading-snug">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                        {resource.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <CTASection
        title="Need a resource you don't see?"
        description="AEA is continuously expanding our resource library. Let us know what topics would be most useful for your organization."
        primaryLabel="Contact Us"
        primaryHref="/contact"
        secondaryLabel="Join AEA"
        secondaryHref="/membership"
      />
    </>
  );
}
