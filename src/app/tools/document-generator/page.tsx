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

export default function DocumentGeneratorPage() {
  const [form, setForm] = useState({ docType: '', state: '', companyName: '', details: '' });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setResult(data.document || data.error);
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
            Document Generator
          </h1>
          <p className="mt-3 text-ink-500 max-w-2xl">
            Generate customized employer documents with state-specific language, proper disclaimers, and professional formatting.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide max-w-5xl">
          <div className="grid md:grid-cols-5 gap-8">
            {/* Form */}
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1.5">Document type</label>
                  <select
                    required
                    value={form.docType}
                    onChange={(e) => setForm((f) => ({ ...f, docType: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-ink-200 rounded text-sm outline-none focus:ring-1 focus:ring-ink-500 bg-white"
                  >
                    <option value="">Select type</option>
                    <option value="Offer Letter">Offer Letter</option>
                    <option value="Job Description">Job Description</option>
                    <option value="Employee Handbook Section - PTO Policy">PTO Policy</option>
                    <option value="Employee Handbook Section - Anti-Harassment Policy">Anti-Harassment Policy</option>
                    <option value="Employee Handbook Section - Remote Work Policy">Remote Work Policy</option>
                    <option value="Performance Improvement Plan">Performance Improvement Plan (PIP)</option>
                    <option value="Termination Letter">Termination Letter</option>
                    <option value="Written Warning">Written Warning</option>
                    <option value="Employee Confidentiality Agreement">Confidentiality Agreement</option>
                  </select>
                </div>
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
                  <label className="block text-sm font-medium text-ink-700 mb-1.5">Company name</label>
                  <input
                    type="text"
                    value={form.companyName}
                    onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
                    placeholder="Your Company, Inc."
                    className="w-full px-3 py-2.5 border border-ink-200 rounded text-sm outline-none focus:ring-1 focus:ring-ink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1.5">Additional details</label>
                  <textarea
                    rows={4}
                    value={form.details}
                    onChange={(e) => setForm((f) => ({ ...f, details: e.target.value }))}
                    placeholder="Position title, salary, specific requirements, etc."
                    className="w-full px-3 py-2.5 border border-ink-200 rounded text-sm outline-none focus:ring-1 focus:ring-ink-500 resize-none"
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                  {loading ? 'Generating...' : 'Generate Document'}
                </button>
              </form>
              <p className="text-xs text-ink-400 mt-3">
                AI-generated template. Review and customize before use. Consult legal counsel.
              </p>
            </div>

            {/* Results */}
            <div className="md:col-span-3">
              {loading && (
                <div className="bg-ink-50 border border-ink-100 rounded p-8 text-center">
                  <p className="text-ink-500">Generating your document...</p>
                </div>
              )}
              {result && !loading && (
                <div className="bg-white border border-ink-100 rounded p-6 max-h-[700px] overflow-y-auto">
                  <div className="text-sm text-ink-700 whitespace-pre-wrap leading-relaxed font-mono">{result}</div>
                  <div className="mt-6 pt-4 border-t border-ink-100">
                    <button
                      onClick={() => navigator.clipboard.writeText(result)}
                      className="text-sm font-semibold text-brand-red hover:text-brand-red-dark"
                    >
                      Copy to clipboard
                    </button>
                  </div>
                </div>
              )}
              {!result && !loading && (
                <div className="bg-ink-50 border border-ink-100 rounded p-8 text-center">
                  <p className="font-serif text-lg font-bold text-ink-900 mb-2">Your generated document</p>
                  <p className="text-sm text-ink-400 max-w-sm mx-auto">
                    Select a document type, enter your details, and get a professionally formatted, state-specific employer document.
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
