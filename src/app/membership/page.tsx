import { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import MembershipForm from '@/components/MembershipForm';

export const metadata: Metadata = {
  title: 'Membership',
  description:
    'AEA membership gives employers access to compliance guidance, HR resources, employer tools, and cost-saving programs.',
};

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
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Form */}
            <div>
              <h2 className="text-xl font-bold text-navy-900 mb-2">
                Become a member
              </h2>
              <p className="text-gray-600 mb-6">
                Complete the form below and we will be in touch to discuss how AEA
                can support your organization.
              </p>
              <MembershipForm />
            </div>

            {/* Info sidebar */}
            <div>
              <h2 className="text-xl font-bold text-navy-900 mb-6">
                Why employers join AEA
              </h2>
              <div className="space-y-6">
                {[
                  {
                    title: 'Compliance support',
                    desc: 'Stay current with employment law changes at the federal, state, and local level with plain-language guidance and alerts.',
                  },
                  {
                    title: 'HR resources and tools',
                    desc: 'Templates, checklists, and practical guides for hiring, performance management, terminations, and more.',
                  },
                  {
                    title: 'Cost savings programs',
                    desc: 'Group purchasing power for insurance, supplies, technology, and professional services.',
                  },
                  {
                    title: 'Employee benefits options',
                    desc: 'Access to competitive benefits programs and preferred partner rates that are typically only available to larger organizations.',
                  },
                  {
                    title: 'Employer community',
                    desc: 'Connect with other employers facing similar challenges. Share knowledge and learn from peers across the country.',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <svg className="w-5 h-5 text-accent-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-navy-900 text-sm">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-navy-800 rounded-xl p-6 text-white">
                <h3 className="font-semibold mb-2">Not sure if AEA is right for you?</h3>
                <p className="text-sm text-navy-200 leading-relaxed mb-3">
                  We are happy to answer any questions about membership and how AEA
                  supports employers of all sizes.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center text-sm font-semibold text-white hover:text-accent-300 transition-colors"
                >
                  Contact us &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What membership includes */}
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
                title: 'Programs and Savings',
                desc: 'Access to group purchasing programs for insurance, supplies, technology, and professional services.',
              },
              {
                title: 'Insights and Updates',
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
    </>
  );
}
