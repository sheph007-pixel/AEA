import { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the American Employers Alliance. Complete our contact form and we will respond within one business day.',
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="Have questions about membership, resources, or programs? Complete the form below and we will respond within one business day."
        breadcrumb="Contact"
      />

      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <h2 className="font-serif text-xl font-bold text-ink-900 mb-6">
                Send us a message
              </h2>
              <ContactForm />
            </div>

            <div>
              <h2 className="font-serif text-xl font-bold text-ink-900 mb-6">
                Our Offices
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-3">
                    Headquarters
                  </h3>
                  <p className="text-ink-700">
                    159 Bank Street, Fourth Floor<br />
                    Burlington, VT 05401
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-3">
                    Alabama Office
                  </h3>
                  <p className="text-ink-700">
                    2828 Old 280 Ct<br />
                    Vestavia Hills, AL 35243
                  </p>
                </div>
                <div className="bg-ink-50 border border-ink-100 p-6">
                  <h3 className="font-semibold text-ink-900 mb-2">
                    Response times
                  </h3>
                  <p className="text-sm text-ink-500 leading-relaxed">
                    We respond to all inquiries within one business day. For
                    time-sensitive compliance questions, members receive priority
                    support.
                  </p>
                </div>
                <div className="bg-ink-900 p-6 text-white">
                  <h3 className="font-semibold mb-2">Already a member?</h3>
                  <p className="text-sm text-ink-400 leading-relaxed">
                    Members can access direct support through their member portal
                    or by contacting their account representative.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
