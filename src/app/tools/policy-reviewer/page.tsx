'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PolicyReviewerPage() {
  const [documentType, setDocumentType] = useState('');
  const [document, setDocument] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/ai/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document, documentType }),
      });
      const data = await res.json();
      setResult(data.review || data.error);
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
            Policy & Document Reviewer
          </h1>
          <p className="mt-3 text-ink-500 max-w-2xl">
            Paste a job description, policy, or handbook section and get an AI-powered review for legal risks, missing language, and compliance issues.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Input */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1.5">Document type</label>
                  <select
                    required
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full px-3 py-2.5 border border-ink-200 rounded text-sm outline-none focus:ring-1 focus:ring-ink-500 bg-white"
                  >
                    <option value="">Select type</option>
                    <option value="Job Description">Job Description</option>
                    <option value="Employee Handbook Section">Employee Handbook Section</option>
                    <option value="Company Policy">Company Policy</option>
                    <option value="Offer Letter">Offer Letter</option>
                    <option value="Termination Letter">Termination Letter</option>
                    <option value="Performance Improvement Plan">Performance Improvement Plan</option>
                    <option value="Other HR Document">Other HR Document</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1.5">Paste your document</label>
                  <textarea
                    required
                    rows={12}
                    value={document}
                    onChange={(e) => setDocument(e.target.value)}
                    placeholder="Paste the full text of your document here..."
                    className="w-full px-3 py-2.5 border border-ink-200 rounded text-sm outline-none focus:ring-1 focus:ring-ink-500 resize-none font-mono"
                  />
                </div>
                <button type="submit" disabled={loading || !document.trim()} className="btn-primary w-full disabled:opacity-50">
                  {loading ? 'Reviewing...' : 'Review Document'}
                </button>
              </form>
              <p className="text-xs text-ink-400 mt-3">
                Your document is analyzed by AI and not stored permanently. Always consult legal counsel.
              </p>
            </div>

            {/* Results */}
            <div>
              {loading && (
                <div className="bg-ink-50 border border-ink-100 rounded p-8 text-center">
                  <p className="text-ink-500">Reviewing your document...</p>
                </div>
              )}
              {result && !loading && (
                <div className="bg-white border border-ink-100 rounded p-6 max-h-[600px] overflow-y-auto">
                  <div className="text-sm text-ink-700 whitespace-pre-wrap leading-relaxed">{result}</div>
                </div>
              )}
              {!result && !loading && (
                <div className="bg-ink-50 border border-ink-100 rounded p-8 text-center">
                  <p className="font-serif text-lg font-bold text-ink-900 mb-2">AI Review Results</p>
                  <p className="text-sm text-ink-400">
                    Select a document type, paste your text, and get a review covering legal compliance risks, missing language, and recommendations.
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
