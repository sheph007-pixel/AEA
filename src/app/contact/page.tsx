import { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the American Employers Alliance. We are here to help with membership questions, resources, and employer support.',
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="Have questions about membership, resources, or programs? We are here to help."
        breadcrumb="Contact"
      />

      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <h2 className="text-xl font-bold text-navy-900 mb-6">
                Send us a message
              </h2>
              <ContactForm />
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-900 mb-6">
                Get in touch
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-semibold text-navy-700 uppercase tracking-wide mb-3">
                    Headquarters
                  </h3>
                  <p className="text-gray-700">
                    159 Bank Street, Fourth Floor<br />
                    Burlington, VT 05401
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-navy-700 uppercase tracking-wide mb-3">
                    Alabama Office
                  </h3>
                  <p className="text-gray-700">
                    2828 Old 280 Ct<br />
                    Vestavia Hills, AL 35243
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-navy-700 uppercase tracking-wide mb-3">
                    Email
                  </h3>
                  <p className="text-gray-700">info@americanemployers.org</p>
                </div>
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-navy-900 mb-2">
                    Response times
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    We respond to all inquiries within one business day. For
                    time-sensitive compliance questions, members receive priority
                    support.
                  </p>
                </div>
                <div className="bg-navy-800 rounded-xl p-6 text-white">
                  <h3 className="font-semibold mb-2">Already a member?</h3>
                  <p className="text-sm text-navy-200 leading-relaxed">
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
