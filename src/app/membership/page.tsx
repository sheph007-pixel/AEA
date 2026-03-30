import { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import CTASection from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'Membership',
  description:
    'AEA membership gives employers access to compliance guidance, HR resources, employer tools, and cost-saving programs.',
};

const tiers = [
  {
    name: 'Essential',
    audience: '2–25 employees',
    features: [
      'Full Resource Center access',
      'Compliance alerts and updates',
      'HR policy templates',
      'Employer toolkits',
      'Member newsletter',
      'Community forum access',
    ],
  },
  {
    name: 'Professional',
    audience: '26–100 employees',
    featured: true,
    features: [
      'Everything in Essential, plus:',
      'Advanced compliance guides',
      'Multi-state compliance tools',
      'Priority support access',
      'Webinar library access',
      'Group purchasing programs',
      'Benefits program eligibility',
    ],
  },
  {
    name: 'Enterprise',
    audience: '101–500 employees',
    features: [
      'Everything in Professional, plus:',
      'Dedicated account support',
      'Custom compliance reviews',
      'Executive resource library',
      'Early access to new programs',
      'Multi-location support',
      'Advisory council eligibility',
    ],
  },
];

export default function MembershipPage() {
  return (
    <>
      <PageHero
        title="Membership"
        subtitle="Join a national network of employers with access to the tools, resources, and programs that make running a business easier."
        breadcrumb="Membership"
      />

      <section className="section-padding">
        <div className="container-wide">
          <SectionHeading
            title="Membership tiers designed for your organization"
            description="Every membership includes full access to the AEA Resource Center, compliance updates, and employer tools. Choose the tier that fits your organization's size and needs."
            centered
          />

          <div className="mt-14 grid md:grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-xl border p-8 ${
                  tier.featured
                    ? 'border-navy-800 ring-2 ring-navy-800 bg-white'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {tier.featured && (
                  <span className="inline-block text-xs font-semibold text-white bg-navy-800 px-3 py-1 rounded-full mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-navy-900">{tier.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{tier.audience}</p>
                <ul className="mt-6 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <svg
                        className="w-4 h-4 text-accent-500 mt-0.5 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`mt-8 w-full text-center ${
                    tier.featured ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Contact us for details on membership fees and enrollment.
            All memberships are annual and include a satisfaction guarantee.
          </p>
        </div>
      </section>

      {/* What Members Get */}
      <section className="bg-gray-50 section-padding">
        <div className="container-wide">
          <SectionHeading
            title="What membership includes"
            centered
          />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Resource Center',
                desc: 'A growing library of guides, templates, checklists, and toolkits covering HR, compliance, hiring, operations, and more.',
              },
              {
                title: 'Compliance Alerts',
                desc: 'Timely notifications about employment law changes at the federal, state, and local level that affect your business.',
              },
              {
                title: 'Employer Tools',
                desc: 'Practical calculators, audit checklists, and planning worksheets for everyday employer tasks.',
              },
              {
                title: 'Programs & Savings',
                desc: 'Access to group purchasing programs for insurance, supplies, technology, and professional services.',
              },
              {
                title: 'Insights & Updates',
                desc: 'Regular articles and analysis on topics that matter to employers, written in plain language.',
              },
              {
                title: 'Peer Community',
                desc: 'Connect with other employers facing similar challenges, share knowledge, and learn from each other.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-navy-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to join?"
        description="Reach out to learn more about membership and how AEA can support your organization."
        primaryLabel="Contact Us"
        primaryHref="/contact"
        secondaryLabel="Why Join"
        secondaryHref="/why-join"
      />
    </>
  );
}
