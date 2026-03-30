import Link from 'next/link';
import { getAllResources, getAllInsights } from '@/lib/content';
import SectionHeading from '@/components/SectionHeading';
import CTASection from '@/components/CTASection';

const features = [
  {
    title: 'HR & Compliance Support',
    description:
      'Stay current with employment law, access policy templates, and get guidance on complex HR situations.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    href: '/hr-compliance',
  },
  {
    title: 'Employer Tools & Resources',
    description:
      'Practical checklists, guides, and templates designed specifically for employers with 2–500 employees.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    href: '/employer-tools',
  },
  {
    title: 'Cost Savings Programs',
    description:
      'Access group purchasing power for insurance, supplies, technology, and professional services.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    href: '/programs-savings',
  },
  {
    title: 'Community & Advocacy',
    description:
      'Join a national network of employers sharing knowledge and advocating for practical business policies.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    href: '/membership',
  },
];

const memberBenefits = [
  'Compliance alerts and regulatory updates',
  'HR policy templates and checklists',
  'Employer toolkits and operational guides',
  'Access to group purchasing programs',
  'Member-only webinars and resources',
  'Peer networking with other employers',
];

export default function HomePage() {
  const latestInsights = getAllInsights().slice(0, 3);
  const latestResources = getAllResources().slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="bg-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800" />
        <div className="container-wide relative py-20 md:py-32">
          <div className="max-w-3xl">
            <p className="text-accent-400 text-sm font-semibold tracking-wide uppercase mb-4">
              National Nonprofit Employer Association &middot; Est. 2013
            </p>
            <h1 className="text-4xl md:text-5.5xl font-bold text-white leading-tight">
              Practical support for employers who are building something that matters
            </h1>
            <p className="mt-6 text-lg md:text-xl text-navy-200 leading-relaxed max-w-2xl">
              AEA helps businesses with 2–500 employees operate more efficiently,
              stay compliant, reduce costs, and access the tools and resources they need.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link href="/membership" className="btn-primary px-8 py-4 text-base">
                Become a Member
              </Link>
              <Link href="/why-join" className="btn-secondary px-8 py-4 text-base border-navy-600 text-white hover:border-navy-400 hover:bg-navy-800">
                Why Employers Join
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="container-wide py-8">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-sm text-gray-500">
            <span className="font-medium">Serving employers nationwide since 2013</span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span>Headquartered in Burlington, VT</span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span>501(c)(6) nonprofit</span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span>All industries &middot; 2–500 employees</span>
          </div>
        </div>
      </section>

      {/* Core Value Proposition */}
      <section className="section-padding">
        <div className="container-wide">
          <SectionHeading
            label="What We Do"
            title="Everything employers need to operate with confidence"
            description="AEA provides the resources, tools, and support that help businesses focus on what they do best—while we help with the rest."
            centered
          />
          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Link key={feature.title} href={feature.href} className="card group">
                <div className="w-12 h-12 rounded-lg bg-navy-50 text-navy-700 flex items-center justify-center mb-4 group-hover:bg-navy-100 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-navy-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Value */}
      <section className="bg-gray-50 section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <SectionHeading
                label="Membership"
                title="Built for employers, by employers"
                description="AEA membership gives your organization access to the tools, guidance, and programs that help you operate more efficiently—regardless of your size or industry."
              />
              <ul className="mt-8 space-y-3">
                {memberBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-accent-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/membership" className="btn-primary">
                  Explore Membership
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-10">
              <h3 className="text-xl font-bold text-navy-900 mb-6">
                Membership includes access to:
              </h3>
              <div className="space-y-6">
                {[
                  { title: 'Resource Center', desc: 'Guides, templates, and checklists on HR, compliance, hiring, and operations', href: '/resources' },
                  { title: 'Compliance Updates', desc: 'Timely alerts on employment law changes affecting your business', href: '/insights' },
                  { title: 'Employer Tools', desc: 'Practical calculators, audit checklists, and planning worksheets', href: '/employer-tools' },
                  { title: 'Programs & Savings', desc: 'Group purchasing and discount programs for common business expenses', href: '/programs-savings' },
                ].map((item) => (
                  <Link key={item.title} href={item.href} className="block group">
                    <h4 className="font-semibold text-navy-900 group-hover:text-accent-600 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Insights */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="flex items-end justify-between mb-10">
            <SectionHeading
              label="Latest Insights"
              title="Updates and guidance for employers"
            />
            <Link href="/insights" className="hidden sm:inline-flex text-sm font-semibold text-accent-600 hover:text-accent-700">
              View all insights &rarr;
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {latestInsights.map((insight) => (
              <Link
                key={insight.slug}
                href={`/insights/${insight.slug}`}
                className="card group"
              >
                <p className="text-xs font-medium text-accent-600 uppercase tracking-wide mb-2">
                  {insight.category}
                </p>
                <h3 className="text-lg font-semibold text-navy-900 group-hover:text-accent-700 transition-colors mb-2">
                  {insight.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                  {insight.description}
                </p>
                <p className="text-xs text-gray-400 mt-4">
                  {new Date(insight.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </Link>
            ))}
          </div>
          <div className="sm:hidden mt-6 text-center">
            <Link href="/insights" className="text-sm font-semibold text-accent-600">
              View all insights &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Resources Preview */}
      <section className="bg-gray-50 section-padding">
        <div className="container-wide">
          <div className="flex items-end justify-between mb-10">
            <SectionHeading
              label="Resource Center"
              title="Practical guides for everyday employer challenges"
            />
            <Link href="/resources" className="hidden sm:inline-flex text-sm font-semibold text-accent-600 hover:text-accent-700">
              Browse all resources &rarr;
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestResources.map((resource) => (
              <Link
                key={resource.slug}
                href={`/resources/${resource.slug}`}
                className="card group"
              >
                <span className="inline-block text-xs font-medium text-navy-600 bg-navy-50 px-2.5 py-1 rounded-full mb-3">
                  {resource.category}
                </span>
                <h3 className="font-semibold text-navy-900 group-hover:text-accent-700 transition-colors text-sm leading-snug">
                  {resource.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </>
  );
}
