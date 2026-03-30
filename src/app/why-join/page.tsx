import { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import CTASection from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'Why Join AEA',
  description:
    'See why employers across the country rely on AEA for compliance support, HR resources, cost savings, and practical tools.',
};

const reasons = [
  {
    title: 'Stay compliant without a legal department',
    description:
      'Employment law changes constantly at the federal, state, and local level. AEA monitors those changes and delivers plain-language guidance so you can stay current without hiring a team of lawyers.',
    details: [
      'Regulatory change alerts delivered as they happen',
      'Plain-language compliance guides for complex topics',
      'State-by-state comparisons for multi-state employers',
      'Checklists and audit tools for self-assessment',
    ],
  },
  {
    title: 'Access resources built for your size',
    description:
      'Most HR resources are written for large enterprises or for HR professionals. AEA resources are designed specifically for businesses with 2-500 employees - practical, actionable, and written for employers.',
    details: [
      'Employee handbook templates and policy guides',
      'Hiring and onboarding checklists',
      'Performance management frameworks',
      'Termination procedures and documentation guides',
    ],
  },
  {
    title: 'Reduce costs through group purchasing',
    description:
      'As an individual employer, you lack the purchasing power of larger organizations. Through AEA, members access group rates on insurance, supplies, professional services, and technology.',
    details: [
      'Insurance programs with group pricing',
      'Discounted professional services',
      'Technology and office supply programs',
      'Workers\' compensation and risk management solutions',
    ],
  },
  {
    title: 'Operate more efficiently',
    description:
      'Running a business with employees involves hundreds of administrative and operational tasks. AEA provides the tools and templates that make those tasks faster, easier, and less error-prone.',
    details: [
      'Payroll and tax compliance guides',
      'Record-keeping requirements and retention schedules',
      'Workplace safety program templates',
      'Business continuity planning resources',
    ],
  },
  {
    title: 'Join a national employer community',
    description:
      'Being an employer can be isolating, especially for smaller organizations. AEA connects you with a national network of employers who face the same challenges you do.',
    details: [
      'Peer networking opportunities',
      'Shared knowledge and best practices',
      'Advocacy for employer-friendly policies',
      'A voice in the national conversation about employment',
    ],
  },
  {
    title: 'Access benefits programs (if you choose)',
    description:
      'AEA offers access to group health plans, captive insurance programs, and other benefits structures. These are optional - members receive full value even if they never participate in benefits programs.',
    details: [
      'Group health plan options',
      'Captive insurance programs',
      'Voluntary benefits for employees',
      'Benefits administration support',
    ],
  },
];

export default function WhyJoinPage() {
  return (
    <>
      <PageHero
        title="Why Employers Join AEA"
        subtitle="Membership is designed to deliver immediate, practical value - regardless of your industry, location, or size."
        breadcrumb="Why Join"
      />

      <section className="section-padding">
        <div className="container-wide">
          <div className="space-y-16">
            {reasons.map((reason, i) => (
              <div
                key={reason.title}
                className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-start ${
                  i % 2 === 1 ? 'lg:direction-rtl' : ''
                }`}
              >
                <div>
                  <span className="inline-block text-xs font-semibold text-accent-600 bg-accent-50 px-3 py-1 rounded-full mb-4">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="text-2xl font-bold text-navy-900 mb-3">
                    {reason.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {reason.description}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-sm font-semibold text-navy-700 mb-4 uppercase tracking-wide">
                    Includes
                  </h3>
                  <ul className="space-y-3">
                    {reason.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-3 text-sm">
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
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick summary */}
      <section className="bg-gray-50 section-padding">
        <div className="container-narrow text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-navy-900 mb-6">
            Membership pays for itself
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
            Between compliance resources that help you avoid costly mistakes,
            operational tools that save you time, and cost-saving programs that
            reduce your expenses, most members find that AEA membership pays for
            itself many times over.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/membership" className="btn-primary">
              View Membership Options
            </Link>
            <Link href="/contact" className="btn-secondary">
              Talk to Us
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
