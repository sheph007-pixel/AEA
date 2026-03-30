import { Metadata } from 'next';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the American Employers Alliance. We\'re here to help with membership questions, resources, and employer support.',
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="Have questions about membership, resources, or programs? We're here to help."
        breadcrumb="Contact"
      />

      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Form */}
            <div>
              <h2 className="text-xl font-bold text-navy-900 mb-6">
                Send us a message
              </h2>
              <form className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">
                      First name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Last name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Organization name
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="employees" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Number of employees
                  </label>
                  <select
                    id="employees"
                    name="employees"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none transition-colors bg-white"
                  >
                    <option value="">Select range</option>
                    <option value="2-10">2–10</option>
                    <option value="11-25">11–25</option>
                    <option value="26-50">26–50</option>
                    <option value="51-100">51–100</option>
                    <option value="101-250">101–250</option>
                    <option value="251-500">251–500</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-1.5">
                    I&apos;m interested in
                  </label>
                  <select
                    id="interest"
                    name="interest"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none transition-colors bg-white"
                  >
                    <option value="">Select topic</option>
                    <option value="membership">Membership information</option>
                    <option value="resources">Resources and tools</option>
                    <option value="compliance">Compliance support</option>
                    <option value="programs">Programs and savings</option>
                    <option value="benefits">Benefits programs</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none transition-colors resize-none"
                  />
                </div>
                <button type="submit" className="btn-primary w-full sm:w-auto">
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-xl font-bold text-navy-900 mb-6">
                Get in touch
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-semibold text-navy-700 uppercase tracking-wide mb-3">
                    Headquarters
                  </h3>
                  <p className="text-gray-700">Burlington, Vermont</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-navy-700 uppercase tracking-wide mb-3">
                    Member Services
                  </h3>
                  <p className="text-gray-700">Alabama</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-navy-700 uppercase tracking-wide mb-3">
                    Email
                  </h3>
                  <p className="text-gray-700">info@americanemployersalliance.org</p>
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
