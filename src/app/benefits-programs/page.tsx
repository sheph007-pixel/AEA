import { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import CTASection from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'Benefits & Risk Programs',
  description:
    'AEA offers access to group health plans, captive insurance programs, and other benefits structures for member employers.',
};

export default function BenefitsProgramsPage() {
  return (
    <>
      <PageHero
        title="Benefits & Risk Programs"
        subtitle="Access benefits structures and risk management programs typically available only to larger organizations."
        breadcrumb="Benefits & Risk Programs"
      />

      <section className="section-padding">
        <div className="container-wide">
          <div className="max-w-3xl mb-16">
            <p className="text-gray-600 leading-relaxed mb-4">
              AEA offers members optional access to group benefits and risk
              management programs. These programs leverage the collective size of
              our membership to provide options that individual employers—especially
              those with fewer than 100 employees—often cannot access on their own.
            </p>
            <p className="text-gray-600 leading-relaxed">
              <strong className="text-navy-900">These programs are entirely optional.</strong>{' '}
              AEA membership provides substantial value through compliance resources,
              employer tools, and cost-saving programs even for members who never
              participate in benefits programs.
            </p>
          </div>

          <div className="space-y-16">
            {/* Group Health Plans */}
            <div>
              <SectionHeading
                title="Group Health Plans"
                description="Access to health plan options that use the association's collective size to improve pricing, plan design, and stability."
              />
              <div className="mt-8 grid sm:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Association Health Plan',
                    desc: 'AEA\'s association health plan allows small employers to participate in a larger group, potentially improving rates and plan options compared to the individual small group market.',
                  },
                  {
                    title: 'Level-Funded Options',
                    desc: 'Level-funded arrangements provide the cost predictability of fully insured plans with the potential savings and data transparency of self-funded structures.',
                  },
                  {
                    title: 'Plan Design Flexibility',
                    desc: 'Multiple plan designs and contribution strategies allow employers to offer competitive benefits while managing costs.',
                  },
                  {
                    title: 'Benefits Administration Support',
                    desc: 'Guidance on plan selection, enrollment processes, compliance requirements, and ongoing administration.',
                  },
                ].map((item) => (
                  <div key={item.title} className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-navy-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Captive Insurance */}
            <div>
              <SectionHeading
                title="Captive Insurance Programs"
                description="Member-owned captive insurance structures that give employers more control over their risk and potential for cost savings."
              />
              <div className="mt-8 grid sm:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Group Captive Programs',
                    desc: 'Pool risk with other well-managed employers in a member-owned structure. Good loss experience can result in dividend returns.',
                  },
                  {
                    title: 'Workers\' Compensation Captive',
                    desc: 'A captive structure specifically for workers\' compensation that rewards employers who invest in safety and claims management.',
                  },
                  {
                    title: 'Risk Management Resources',
                    desc: 'Access to loss control services, safety programs, and claims management support designed to improve your risk profile.',
                  },
                  {
                    title: 'Transparent Financials',
                    desc: 'Captive members receive detailed financial reporting on the program\'s performance, giving employers visibility into how their premiums are used.',
                  },
                ].map((item) => (
                  <div key={item.title} className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-navy-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Benefits */}
            <div>
              <SectionHeading
                title="Additional Benefits Options"
                description="Supplement your benefits package with voluntary and ancillary programs available through AEA."
              />
              <div className="mt-8 grid sm:grid-cols-3 gap-6">
                {[
                  'Dental and vision plans',
                  'Life and disability insurance',
                  'Employee assistance programs (EAP)',
                  'Flexible spending accounts (FSA)',
                  'Health savings accounts (HSA)',
                  'Retirement plan options',
                ].map((item) => (
                  <div key={item} className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-center">
                    <p className="text-sm font-medium text-navy-900">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 section-padding">
        <div className="container-narrow text-center">
          <h2 className="text-2xl font-bold text-navy-900 mb-4">
            Interested in learning more?
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-xl mx-auto mb-8">
            Benefits and risk programs require evaluation based on your specific
            organization. Contact us to discuss which programs might be a fit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary">
              Contact Us
            </Link>
            <Link href="/resources/employer-guide-health-plans" className="btn-secondary">
              Health Plan Options Guide
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
