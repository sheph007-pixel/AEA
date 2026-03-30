import { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import CTASection from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'Employer Tools',
  description:
    'Practical calculators, checklists, templates, and planning tools for employers managing HR, compliance, and operations.',
};

const toolCategories = [
  {
    title: 'Compliance Tools',
    description: 'Self-assessment tools and checklists to verify compliance with key regulations.',
    tools: [
      { name: 'FLSA Classification Checklist', desc: 'Assess whether positions are correctly classified as exempt or non-exempt.' },
      { name: 'I-9 Audit Worksheet', desc: 'Systematic review of I-9 forms for completeness and accuracy.' },
      { name: 'FMLA Eligibility Calculator', desc: 'Determine whether an employee meets FMLA eligibility requirements.' },
      { name: 'ACA Status Determination Tool', desc: 'Calculate full-time equivalent employees and ALE status.' },
      { name: 'Record Retention Schedule', desc: 'Reference guide for federal record-keeping requirements and timelines.' },
      { name: 'Posting Requirements Checklist', desc: 'Verify you have all required federal and state workplace postings.' },
    ],
  },
  {
    title: 'HR Templates',
    description: 'Customizable templates for common HR processes and documentation.',
    tools: [
      { name: 'Employee Handbook Template', desc: 'Comprehensive template covering essential handbook sections.' },
      { name: 'Offer Letter Template', desc: 'Professional offer letter with appropriate at-will language.' },
      { name: 'Performance Review Form', desc: 'Structured performance evaluation form with goal-setting sections.' },
      { name: 'Disciplinary Action Form', desc: 'Documentation template for progressive discipline steps.' },
      { name: 'Exit Interview Questionnaire', desc: 'Structured questions to gather useful feedback from departing employees.' },
      { name: 'Job Description Template', desc: 'Framework for creating clear, compliant job descriptions.' },
    ],
  },
  {
    title: 'Operational Guides',
    description: 'Step-by-step guides for key employer processes and decisions.',
    tools: [
      { name: 'New Hire Onboarding Checklist', desc: 'Complete checklist from pre-start preparation through the first 90 days.' },
      { name: 'Termination Process Guide', desc: 'Step-by-step process for legally sound terminations.' },
      { name: 'Workplace Investigation Framework', desc: 'Structured approach to conducting internal investigations.' },
      { name: 'Safety Program Development Guide', desc: 'Build a workplace safety program that meets OSHA requirements.' },
      { name: 'Benefits Plan Comparison Worksheet', desc: 'Compare health plan options across key criteria.' },
      { name: 'Business Continuity Plan Template', desc: 'Framework for developing your organization\'s continuity plan.' },
    ],
  },
  {
    title: 'Planning & Analysis',
    description: 'Tools for budgeting, planning, and analyzing employer costs and obligations.',
    tools: [
      { name: 'Compensation Benchmarking Guide', desc: 'Framework for evaluating competitive compensation levels.' },
      { name: 'Turnover Cost Calculator', desc: 'Estimate the true cost of employee turnover in your organization.' },
      { name: 'Benefits Budget Planner', desc: 'Plan and project benefits costs for the coming year.' },
      { name: 'Workers\' Comp Premium Estimator', desc: 'Understand the factors that drive your workers\' comp costs.' },
      { name: 'Multi-State Compliance Tracker', desc: 'Track obligations across multiple states where you have employees.' },
      { name: 'HR Compliance Calendar', desc: 'Annual calendar of filing deadlines and compliance obligations.' },
    ],
  },
];

export default function EmployerToolsPage() {
  return (
    <>
      <PageHero
        title="Employer Tools"
        subtitle="Practical tools, templates, and calculators designed for employers who don't have large HR departments."
        breadcrumb="Employer Tools"
      />

      <section className="section-padding">
        <div className="container-wide">
          <div className="space-y-16">
            {toolCategories.map((category) => (
              <div key={category.title}>
                <SectionHeading
                  title={category.title}
                  description={category.description}
                />
                <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.tools.map((tool) => (
                    <div key={tool.name} className="card">
                      <h3 className="font-semibold text-ink-900 mb-2 text-sm">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-ink-500 leading-relaxed">
                        {tool.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink-50 section-padding">
        <div className="container-narrow text-center">
          <h2 className="text-2xl font-bold text-ink-900 mb-4">
            Tools built for real employer needs
          </h2>
          <p className="text-ink-500 leading-relaxed mb-6">
            Every tool in the AEA library is designed based on the actual questions,
            challenges, and processes that employers deal with every day. No filler,
            no theory - just practical resources you can use immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/membership" className="btn-primary">
              Access All Tools
            </Link>
            <Link href="/resources" className="btn-secondary">
              Browse Resource Center
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
