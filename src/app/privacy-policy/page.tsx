import { Metadata } from 'next';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for the American Employers Alliance website and services.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero title="Privacy Policy" breadcrumb="Legal" />

      <section className="section-padding">
        <div className="container-narrow prose-content">
          <p>
            <strong>Effective Date:</strong> January 1, 2024
          </p>
          <p>
            The American Employers Alliance (&quot;AEA,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is
            committed to protecting the privacy of our members, website visitors,
            and users. This Privacy Policy explains how we collect, use, and
            protect your information.
          </p>

          <h2>Information We Collect</h2>
          <h3>Information You Provide</h3>
          <p>We may collect information that you provide directly to us, including:</p>
          <ul>
            <li>Name, email address, phone number, and mailing address</li>
            <li>Organization name, title, and business information</li>
            <li>Membership application and enrollment information</li>
            <li>Communications you send to us</li>
            <li>Survey responses and feedback</li>
          </ul>

          <h3>Information Collected Automatically</h3>
          <p>When you visit our website, we may automatically collect:</p>
          <ul>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>IP address</li>
            <li>Pages visited and time spent on pages</li>
            <li>Referring website addresses</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process membership applications and manage member accounts</li>
            <li>Provide resources, tools, and services to members</li>
            <li>Send compliance alerts, updates, and communications</li>
            <li>Respond to inquiries and provide support</li>
            <li>Improve our website, resources, and programs</li>
            <li>Administer programs and services</li>
          </ul>

          <h2>Information Sharing</h2>
          <p>
            We do not sell your personal information. We may share your information
            with:
          </p>
          <ul>
            <li>Service providers who assist in operating our website and delivering programs</li>
            <li>Program partners when you enroll in specific programs (with your consent)</li>
            <li>As required by law or to protect our legal rights</li>
          </ul>

          <h2>Data Security</h2>
          <p>
            We implement reasonable security measures to protect your information
            from unauthorized access, use, or disclosure. However, no method of
            transmission over the Internet is 100% secure.
          </p>

          <h2>Cookies</h2>
          <p>
            Our website may use cookies and similar technologies to improve your
            experience, analyze website usage, and assist with our outreach. You
            can control cookies through your browser settings.
          </p>

          <h2>Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of your personal
            information by contacting us. We will respond to your request in
            accordance with applicable law.
          </p>

          <h2>Children&apos;s Privacy</h2>
          <p>
            Our website and services are not directed to individuals under the age
            of 18. We do not knowingly collect personal information from children.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will post the
            updated policy on this page with a revised effective date.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at:
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
