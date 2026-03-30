'use client';

import Link from 'next/link';
import { useState } from 'react';

const navigation = [
  { name: 'About', href: '/about' },
  {
    name: 'Membership',
    href: '/membership',
    children: [
      { name: 'Why Join', href: '/why-join' },
      { name: 'Membership Overview', href: '/membership' },
    ],
  },
  {
    name: 'Resources',
    href: '/resources',
    children: [
      { name: 'Resource Center', href: '/resources' },
      { name: 'HR & Compliance', href: '/hr-compliance' },
      { name: 'Employer Tools', href: '/employer-tools' },
    ],
  },
  {
    name: 'Programs',
    href: '/programs-savings',
    children: [
      { name: 'Programs & Savings', href: '/programs-savings' },
      { name: 'Benefits & Risk Programs', href: '/benefits-programs' },
    ],
  },
  { name: 'Insights', href: '/insights' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container-wide">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 bg-navy-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-bold text-navy-900 leading-tight">
                American Employers Alliance
              </div>
              <div className="text-xs text-gray-500 tracking-wide uppercase">
                National Employer Association
              </div>
            </div>
            <div className="sm:hidden">
              <div className="text-base font-bold text-navy-900">AEA</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() =>
                  item.children && setOpenDropdown(item.name)
                }
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-navy-900 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {item.name}
                  {item.children && (
                    <svg
                      className="inline-block w-3.5 h-3.5 ml-1 -mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </Link>

                {item.children && openDropdown === item.name && (
                  <div className="absolute left-0 top-full pt-1 w-56">
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-navy-900"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center space-x-3">
            <Link href="/membership" className="hidden md:inline-flex btn-primary text-sm">
              Become a Member
            </Link>
            <button
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="container-wide py-4 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className="block px-3 py-2.5 text-base font-medium text-gray-700 hover:text-navy-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.name}
                </Link>
                {item.children &&
                  item.children.map((child) => (
                    <Link
                      key={child.name}
                      href={child.href}
                      className="block pl-8 pr-3 py-2 text-sm text-gray-500 hover:text-navy-900 hover:bg-gray-50 rounded-md"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.name}
                    </Link>
                  ))}
              </div>
            ))}
            <div className="pt-3">
              <Link
                href="/membership"
                className="btn-primary w-full text-center"
                onClick={() => setMobileOpen(false)}
              >
                Become a Member
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
