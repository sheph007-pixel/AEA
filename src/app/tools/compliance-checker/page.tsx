'use client';

import { useState } from 'react';
import Link from 'next/link';

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia',
  'Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland',
  'Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey',
  'New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina',
  'South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming',
];

export default function ComplianceCheckerPage() {
  const [form, setForm] = useState({ state: '', employeeCount: '', industry: '' });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/ai/compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setResult(data.checklist || data.error);
    } catch {
      setResult('Something went wrong. Please try again.');
    }
    setLoading(false);
  }

  return (
    <>
      <section className="border-b border-ink-100">
        <div className="container-wide py-10">
          <Link href="/tools" className="category-tag hover:text-brand-red-dark transition-colors">
            AI Tools
          </Link>
          <h1 className="font-serif text-3xl md:text-4.5xl font-bold text-ink-900 mt-2">
            Compliance Checker
          </h1>
          <p className="mt-3 text-ink-500 max-w-2xl">
            Get a personalized compliance checklist based on your state, employee count, and industry.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Form */}
            <div className="md:col-span-1">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1.5">State</label>
                  <select
                    required
                    value={form.state}
                    onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-ink-200 rounded text-sm outline-none focus:ring-1 focus:ring-ink-500 bg-white"
                  >
                    <option value="">Select state</option>
                    {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1.5">Employees</label>
                  <select
                    required
                    value={form.employeeCount}
                    onChange={(e) => setForm((f) => ({ ...f, employeeCount: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-ink-200 rounded text-sm outline-none focus:ring-1 focus:ring-ink-500 bg-white"
                  >
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
                  <label className="block text-sm font-medium text-ink-700 mb-1.5">Industry</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Manufacturing, Healthcare, Retail"
                    value={form.industry}
                    onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-ink-200 rounded text-sm outline-none focus:ring-1 focus:ring-ink-500"
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                  {loading ? 'Generating...' : 'Generate Checklist'}
                </button>
              </form>
              <p className="text-xs text-ink-400 mt-3">
                AI-generated checklist. Always verify with legal counsel.
              </p>
            </div>

            {/* Results */}
            <div className="md:col-span-2">
              {loading && (
                <div className="bg-ink-50 border border-ink-100 rounded p-8 text-center">
                  <p className="text-ink-500">Analyzing compliance requirements...</p>
                </div>
              )}
              {result && !loading && (
                <div className="bg-white border border-ink-100 rounded p-6">
                  <div className="prose-content text-sm whitespace-pre-wrap">{result}</div>
                </div>
              )}
              {!result && !loading && (
                <div className="bg-ink-50 border border-ink-100 rounded p-8 text-center">
                  <p className="font-serif text-lg font-bold text-ink-900 mb-2">Your compliance checklist</p>
                  <p className="text-sm text-ink-400">
                    Select your state, employee count, and industry to generate a personalized compliance checklist covering federal, state, and industry-specific requirements.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
