import Link from 'next/link';
import { getAllContent, getRecentContent, getContentByCategory } from '@/lib/content';
import CTASection from '@/components/CTASection';

export default function HomePage() {
  const allContent = getAllContent();
  const recent = getRecentContent(6);
  const byCategory = getContentByCategory();

  return (
    <>
      {/* Hero */}
      <section className="bg-ink-900">
        <div className="container-wide py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-4">
              National Employer Association - Est. 2013
            </p>
            <h1 className="font-serif text-4xl md:text-5.5xl font-bold text-white leading-tight">
              Helping employers operate with confidence
            </h1>
            <p className="mt-6 text-lg text-ink-300 leading-relaxed max-w-2xl">
              AEA provides HR guidance, compliance tools, risk management support,
              and AI-powered resources for businesses with 2-500 employees across
              all industries.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/membership"
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold text-ink-900 bg-white rounded hover:bg-ink-100 transition-colors"
              >
                Become a Member
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold text-white border border-ink-600 rounded hover:border-ink-400 transition-colors"
              >
                Try AI Tools Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink-900">
              What AEA provides for employers
            </h2>
            <p className="mt-3 text-ink-500 max-w-xl mx-auto">
              Practical tools, guidance, and programs designed specifically for
              businesses with 2-500 employees.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'HR & Compliance',
                desc: 'Stay current with employment law, access policy templates, and get guidance on complex HR situations.',
                href: '/hr-compliance',
              },
              {
                title: 'AI-Powered Tools',
                desc: 'Instant HR advice, compliance checklists, policy reviews, and document generation powered by AI.',
                href: '/tools',
              },
              {
                title: 'Risk Management',
                desc: 'Workers compensation programs, safety resources, and risk management support for employers.',
                href: '/benefits-programs',
              },
              {
                title: 'Cost Savings',
                desc: 'Group purchasing programs for insurance, technology, supplies, and professional services.',
                href: '/programs-savings',
              },
            ].map((pillar) => (
              <Link
                key={pillar.title}
                href={pillar.href}
                className="block border border-ink-100 rounded p-6 hover:border-ink-300 hover:shadow-md transition-all duration-200 group"
              >
                <h3 className="font-serif text-lg font-bold text-ink-900 group-hover:text-brand-red transition-colors">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm text-ink-500 leading-relaxed">
                  {pillar.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tools Highlight */}
      <section className="bg-ink-900 section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-3">
                AI-Powered
              </p>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-white">
                Employer tools that work as hard as you do
              </h2>
              <p className="mt-4 text-ink-400 leading-relaxed">
                AEA&apos;s AI tools give employers instant access to HR guidance,
                compliance analysis, policy reviews, and custom document
                generation. Built specifically for businesses that don&apos;t have
                a full HR department.
              </p>
              <div className="mt-6">
                <Link
                  href="/tools"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-ink-900 bg-white rounded hover:bg-ink-100 transition-colors"
                >
                  Try AI Tools Free
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'HR Advisor', desc: 'Ask any HR question', href: '/tools/advisor' },
                { name: 'Compliance Checker', desc: 'Personalized checklist', href: '/tools/compliance-checker' },
                { name: 'Policy Reviewer', desc: 'Review for legal risks', href: '/tools/policy-reviewer' },
                { name: 'Document Generator', desc: 'Custom employer docs', href: '/tools/document-generator' },
              ].map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className="block bg-ink-800 border border-ink-700 rounded p-5 hover:border-ink-500 transition-colors group"
                >
                  <h3 className="text-sm font-semibold text-white group-hover:text-brand-red-light transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-ink-400 mt-1">{tool.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Join */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink-900">
                Why employers join AEA
              </h2>
              <p className="mt-3 text-ink-500 leading-relaxed">
                Membership delivers immediate, practical value regardless of
                your industry, location, or size.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  'Compliance alerts and regulatory updates',
                  'AI-powered HR advisor and compliance tools',
                  'Policy templates, checklists, and employer guides',
                  'Group purchasing and cost-saving programs',
                  'Benefits and risk management programs',
                  'Peer networking with employers nationwide',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-brand-red mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-ink-700">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/membership" className="btn-primary">
                  Become a Member
                </Link>
              </div>
            </div>
            <div className="bg-ink-50 border border-ink-100 rounded p-8">
              <h3 className="font-serif text-xl font-bold text-ink-900 mb-6">
                Resources for every employer need
              </h3>
              <div className="space-y-5">
                {[
                  { title: 'Resource Library', desc: `${allContent.length}+ articles on HR, compliance, hiring, and operations`, href: '/resources' },
                  { title: 'Employer Tools', desc: 'Calculators, checklists, audit templates, and planning worksheets', href: '/employer-tools' },
                  { title: 'Programs & Savings', desc: 'Group rates on insurance, supplies, technology, and services', href: '/programs-savings' },
                  { title: 'Benefits Programs', desc: 'Health coverage, risk management, and supplemental benefits', href: '/benefits-programs' },
                ].map((item) => (
                  <Link key={item.title} href={item.href} className="block group">
                    <h4 className="font-semibold text-ink-900 group-hover:text-brand-red transition-colors text-sm">
                      {item.title}
                    </h4>
                    <p className="text-xs text-ink-500 mt-0.5">{item.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Articles */}
      <section className="border-t border-ink-100 section-padding">
        <div className="container-wide">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl font-bold text-ink-900">
              Latest from AEA
            </h2>
            <Link href="/resources" className="text-sm font-semibold text-brand-red hover:text-brand-red-dark">
              View all articles &rarr;
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recent.map((article) => (
              <Link
                key={article.slug}
                href={`/resources/${article.slug}`}
                className="block group"
              >
                <p className="category-tag text-[10px] mb-1.5">{article.category}</p>
                <h3 className="font-serif text-base font-bold text-ink-900 group-hover:text-brand-red transition-colors leading-snug">
                  {article.title}
                </h3>
                <p className="text-sm text-ink-500 mt-2 line-clamp-2 leading-relaxed">
                  {article.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-ink-50 border-t border-ink-100">
        <div className="container-wide py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-serif font-bold text-ink-900">2013</p>
              <p className="text-xs text-ink-500 mt-1 uppercase tracking-wide">Established</p>
            </div>
            <div>
              <p className="text-3xl font-serif font-bold text-ink-900">50</p>
              <p className="text-xs text-ink-500 mt-1 uppercase tracking-wide">States Served</p>
            </div>
            <div>
              <p className="text-3xl font-serif font-bold text-ink-900">2-500</p>
              <p className="text-xs text-ink-500 mt-1 uppercase tracking-wide">Employees Per Member</p>
            </div>
            <div>
              <p className="text-3xl font-serif font-bold text-ink-900">All</p>
              <p className="text-xs text-ink-500 mt-1 uppercase tracking-wide">Industries Served</p>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
