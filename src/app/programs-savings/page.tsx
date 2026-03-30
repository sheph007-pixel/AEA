import { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import CTASection from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'Programs & Savings',
  description:
    'AEA group purchasing programs help members reduce costs on insurance, supplies, technology, and professional services.',
};

const programs = [
  {
    title: 'Workers\' Compensation',
    description:
      'Access competitive workers\' compensation rates through group programs designed for small and mid-sized employers. Includes risk management resources and claims support.',
    features: [
      'Competitive group rates',
      'Risk management support',
      'Claims management guidance',
      'Safety program resources',
    ],
  },
  {
    title: 'Business Insurance',
    description:
      'General liability, professional liability, property insurance, and other business coverages through preferred carriers with member pricing.',
    features: [
      'General liability programs',
      'Professional liability options',
      'Property and casualty coverage',
      'Bundled policy discounts',
    ],
  },
  {
    title: 'Payroll & HR Technology',
    description:
      'Discounted access to payroll processing, time tracking, HR management software, and related technology platforms.',
    features: [
      'Payroll processing discounts',
      'HR software preferred pricing',
      'Time and attendance solutions',
      'Integration support',
    ],
  },
  {
    title: 'Office & Supplies',
    description:
      'Group purchasing rates on office supplies, equipment, printing services, and other everyday business expenses.',
    features: [
      'Office supply discounts',
      'Equipment purchasing programs',
      'Shipping rate reductions',
      'Print and marketing services',
    ],
  },
  {
    title: 'Professional Services',
    description:
      'Preferred rates on legal, accounting, consulting, and other professional services from vetted providers.',
    features: [
      'Employment law consultations',
      'Accounting and tax services',
      'HR consulting',
      'Background check services',
    ],
  },
  {
    title: 'Employee Perks & Discounts',
    description:
      'Offer your employees access to discount programs on travel, entertainment, wellness, and everyday purchases at no cost to you.',
    features: [
      'Employee discount marketplace',
      'Travel and entertainment deals',
      'Wellness program resources',
      'Financial wellness tools',
    ],
  },
];

export default function ProgramsSavingsPage() {
  return (
    <>
      <PageHero
        title="Programs & Savings"
        subtitle="Leverage the collective purchasing power of a national employer association to reduce costs across your business."
        breadcrumb="Programs & Savings"
      />

      <section className="section-padding">
        <div className="container-wide">
          <SectionHeading
            title="Group purchasing programs for members"
            description="AEA negotiates preferred rates and programs on behalf of our members. These programs are available at no additional cost beyond membership."
            centered
          />

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program) => (
              <div key={program.title} className="card">
                <h3 className="text-lg font-semibold text-ink-900 mb-2">
                  {program.title}
                </h3>
                <p className="text-sm text-ink-500 leading-relaxed mb-4">
                  {program.description}
                </p>
                <ul className="space-y-2">
                  {program.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-ink-700">
                      <svg
                        className="w-4 h-4 text-brand-red mt-0.5 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink-50 section-padding">
        <div className="container-narrow text-center">
          <h2 className="text-2xl font-bold text-ink-900 mb-4">
            Savings that offset membership costs
          </h2>
          <p className="text-ink-500 leading-relaxed max-w-xl mx-auto mb-8">
            Most members find that the savings from even one or two programs more
            than cover the cost of their annual membership. And programs are just
            one part of the value AEA delivers.
          </p>
          <Link href="/contact" className="btn-primary">
            Learn About Pricing
          </Link>
        </div>
      </section>

      <CTASection />
    </>
  );
}
