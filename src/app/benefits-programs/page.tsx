import { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import CTASection from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'Benefits and Risk Programs',
  description:
    'AEA members can access competitive employee benefits options and risk management programs through our network of partners and private programs.',
};

export default function BenefitsProgramsPage() {
  return (
    <>
      <PageHero
        title="Benefits and Risk Programs"
        subtitle="Access competitive employee benefits and risk management options through AEA's network of partners and private programs."
        breadcrumb="Benefits and Risk Programs"
      />

      <section className="section-padding">
        <div className="container-wide">
          <div className="max-w-3xl mb-16">
            <p className="text-ink-500 leading-relaxed mb-4">
              AEA members can access employee benefits and risk management programs
              that leverage our network of partners and the collective scale of our
              membership. These programs give smaller employers access to options and
              pricing that are typically only available to larger organizations.
            </p>
            <p className="text-ink-500 leading-relaxed">
              <strong className="text-ink-900">These programs are entirely optional.</strong>{' '}
              AEA membership provides substantial value through compliance resources,
              employer tools, and cost-saving programs even for members who never
              participate in benefits programs.
            </p>
          </div>

          <div className="space-y-16">
            {/* Employee Benefits */}
            <div>
              <SectionHeading
                title="Employee Benefits"
                description="Access competitive benefits options through AEA's partnerships and programs, designed to help you attract and retain talent."
              />
              <div className="mt-8 grid sm:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Health Coverage Options',
                    desc: 'Multiple health plan structures and carrier options that leverage our group scale for better rates and broader choices than most small employers can access individually.',
                  },
                  {
                    title: 'Preferred Partner Rates',
                    desc: 'Access to negotiated rates and programs through our vetted network of benefits providers and carriers.',
                  },
                  {
                    title: 'Private Programs',
                    desc: 'Exclusive programs available only to AEA members, designed to provide competitive advantages in benefits and coverage.',
                  },
                  {
                    title: 'Benefits Administration Support',
                    desc: 'Guidance on plan selection, enrollment processes, compliance requirements, and ongoing administration.',
                  },
                ].map((item) => (
                  <div key={item.title} className="bg-ink-50 rounded border border-ink-100 p-6">
                    <h3 className="font-semibold text-ink-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-ink-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Management */}
            <div>
              <SectionHeading
                title="Risk Management"
                description="Programs and resources that help employers manage risk, control costs, and improve outcomes."
              />
              <div className="mt-8 grid sm:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Workers Compensation Programs',
                    desc: 'Competitive workers compensation options that reward employers who invest in safety and effective claims management.',
                  },
                  {
                    title: 'Loss Control Resources',
                    desc: 'Access to safety programs, risk assessments, and loss prevention tools to help reduce workplace incidents and claims.',
                  },
                  {
                    title: 'Claims Management Support',
                    desc: 'Guidance on managing claims effectively, implementing return-to-work programs, and controlling insurance costs.',
                  },
                  {
                    title: 'Program Transparency',
                    desc: 'Clear reporting and visibility into how programs perform, so employers can make informed decisions about their risk management strategy.',
                  },
                ].map((item) => (
                  <div key={item.title} className="bg-ink-50 rounded border border-ink-100 p-6">
                    <h3 className="font-semibold text-ink-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-ink-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Supplemental */}
            <div>
              <SectionHeading
                title="Supplemental Benefits"
                description="Round out your benefits package with additional options available through AEA."
              />
              <div className="mt-8 grid sm:grid-cols-3 gap-6">
                {[
                  'Dental and vision coverage',
                  'Life and disability insurance',
                  'Employee assistance programs',
                  'Retirement plan options',
                  'Voluntary benefits',
                  'Wellness resources',
                ].map((item) => (
                  <div key={item} className="bg-ink-50 rounded border border-ink-100 p-4 text-center">
                    <p className="text-sm font-medium text-ink-900">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink-50 section-padding">
        <div className="container-narrow text-center">
          <h2 className="text-2xl font-bold text-ink-900 mb-4">
            Interested in learning more?
          </h2>
          <p className="text-ink-500 leading-relaxed max-w-xl mx-auto mb-8">
            Benefits and risk programs are tailored to each organization. Contact us
            to discuss which programs might be a fit for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary">
              Contact Us
            </Link>
            <Link href="/membership" className="btn-secondary">
              Become a Member
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
