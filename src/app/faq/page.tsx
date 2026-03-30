import { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import CTASection from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about AEA membership, resources, programs, and employer support.',
};

const faqs = [
  {
    category: 'About AEA',
    items: [
      {
        q: 'What is the American Employers Alliance?',
        a: 'AEA is a national employer association founded in 2013 in Vermont. We help employers across the United States operate more efficiently, stay compliant, reduce costs, and access practical tools and support. Our headquarters is at 159 Bank Street, Fourth Floor, Burlington, VT 05401, with a member services office in Vestavia Hills, Alabama.',
      },
      {
        q: 'Who is AEA for?',
        a: 'AEA serves employer groups with approximately 2-500 employees across all industries. Our members include small businesses, growing companies, and established organizations that need practical, reliable resources for managing their workforce.',
      },
      {
        q: 'Is AEA an insurance company?',
        a: 'No. AEA is an employer association. While we do offer access to insurance and benefits programs as part of our membership, these are optional. Most of our value comes from compliance resources, employer tools, and cost-saving programs that have nothing to do with insurance.',
      },
    ],
  },
  {
    category: 'Membership',
    items: [
      {
        q: 'What does AEA membership include?',
        a: 'All members receive access to the Resource Center, compliance alerts and updates, HR templates and checklists, employer tools, and group purchasing programs.',
      },
      {
        q: 'How much does membership cost?',
        a: 'Contact us for current membership details. Most members find that the savings from cost-reduction programs and the value of compliance resources more than cover the annual membership fee.',
      },
      {
        q: 'Is membership annual?',
        a: 'Yes. AEA membership is on an annual basis. All memberships include a satisfaction guarantee.',
      },
      {
        q: 'Do I need to buy insurance to be a member?',
        a: 'No. Benefits and insurance programs are entirely optional. Many members join AEA solely for the compliance resources, employer tools, and cost-saving programs. You receive full membership value without ever participating in a benefits program.',
      },
    ],
  },
  {
    category: 'Resources & Tools',
    items: [
      {
        q: 'What kind of resources does AEA provide?',
        a: 'Our Resource Center includes guides on HR management, compliance checklists, hiring best practices, operational frameworks, policy templates, and more. We also publish regular insights and compliance updates. Resources are written specifically for employers - practical and actionable.',
      },
      {
        q: 'How often are resources updated?',
        a: 'Resources are reviewed and updated regularly, especially when employment laws change. We publish new resources and insights on an ongoing basis.',
      },
      {
        q: 'Can I use AEA templates and tools in my business?',
        a: 'Yes. All resources in the member library are designed to be used directly in your business. Templates are customizable to your organization\'s needs. We always recommend having final documents reviewed by legal counsel for your specific state.',
      },
    ],
  },
  {
    category: 'Programs & Benefits',
    items: [
      {
        q: 'What cost-saving programs are available?',
        a: 'Members can access group purchasing programs for workers\' compensation, business insurance, payroll and HR technology, office supplies, professional services, and employee perks. These programs leverage our collective membership size to negotiate better rates.',
      },
      {
        q: 'What benefits programs does AEA offer?',
        a: 'AEA members can access competitive employee benefits options through our network of partners and private programs. We also offer supplemental benefits such as dental, vision, life, and disability coverage. These programs are optional and available to eligible members.',
      },
      {
        q: 'Are benefits programs available in all states?',
        a: 'Program availability may vary by state due to regulatory differences. Contact us to discuss which programs are available in your state.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Common questions about AEA, membership, resources, and programs."
        breadcrumb="FAQ"
      />

      <section className="section-padding">
        <div className="container-narrow">
          <div className="space-y-16">
            {faqs.map((section) => (
              <div key={section.category}>
                <h2 className="text-xl font-bold text-ink-900 mb-8 pb-3 border-b border-ink-100">
                  {section.category}
                </h2>
                <div className="space-y-8">
                  {section.items.map((faq) => (
                    <div key={faq.q}>
                      <h3 className="text-base font-semibold text-ink-900 mb-2">
                        {faq.q}
                      </h3>
                      <p className="text-ink-500 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-ink-50 rounded border border-ink-100 p-8 text-center">
            <h2 className="text-lg font-bold text-ink-900 mb-2">
              Still have questions?
            </h2>
            <p className="text-ink-500 mb-6">
              We&apos;re happy to help. Reach out and we&apos;ll respond within one business day.
            </p>
            <Link href="/contact" className="btn-primary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
