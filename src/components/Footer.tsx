import Link from 'next/link';

const footerLinks = {
  Association: [
    { name: 'About AEA', href: '/about' },
    { name: 'Membership', href: '/membership' },
    { name: 'Why Join', href: '/why-join' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
  ],
  Resources: [
    { name: 'Resource Center', href: '/resources' },
    { name: 'HR & Compliance', href: '/hr-compliance' },
    { name: 'Employer Tools', href: '/employer-tools' },
    { name: 'Insights & Updates', href: '/insights' },
  ],
  Programs: [
    { name: 'Programs & Savings', href: '/programs-savings' },
    { name: 'Benefits & Risk Programs', href: '/benefits-programs' },
  ],
  Legal: [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Use', href: '/terms-of-use' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      <div className="container-wide section-padding">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
                <span className="text-navy-900 font-bold text-base">A</span>
              </div>
              <span className="text-lg font-bold">AEA</span>
            </div>
            <p className="text-navy-300 text-sm leading-relaxed mb-4 max-w-xs">
              American Employers Alliance is a national employer association
              helping businesses operate efficiently, stay compliant, and reduce
              costs.
            </p>
            <p className="text-navy-400 text-xs">
              159 Bank Street, Fourth Floor
            </p>
            <p className="text-navy-400 text-xs">
              Burlington, VT 05401
            </p>
            <p className="text-navy-400 text-xs mt-2">Founded 2013</p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white mb-4 tracking-wide uppercase">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-navy-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-navy-800 flex flex-col md:flex-row items-center justify-between text-sm text-navy-400">
          <p>&copy; {new Date().getFullYear()} American Employers Alliance. All rights reserved.</p>
          <p className="mt-2 md:mt-0">
            A national employer association
          </p>
        </div>
      </div>
    </footer>
  );
}
