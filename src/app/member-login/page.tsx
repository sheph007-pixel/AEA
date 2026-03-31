'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MemberLoginPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        window.location.href = '/tools/risk-radar';
      } else {
        setError(data.error || 'Login failed.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  }

  return (
    <>
      <section className="border-b border-ink-100">
        <div className="container-wide py-12 md:py-16">
          <h1 className="font-serif text-3xl md:text-4.5xl font-bold text-ink-900">
            Member Login
          </h1>
          <p className="mt-3 text-ink-500 max-w-xl">
            Enter your AEA member code to unlock members-only employer tools.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide max-w-md">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-ink-700 mb-1.5">
                Member Code
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter your member code"
                required
                autoComplete="off"
                className="w-full px-4 py-3 border border-ink-200 rounded text-center text-lg font-mono tracking-widest focus:ring-1 focus:ring-ink-500 outline-none"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Access Member Tools'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-ink-100 text-center">
            <p className="text-sm text-ink-500 mb-3">
              Not a member yet?
            </p>
            <Link href="/membership" className="text-sm font-semibold text-brand-red hover:text-brand-red-dark">
              Learn about AEA membership &rarr;
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
