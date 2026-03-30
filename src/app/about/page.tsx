import { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import CTASection from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'About AEA',
  description:
    'Learn about the American Employers Alliance, a national employer association founded in 2013 to help businesses operate efficiently and stay compliant.',
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About American Employers Alliance"
        subtitle="A national employer association dedicated to helping businesses operate with confidence."
        breadcrumb="About"
      />

      <section className="section-padding">
        <div className="container-narrow">
          <div className="prose-content">
            <h2>Our Mission</h2>
            <p>
              The American Employers Alliance (AEA) exists to help employers across
              the United States operate more efficiently, stay compliant with
              employment regulations, reduce costs, and access practical tools and
              support. We serve businesses with approximately 2-500 employees across
              all industries.
            </p>

            <h2>Who We Are</h2>
            <p>
              Founded in 2013, AEA is a national employer association
              incorporated in the State of Vermont. Our
              headquarters is located at 159 Bank Street, Fourth Floor,
              Burlington, VT 05401, with a member services office at 2828 Old
              280 Ct, Vestavia Hills, AL 35243. We are not an insurance company,
              a staffing agency, or a consulting firm. We are an
              association - built by employers, for employers.
            </p>
            <p>
              Our members are employer groups - small businesses, growing
              companies, and established organizations across all industries,
              typically with 2-500 employees. What they share is a need for
              practical, reliable resources to navigate the complexity of
              operating a business with employees.
            </p>

            <h2>What We Do</h2>
            <p>
              AEA provides a comprehensive set of tools and resources that help
              employers manage their operations:
            </p>
            <ul>
              <li>
                <strong>Compliance guidance</strong> - Keeping up with federal,
                state, and local employment laws is a significant challenge for
                employers of all sizes. AEA provides timely updates, plain-language
                guides, and practical checklists to help members stay informed.
              </li>
              <li>
                <strong>HR resources</strong> - From employee handbooks to
                performance management to termination procedures, our resource
                library covers the situations employers face every day.
              </li>
              <li>
                <strong>Employer tools</strong> - Calculators, audit templates,
                planning worksheets, and operational guides designed for businesses
                that don&apos;t have large HR departments.
              </li>
              <li>
                <strong>Cost savings programs</strong> - Group purchasing power for
                insurance, supplies, professional services, and technology.
              </li>
              <li>
                <strong>Benefits programs</strong> - Access to competitive employee
                benefits options and risk management programs through our
                partners and private programs.
              </li>
            </ul>

            <h2>Our Approach</h2>
            <p>
              We believe employers deserve straightforward, practical support - not
              sales pitches. AEA membership is designed to deliver value through the
              resources, tools, and programs themselves. Benefits and insurance
              programs are available to members who want them, but they are not the
              primary reason most employers join.
            </p>

            <h2>National Reach</h2>
            <p>
              AEA serves employers in all 50 states. Employment law is complex and
              varies significantly from state to state. Our resources are designed to
              address both federal requirements and the state-level variations that
              create the most confusion and risk for employers.
            </p>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
