import { Metadata } from 'next';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms of use for the American Employers Alliance website and services.',
};

export default function TermsOfUsePage() {
  return (
    <>
      <PageHero title="Terms of Use" breadcrumb="Legal" />

      <section className="section-padding">
        <div className="container-narrow prose-content">
          <p>
            <strong>Effective Date:</strong> January 1, 2024
          </p>
          <p>
            These Terms of Use govern your access to and use of the American
            Employers Alliance (&quot;AEA&quot;) website and services. By accessing or using
            our website, you agree to be bound by these terms.
          </p>

          <h2>Use of Website</h2>
          <p>
            The AEA website is provided for informational purposes and to support
            AEA members and prospective members. You agree to use the website only
            for lawful purposes and in accordance with these Terms of Use.
          </p>

          <h2>Membership</h2>
          <p>
            Certain features and resources on the AEA website are available only to
            AEA members. Membership is subject to separate membership agreements
            and terms.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            All content on the AEA website—including text, guides, templates,
            graphics, logos, and other materials—is owned by AEA or its licensors
            and is protected by copyright and other intellectual property laws.
          </p>
          <p>
            AEA members may use resources and templates for their internal business
            purposes. You may not redistribute, sell, or publicly share AEA
            materials without written permission.
          </p>

          <h2>Disclaimer</h2>
          <p>
            The information provided on the AEA website is for general
            informational purposes only. It does not constitute legal, tax,
            financial, or professional advice. AEA resources are designed to help
            employers understand their obligations, but they are not a substitute
            for professional counsel.
          </p>
          <p>
            Employment law varies by jurisdiction and changes frequently. Always
            verify information with qualified professionals and consult legal
            counsel for specific situations.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            AEA provides its website and resources &quot;as is&quot; without warranty of any
            kind. To the fullest extent permitted by law, AEA shall not be liable
            for any damages arising from your use of the website or reliance on any
            information provided.
          </p>

          <h2>Links to Third Parties</h2>
          <p>
            Our website may contain links to third-party websites or services. AEA
            is not responsible for the content or practices of any third-party
            websites.
          </p>

          <h2>Modifications</h2>
          <p>
            AEA reserves the right to modify these Terms of Use at any time. Changes
            will be posted on this page with a revised effective date. Continued use
            of the website after changes constitutes acceptance of the updated terms.
          </p>

          <h2>Governing Law</h2>
          <p>
            These Terms of Use are governed by the laws of the State of Vermont
            without regard to conflict of law provisions.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these Terms of Use may be directed to:
          </p>
          <p>
            American Employers Alliance<br />
            Burlington, Vermont<br />
            info@americanemployersalliance.org
          </p>
        </div>
      </section>
    </>
  );
}
