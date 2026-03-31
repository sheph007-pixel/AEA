'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia',
  'Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland',
  'Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey',
  'New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina',
  'South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming',
];

const ISSUE_TYPES = [
  'Attendance', 'Performance', 'Misconduct', 'Harassment complaint', 'Termination',
  'Wage/hour concern', 'Leave/accommodation', 'Policy violation', 'Discrimination concern',
  'Reduction in force', 'Other',
];

interface RiskAnalysis {
  risk_level: string;
  summary: string;
  concerns: string[];
  next_steps: string[];
  avoid: string[];
  documentation_checklist: string[];
  suggested_document_type: string | null;
  suggested_document_title: string | null;
  disclaimer: string;
}

interface MemberInfo {
  id: number;
  name: string;
  company: string | null;
}

export default function RiskRadarPage() {
  const [member, setMember] = useState<MemberInfo | null>(null);
  const [form, setForm] = useState({ state: '', companySize: '', issueType: '', situation: '', facts: '' });
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<RiskAnalysis | null>(null);
  const [caseId, setCaseId] = useState<number | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [error, setError] = useState('');
  const [demoLimited, setDemoLimited] = useState(false);
  const [genDoc, setGenDoc] = useState('');
  const [genDocType, setGenDocType] = useState('');
  const [genLoading, setGenLoading] = useState(false);

  useEffect(() => {
    fetch('/api/auth/session').then((r) => r.json()).then((d) => {
      if (d.authenticated) {
        setMember(d.member);
        setIsMember(true);
      }
    }).catch(() => {});
  }, []);

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAnalysis(null);
    setGenDoc('');
    setDemoLimited(false);

    try {
      const res = await fetch('/api/risk-radar/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.status === 403 && data.error === 'demo_limit') {
        setDemoLimited(true);
      } else if (res.ok) {
        setAnalysis(data.analysis);
        setCaseId(data.caseId);
        setIsMember(data.isMember);
      } else {
        setError(data.error || 'Analysis failed.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  }

  async function handleGenerateDoc(docType: string) {
    setGenLoading(true);
    setGenDocType(docType);
    try {
      const res = await fetch('/api/risk-radar/document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId, documentType: docType }),
      });
      const data = await res.json();
      if (res.ok) {
        setGenDoc(data.document);
      } else {
        setError(data.error || 'Document generation failed.');
      }
    } catch {
      setError('Document generation failed.');
    }
    setGenLoading(false);
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setMember(null);
    setIsMember(false);
  }

  const riskColor = analysis?.risk_level === 'High' ? 'bg-red-600' : analysis?.risk_level === 'Medium' ? 'bg-amber-500' : 'bg-green-600';

  return (
    <>
      {/* Header */}
      <section className="border-b border-ink-100">
        <div className="container-wide py-10">
          <div className="flex items-start justify-between">
            <div>
              <Link href="/tools" className="category-tag hover:text-brand-red-dark transition-colors">
                AI Tools
              </Link>
              <h1 className="font-serif text-3xl md:text-4.5xl font-bold text-ink-900 mt-2">
                AEA Risk Radar
              </h1>
              <p className="mt-3 text-ink-500 max-w-2xl">
                AI-powered HR risk guidance for employers. Describe a situation and receive a risk assessment, recommended next steps, and suggested documentation.
              </p>
            </div>
            <div className="hidden md:block text-right">
              {member ? (
                <div>
                  <p className="text-sm text-ink-700 font-medium">{member.name}</p>
                  <p className="text-xs text-ink-400">{member.company}</p>
                  <div className="flex gap-3 mt-2">
                    <Link href="/tools/risk-radar/cases" className="text-xs text-brand-red hover:text-brand-red-dark">
                      Case History
                    </Link>
                    <button onClick={handleLogout} className="text-xs text-ink-400 hover:text-ink-600">
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/member-login" className="text-sm font-semibold text-brand-red hover:text-brand-red-dark">
                  Member Login &rarr;
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="container-wide py-2.5">
          <p className="text-xs text-amber-800">
            <strong>Disclaimer:</strong> AEA Risk Radar provides general HR and workplace guidance for employers. It is not legal advice and does not create an attorney-client relationship. Consult qualified legal counsel for legal advice on specific situations.
          </p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-wide">
          {/* Demo limit reached */}
          {demoLimited && (
            <div className="max-w-2xl mx-auto text-center py-12">
              <div className="bg-ink-50 border border-ink-100 rounded p-8">
                <h2 className="font-serif text-xl font-bold text-ink-900 mb-3">Daily demo limit reached</h2>
                <p className="text-ink-500 mb-6">
                  Become an AEA member to unlock full Risk Radar access, saved case files, downloadable HR documents, and additional employer tools.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/member-login" className="btn-primary">Enter Member Code</Link>
                  <Link href="/membership" className="btn-secondary">Learn About Membership</Link>
                </div>
              </div>
            </div>
          )}

          {/* Main content */}
          {!demoLimited && (
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Input Form */}
              <div className="lg:col-span-2">
                <h2 className="text-sm font-bold uppercase tracking-widest text-ink-400 mb-4">
                  Describe the Situation
                </h2>
                <form onSubmit={handleAnalyze} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-1">State</label>
                    <select required value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-ink-200 rounded text-sm outline-none focus:ring-1 focus:ring-ink-500 bg-white">
                      <option value="">Select state</option>
                      {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-1">Company Size</label>
                    <select required value={form.companySize} onChange={(e) => setForm((f) => ({ ...f, companySize: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-ink-200 rounded text-sm outline-none focus:ring-1 focus:ring-ink-500 bg-white">
                      <option value="">Select range</option>
                      <option value="2-10">2-10</option>
                      <option value="11-25">11-25</option>
                      <option value="26-50">26-50</option>
                      <option value="51-100">51-100</option>
                      <option value="101-250">101-250</option>
                      <option value="251-500">251-500</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-1">Issue Type</label>
                    <select required value={form.issueType} onChange={(e) => setForm((f) => ({ ...f, issueType: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-ink-200 rounded text-sm outline-none focus:ring-1 focus:ring-ink-500 bg-white">
                      <option value="">Select type</option>
                      {ISSUE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-1">Situation Summary</label>
                    <textarea required rows={5} value={form.situation} onChange={(e) => setForm((f) => ({ ...f, situation: e.target.value }))}
                      placeholder="Describe the employee situation in detail..."
                      className="w-full px-3 py-2.5 border border-ink-200 rounded text-sm outline-none focus:ring-1 focus:ring-ink-500 resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-1">Additional Facts (optional)</label>
                    <textarea rows={3} value={form.facts} onChange={(e) => setForm((f) => ({ ...f, facts: e.target.value }))}
                      placeholder="Prior warnings, tenure, protected class considerations, recent complaints, etc."
                      className="w-full px-3 py-2.5 border border-ink-200 rounded text-sm outline-none focus:ring-1 focus:ring-ink-500 resize-none" />
                  </div>
                  <button type="submit" disabled={loading} className="btn-brand w-full disabled:opacity-50">
                    {loading ? 'Analyzing...' : 'Analyze Risk'}
                  </button>
                  {!isMember && (
                    <p className="text-xs text-ink-400 text-center">
                      Free demo - 2 analyses per day.{' '}
                      <Link href="/member-login" className="text-brand-red hover:underline">Member login</Link>
                      {' '}for unlimited access.
                    </p>
                  )}
                </form>
                {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
              </div>

              {/* Results */}
              <div className="lg:col-span-3">
                {loading && (
                  <div className="bg-ink-50 border border-ink-100 rounded p-12 text-center">
                    <p className="text-ink-500 font-medium">Analyzing your situation...</p>
                    <p className="text-xs text-ink-400 mt-2">This may take a few seconds.</p>
                  </div>
                )}

                {analysis && !loading && (
                  <div className="space-y-6">
                    {/* Risk Level */}
                    <div className="flex items-center gap-4">
                      <span className={`${riskColor} text-white text-sm font-bold px-4 py-2 rounded`}>
                        {analysis.risk_level} Risk
                      </span>
                      <p className="text-ink-700 text-sm leading-relaxed flex-1">{analysis.summary}</p>
                    </div>

                    {/* Concerns */}
                    {analysis.concerns.length > 0 && (
                      <div className="border border-ink-100 rounded p-5">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-ink-400 mb-3">Why This Could Be Risky</h3>
                        <ul className="space-y-2">
                          {analysis.concerns.map((c, i) => (
                            <li key={i} className="flex gap-2 text-sm text-ink-700">
                              <span className="text-red-500 mt-0.5 shrink-0">&#9679;</span>
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Next Steps */}
                    {analysis.next_steps.length > 0 && (
                      <div className="border border-ink-100 rounded p-5">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-ink-400 mb-3">Recommended Next Steps</h3>
                        <ol className="space-y-2 list-decimal list-inside">
                          {analysis.next_steps.map((s, i) => (
                            <li key={i} className="text-sm text-ink-700">{s}</li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* What to Avoid */}
                    {analysis.avoid.length > 0 && (
                      <div className="border border-red-200 bg-red-50 rounded p-5">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-red-700 mb-3">What To Avoid</h3>
                        <ul className="space-y-2">
                          {analysis.avoid.map((a, i) => (
                            <li key={i} className="flex gap-2 text-sm text-red-800">
                              <span className="shrink-0">&#10005;</span>
                              {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Documentation Checklist (members only) */}
                    {isMember && analysis.documentation_checklist.length > 0 && (
                      <div className="border border-ink-100 rounded p-5">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-ink-400 mb-3">Documentation Checklist</h3>
                        <ul className="space-y-2">
                          {analysis.documentation_checklist.map((d, i) => (
                            <li key={i} className="flex gap-2 text-sm text-ink-700">
                              <span className="text-ink-300 shrink-0">&#9744;</span>
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Document Generation (members only) */}
                    {isMember && analysis.suggested_document_type && (
                      <div className="border-2 border-ink-900 rounded p-5">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-ink-400 mb-2">Generate HR Document</h3>
                        <p className="text-sm text-ink-500 mb-4">
                          Based on this analysis, we recommend generating a <strong>{analysis.suggested_document_type}</strong>.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {['Written Warning', 'Termination Letter', 'PIP', 'Documentation Memo'].map((dt) => (
                            <button
                              key={dt}
                              onClick={() => handleGenerateDoc(dt)}
                              disabled={genLoading}
                              className={`text-xs px-3 py-2 rounded border transition-colors disabled:opacity-50 ${
                                dt === analysis.suggested_document_type
                                  ? 'bg-ink-900 text-white border-ink-900'
                                  : 'border-ink-200 text-ink-700 hover:border-ink-400'
                              }`}
                            >
                              {genLoading && genDocType === dt ? 'Generating...' : dt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Non-member upsell */}
                    {!isMember && (
                      <div className="bg-ink-900 rounded p-6 text-center">
                        <h3 className="font-serif text-lg font-bold text-white mb-2">
                          Unlock full Risk Radar access
                        </h3>
                        <p className="text-sm text-ink-400 mb-4 max-w-md mx-auto">
                          Become an AEA member to unlock full analysis details, documentation checklists, HR document generation, and saved case history.
                        </p>
                        <div className="flex gap-3 justify-center">
                          <Link href="/member-login" className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-ink-900 bg-white rounded hover:bg-ink-100 transition-colors">
                            Enter Member Code
                          </Link>
                          <Link href="/membership" className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white border border-ink-600 rounded hover:border-ink-400 transition-colors">
                            Learn More
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Generated Document */}
                    {genDoc && (
                      <div className="border border-ink-200 rounded p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-bold uppercase tracking-widest text-ink-400">{genDocType}</h3>
                          <button
                            onClick={() => navigator.clipboard.writeText(genDoc)}
                            className="text-xs font-semibold text-brand-red hover:text-brand-red-dark"
                          >
                            Copy to clipboard
                          </button>
                        </div>
                        <div className="text-sm text-ink-700 whitespace-pre-wrap leading-relaxed font-mono bg-ink-50 p-4 rounded max-h-[500px] overflow-y-auto">
                          {genDoc}
                        </div>
                        <p className="text-xs text-ink-400 mt-4">
                          This document was generated as a template. Review and customize before use. Have legal counsel review before issuing.
                        </p>
                      </div>
                    )}

                    {/* Disclaimer */}
                    <div className="bg-amber-50 border border-amber-200 rounded p-4">
                      <p className="text-xs text-amber-800">{analysis.disclaimer}</p>
                    </div>
                  </div>
                )}

                {/* Empty state */}
                {!analysis && !loading && !demoLimited && (
                  <div className="bg-ink-50 border border-ink-100 rounded p-12 text-center">
                    <h3 className="font-serif text-xl font-bold text-ink-900 mb-2">Your risk assessment</h3>
                    <p className="text-sm text-ink-400 max-w-md mx-auto">
                      Fill in the situation details and click &ldquo;Analyze Risk&rdquo; to receive an AI-powered assessment with risk level, concerns, next steps, and documentation guidance.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
