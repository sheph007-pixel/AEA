'use client';

import Link from 'next/link';
import { useMember } from '@/components/MemberContext';

const memberTools = [
  {
    title: 'Risk Radar',
    description: 'Assess employment risk before you act. Get AI-powered risk analysis with document generation.',
    href: '/tools/risk-radar',
    badge: 'Unlimited',
  },
  {
    title: 'HR & Compliance Advisor',
    description: 'Ask any HR or compliance question and get instant guidance.',
    href: '/tools/advisor',
    badge: 'Unlimited',
  },
  {
    title: 'Compliance Checker',
    description: 'Get a personalized compliance checklist for your state, size, and industry.',
    href: '/tools/compliance-checker',
    badge: 'Full Access',
  },
  {
    title: 'Policy & Document Reviewer',
    description: 'Paste a policy or job description and get an AI-powered legal risk review.',
    href: '/tools/policy-reviewer',
    badge: 'Full Access',
  },
  {
    title: 'Document Generator',
    description: 'Generate customized employer documents: offer letters, PIPs, warnings, and more.',
    href: '/tools/document-generator',
    badge: 'Full Access',
  },
];

const memberResources = [
  { title: 'Risk Radar Case History', href: '/tools/risk-radar/cases', description: 'View your saved risk assessments and generated documents.' },
  { title: 'Employer Briefings', href: '/briefings', description: 'Monthly briefings, compliance alerts, and trends reports.' },
  { title: 'Employer Outlook', href: '/outlook', description: 'Monthly compliance dashboard and employer trends.' },
  { title: 'Resource Library', href: '/resources', description: 'Articles on HR, compliance, hiring, and operations.' },
  { title: 'Employer News', href: '/news', description: 'Daily news for HR professionals and business owners.' },
  { title: 'Programs & Savings', href: '/programs-savings', description: 'Group purchasing programs for insurance, supplies, and services.' },
];

export default function MemberPortalPage() {
  const { member, isMember, loading, logout } = useMember();

  if (loading) {
    return (
      <section className="section-padding">
        <div className="container-wide text-center py-20">
          <p className="text-ink-400">Loading...</p>
        </div>
      </section>
    );
  }

  if (!isMember) {
    return (
      <section className="section-padding">
        <div className="container-wide max-w-md text-center">
          <h1 className="font-serif text-2xl font-bold text-ink-900 mb-3">Member Portal</h1>
          <p className="text-ink-500 mb-6">Log in with your member code to access your tools and resources.</p>
          <Link href="/member-login" className="btn-primary">Member Login</Link>
          <div className="mt-6">
            <Link href="/membership" className="text-sm text-brand-red hover:text-brand-red-dark">
              Not a member? Learn about AEA membership &rarr;
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="bg-ink-900">
        <div className="container-wide py-10 md:py-14">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-2">
                Member Portal
              </p>
              <h1 className="font-serif text-3xl md:text-4.5xl font-bold text-white">
                Welcome back, {member?.name?.split(' ')[0] || 'Member'}
              </h1>
              {member?.company && (
                <p className="mt-2 text-ink-400">{member.company}</p>
              )}
            </div>
            <button
              onClick={logout}
              className="text-sm text-ink-400 hover:text-white transition-colors hidden md:block"
            >
              Logout
            </button>
          </div>
        </div>
      </section>

      {/* AI Tools */}
      <section className="section-padding">
        <div className="container-wide">
          <h2 className="section-label">Your AI Tools</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {memberTools.map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="block border border-ink-100 rounded p-6 hover:border-ink-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-serif text-lg font-bold text-ink-900 group-hover:text-brand-red transition-colors">
                    {tool.title}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-green-700 bg-green-50 px-2 py-0.5 rounded shrink-0">
                    {tool.badge}
                  </span>
                </div>
                <p className="text-sm text-ink-500 leading-relaxed">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Member Resources */}
      <section className="bg-ink-50 section-padding">
        <div className="container-wide">
          <h2 className="section-label">Member Resources</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {memberResources.map((resource) => (
              <Link
                key={resource.title}
                href={resource.href}
                className="block bg-white border border-ink-100 rounded p-5 hover:border-ink-300 transition-colors group"
              >
                <h3 className="font-semibold text-ink-900 group-hover:text-brand-red transition-colors text-sm">
                  {resource.title}
                </h3>
                <p className="text-xs text-ink-500 mt-1">{resource.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="border-t border-ink-100 section-padding">
        <div className="container-wide">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="text-sm font-semibold text-ink-900 mb-1">Need help?</h3>
              <Link href="/contact" className="text-sm text-brand-red hover:text-brand-red-dark">Contact AEA &rarr;</Link>
            </div>
            <div className="text-center">
              <h3 className="text-sm font-semibold text-ink-900 mb-1">Account issue?</h3>
              <Link href="/contact" className="text-sm text-brand-red hover:text-brand-red-dark">Get support &rarr;</Link>
            </div>
            <div className="text-center">
              <h3 className="text-sm font-semibold text-ink-900 mb-1">Share feedback</h3>
              <Link href="/contact" className="text-sm text-brand-red hover:text-brand-red-dark">Let us know &rarr;</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
