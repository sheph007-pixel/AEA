import Link from 'next/link';

const topics = [
  'Compliance',
  'HR Management',
  'Hiring',
  'Operations',
  'Workplace Culture',
  'Benefits',
  'Leadership',
  'Safety',
  'Technology',
  'Small Business',
];

const footerLinks = {
  Association: [
    { name: 'About AEA', href: '/about' },
    { name: 'Membership', href: '/membership' },
    { name: 'Why Join', href: '/why-join' },
    { name: 'Contact', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
  ],
  'For Employers': [
    { name: 'All Articles', href: '/resources' },
    { name: 'Employer Briefings', href: '/briefings' },
    { name: 'Employer Outlook', href: '/outlook' },
    { name: 'Employer News', href: '/news' },
    { name: 'HR & Compliance', href: '/hr-compliance' },
    { name: 'Employer Tools', href: '/employer-tools' },
    { name: 'Programs & Savings', href: '/programs-savings' },
    { name: 'Benefits Programs', href: '/benefits-programs' },
  ],
  Legal: [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Use', href: '/terms-of-use' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-white">
      <div className="container-wide py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-serif font-bold tracking-tight">
                AEA
              </span>
            </Link>
            <p className="mt-3 text-sm text-ink-400 leading-relaxed max-w-xs">
              American Employers Alliance is a national employer association
              helping businesses with 2-500 employees operate efficiently, stay
              compliant, and reduce costs.
            </p>
            <div className="mt-4 text-xs text-ink-500 space-y-1">
              <p>159 Bank Street, Fourth Floor, Burlington, VT 05401</p>
              <p>Founded 2013</p>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-4">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Topics row */}
        <div className="mt-12 pt-8 border-t border-ink-800">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-500 mb-3">
            Topics
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {topics.map((topic) => (
              <Link
                key={topic}
                href={`/resources?category=${encodeURIComponent(topic)}`}
                className="text-sm text-ink-400 hover:text-white transition-colors"
              >
                {topic}
              </Link>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-ink-800 flex flex-col md:flex-row items-center justify-between text-xs text-ink-500">
          <p>&copy; {new Date().getFullYear()} American Employers Alliance. All rights reserved.</p>
          <p className="mt-2 md:mt-0">
            A national employer association
          </p>
        </div>
      </div>
    </footer>
  );
}
