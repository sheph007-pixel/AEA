import { Metadata } from 'next';
import Link from 'next/link';
import {
  getLatestMonthlyBriefing,
  getBriefingsByType,
  getTypeLabel,
  getLatestBriefings,
} from '@/lib/briefings';
import CTASection from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'Employer Outlook Dashboard',
  description:
    'A monthly snapshot of compliance priorities, employer trends, and risk areas for businesses with 2-500 employees.',
};

export default function OutlookPage() {
  const latestBriefing = getLatestMonthlyBriefing();
  const complianceAlerts = getBriefingsByType('compliance-alert').slice(0, 3);
  const trendsReports = getBriefingsByType('trends-report').slice(0, 3);
  const industrySnapshots = getBriefingsByType('industry-snapshot').slice(0, 3);
  const employerQuestions = getBriefingsByType('employer-questions').slice(0, 3);
  const recent = getLatestBriefings(5);

  const currentMonth = latestBriefing?.month || new Date().toISOString().substring(0, 7);
  const monthLabel = new Date(currentMonth + '-01').toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      {/* Header */}
      <section className="bg-ink-900">
        <div className="container-wide py-12 md:py-16">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-3">
            Employer Outlook
          </p>
          <h1 className="font-serif text-3xl md:text-4.5xl font-bold text-white leading-tight">
            Employer Outlook Dashboard
          </h1>
          <p className="mt-4 text-ink-400 max-w-2xl leading-relaxed">
            A monthly snapshot of compliance priorities, employer trends, and risk
            areas prepared by the AEA Editorial Team for employers with 2-500 employees.
          </p>
          <p className="mt-4 text-xs text-ink-500">
            Current period: {monthLabel}
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main column */}
            <div className="lg:col-span-2 space-y-10">
              {/* Current Briefing Summary */}
              {latestBriefing && (
                <div>
                  <h2 className="section-label">Current Month Overview</h2>
                  <Link
                    href={`/briefings/${latestBriefing.slug}`}
                    className="block group"
                  >
                    <h3 className="font-serif text-xl font-bold text-ink-900 group-hover:text-brand-red transition-colors">
                      {latestBriefing.title}
                    </h3>
                    <p className="text-ink-500 mt-2 leading-relaxed">
                      {latestBriefing.description}
                    </p>
                    <span className="text-sm font-semibold text-brand-red mt-3 inline-block">
                      Read full briefing &rarr;
                    </span>
                  </Link>
                </div>
              )}

              {/* Compliance Alerts */}
              {complianceAlerts.length > 0 && (
                <div>
                  <h2 className="section-label">Active Compliance Alerts</h2>
                  <div className="space-y-4">
                    {complianceAlerts.map((alert) => (
                      <Link
                        key={alert.slug}
                        href={`/briefings/${alert.slug}`}
                        className="block border-l-4 border-brand-red pl-4 py-2 group"
                      >
                        <h3 className="text-sm font-semibold text-ink-900 group-hover:text-brand-red transition-colors">
                          {alert.title}
                        </h3>
                        <p className="text-xs text-ink-500 mt-1">
                          {alert.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Trends */}
              {trendsReports.length > 0 && (
                <div>
                  <h2 className="section-label">Employer Trends</h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {trendsReports.map((report) => (
                      <Link
                        key={report.slug}
                        href={`/briefings/${report.slug}`}
                        className="block group"
                      >
                        <h3 className="text-sm font-semibold text-ink-900 group-hover:text-brand-red transition-colors">
                          {report.title}
                        </h3>
                        <p className="text-xs text-ink-500 mt-1 line-clamp-2">
                          {report.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Industry Snapshots */}
              {industrySnapshots.length > 0 && (
                <div>
                  <h2 className="section-label">Industry Snapshots</h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {industrySnapshots.map((snapshot) => (
                      <Link
                        key={snapshot.slug}
                        href={`/briefings/${snapshot.slug}`}
                        className="block border border-ink-100 rounded p-4 group hover:border-ink-300 transition-colors"
                      >
                        <h3 className="text-sm font-semibold text-ink-900 group-hover:text-brand-red transition-colors">
                          {snapshot.title}
                        </h3>
                        <p className="text-xs text-ink-500 mt-1 line-clamp-2">
                          {snapshot.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* What Employers Are Asking */}
              {employerQuestions.length > 0 && (
                <div>
                  <h3 className="section-label">What Employers Are Asking</h3>
                  <div className="space-y-3">
                    {employerQuestions.map((q) => (
                      <Link
                        key={q.slug}
                        href={`/briefings/${q.slug}`}
                        className="block group"
                      >
                        <h4 className="text-sm font-semibold text-ink-900 group-hover:text-brand-red transition-colors leading-snug">
                          {q.title}
                        </h4>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Briefings */}
              <div>
                <h3 className="section-label">Recent Briefings</h3>
                <div className="space-y-3">
                  {recent.map((b) => (
                    <Link
                      key={b.slug}
                      href={`/briefings/${b.slug}`}
                      className="block group"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-widest text-ink-400">
                        {getTypeLabel(b.type)}
                      </p>
                      <h4 className="text-sm font-semibold text-ink-900 group-hover:text-brand-red transition-colors leading-snug">
                        {b.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-ink-900 rounded p-6">
                <h3 className="font-semibold text-white mb-2">
                  Get the full picture
                </h3>
                <p className="text-sm text-ink-400 leading-relaxed mb-4">
                  AEA members receive monthly briefings, compliance alerts, and
                  employer trend analysis delivered directly.
                </p>
                <Link
                  href="/membership"
                  className="inline-flex items-center text-sm font-semibold text-white hover:text-brand-red-light transition-colors"
                >
                  Become a Member &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-ink-50 border-t border-ink-100">
        <div className="container-wide py-6">
          <p className="text-xs text-ink-400 italic max-w-3xl">
            The Employer Outlook Dashboard is prepared by the AEA Editorial Team
            based on publicly available regulatory guidance, employment law
            developments, and general employer-reported trends. Individual member
            data is never disclosed. All analysis reflects general observations
            and should not be treated as legal advice.
          </p>
        </div>
      </section>

      <CTASection />
    </>
  );
}
