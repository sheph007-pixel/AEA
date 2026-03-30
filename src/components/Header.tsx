'use client';

import Link from 'next/link';
import { useState } from 'react';

const categories = [
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

const navLinks = [
  { name: 'Articles', href: '/resources' },
  { name: 'About', href: '/about' },
  { name: 'Membership', href: '/membership' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [topicsOpen, setTopicsOpen] = useState(false);

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-ink-100">
      {/* Top bar */}
      <div className="bg-ink-900">
        <div className="container-wide flex items-center justify-between h-8">
          <p className="text-xs text-ink-400 hidden sm:block">
            National Employer Association - Est. 2013
          </p>
          <Link
            href="/membership"
            className="text-xs font-semibold text-white hover:text-brand-red transition-colors ml-auto"
          >
            Become a Member
          </Link>
        </div>
      </div>

      {/* Main nav */}
      <div className="container-wide">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl font-serif font-bold text-ink-900 tracking-tight">
              AEA
            </span>
            <span className="hidden md:block text-xs text-ink-400 leading-tight border-l border-ink-200 pl-2 ml-1">
              American<br />Employers Alliance
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Topics Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setTopicsOpen(true)}
              onMouseLeave={() => setTopicsOpen(false)}
            >
              <button className="px-3 py-2 text-sm font-semibold text-ink-700 hover:text-ink-900 transition-colors flex items-center gap-1">
                Topics
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {topicsOpen && (
                <div className="absolute left-0 top-full pt-2 w-[480px]">
                  <div className="bg-white rounded-lg shadow-xl border border-ink-100 p-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-4">
                      Browse by Topic
                    </p>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                      {categories.map((cat) => (
                        <Link
                          key={cat}
                          href={`/resources?category=${encodeURIComponent(cat)}`}
                          className="text-sm text-ink-700 hover:text-brand-red py-1.5 transition-colors"
                        >
                          {cat}
                        </Link>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-ink-100">
                      <Link
                        href="/resources"
                        className="text-sm font-semibold text-brand-red hover:text-brand-red-dark"
                      >
                        View all articles &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-ink-600 hover:text-ink-900 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 text-ink-600 hover:text-ink-900"
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

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-ink-100 bg-white">
          <div className="container-wide py-4">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-2.5 text-base font-medium text-ink-700 hover:text-ink-900 hover:bg-ink-50 rounded"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-ink-100">
              <p className="px-3 text-xs font-bold uppercase tracking-widest text-ink-400 mb-3">
                Topics
              </p>
              <div className="grid grid-cols-2 gap-1">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/resources?category=${encodeURIComponent(cat)}`}
                    className="px-3 py-2 text-sm text-ink-600 hover:text-brand-red rounded"
                    onClick={() => setMobileOpen(false)}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-ink-100">
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
