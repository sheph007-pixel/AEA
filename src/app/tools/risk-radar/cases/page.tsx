'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface RiskCase {
  id: number;
  state: string;
  company_size: string;
  issue_type: string;
  situation: string;
  risk_analysis: { risk_level: string; summary: string };
  created_at: string;
}

export default function CaseHistoryPage() {
  const [cases, setCases] = useState<RiskCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(true);

  useEffect(() => {
    fetch('/api/risk-radar/cases')
      .then((r) => {
        if (r.status === 401) { setAuthed(false); setLoading(false); return null; }
        return r.json();
      })
      .then((data) => {
        if (data) { setCases(data.cases || []); setLoading(false); }
      })
      .catch(() => setLoading(false));
  }, []);

  if (!authed) {
    return (
      <section className="section-padding">
        <div className="container-wide max-w-md text-center">
          <h1 className="font-serif text-2xl font-bold text-ink-900 mb-3">Member Access Required</h1>
          <p className="text-ink-500 mb-6">Log in with your member code to view your case history.</p>
          <Link href="/member-login" className="btn-primary">Member Login</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="border-b border-ink-100">
        <div className="container-wide py-10">
          <Link href="/tools/risk-radar" className="category-tag hover:text-brand-red-dark transition-colors">
            Risk Radar
          </Link>
          <h1 className="font-serif text-3xl font-bold text-ink-900 mt-2">Case History</h1>
          <p className="mt-2 text-ink-500">Your saved risk assessments and analyses.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          {loading ? (
            <p className="text-ink-400">Loading cases...</p>
          ) : cases.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-ink-400 mb-4">No cases yet.</p>
              <Link href="/tools/risk-radar" className="btn-primary">Run Your First Analysis</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cases.map((c) => {
                const riskColor = c.risk_analysis?.risk_level === 'High' ? 'bg-red-600' : c.risk_analysis?.risk_level === 'Medium' ? 'bg-amber-500' : 'bg-green-600';
                return (
                  <div key={c.id} className="border border-ink-100 rounded p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`${riskColor} text-white text-xs font-bold px-2.5 py-1 rounded`}>
                            {c.risk_analysis?.risk_level || 'N/A'}
                          </span>
                          <span className="text-xs text-ink-400">{c.issue_type}</span>
                          <span className="text-xs text-ink-300">{c.state}</span>
                          <span className="text-xs text-ink-300">{c.company_size} employees</span>
                        </div>
                        <p className="text-sm text-ink-700 leading-relaxed">
                          {c.risk_analysis?.summary || c.situation.substring(0, 200)}
                        </p>
                      </div>
                      <span className="text-xs text-ink-400 shrink-0">
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
