import { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import { getAllResources } from '@/lib/content';
import CTASection from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'HR & Compliance',
  description:
    'Employment law guidance, compliance checklists, and HR best practices for employers of all sizes.',
};

const topics = [
  {
    title: 'Federal Employment Law',
    items: [
      'FMLA administration and compliance',
      'FLSA wage and hour requirements',
      'ADA reasonable accommodation',
      'Title VII and anti-discrimination',
      'OSHA workplace safety standards',
      'COBRA continuation coverage',
    ],
  },
  {
    title: 'State & Local Compliance',
    items: [
      'Minimum wage tracking by state',
      'Paid leave law requirements',
      'Non-compete agreement restrictions',
      'Ban the box and fair hiring laws',
      'State-specific posting requirements',
      'Multi-state tax obligations',
    ],
  },
  {
    title: 'HR Best Practices',
    items: [
      'Employee handbook development',
      'Performance management systems',
      'Termination procedures',
      'Workplace investigations',
      'Documentation standards',
      'Disciplinary procedures',
    ],
  },
  {
    title: 'Record-Keeping & Reporting',
    items: [
      'I-9 compliance and audits',
      'Record retention requirements',
      'ACA reporting obligations',
      'EEO-1 reporting',
      'Payroll tax filings',
      'OSHA record-keeping',
    ],
  },
];

export default function HRCompliancePage() {
  const resources = getAllResources().filter(
    (r) => r.category === 'Compliance' || r.category === 'HR'
  );

  return (
    <>
      <PageHero
        title="HR & Compliance"
        subtitle="Stay current with employment law, access compliance tools, and implement HR best practices - without a full legal department."
        breadcrumb="HR & Compliance"
      />

      <section className="section-padding">
        <div className="container-wide">
          <SectionHeading
            title="Compliance areas we cover"
            description="AEA monitors federal, state, and local employment law changes and provides practical guidance for employers."
          />
          <div className="mt-12 grid sm:grid-cols-2 gap-8">
            {topics.map((topic) => (
              <div key={topic.title} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold text-navy-900 mb-4">{topic.title}</h3>
                <ul className="space-y-2">
                  {topic.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 bg-accent-500 rounded-full mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 section-padding">
        <div className="container-wide">
          <SectionHeading
            title="Related resources"
            description="Practical guides from our Resource Center on HR and compliance topics."
          />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.slice(0, 9).map((resource) => (
              <Link
                key={resource.slug}
                href={`/resources/${resource.slug}`}
                className="card group"
              >
                <span className="inline-block text-xs font-medium text-navy-600 bg-navy-50 px-2.5 py-1 rounded-full mb-3">
                  {resource.category}
                </span>
                <h3 className="font-semibold text-navy-900 group-hover:text-accent-700 transition-colors text-sm leading-snug mb-2">
                  {resource.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {resource.description}
                </p>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/resources" className="text-sm font-semibold text-accent-600 hover:text-accent-700">
              Browse all resources &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
