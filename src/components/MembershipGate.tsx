'use client';

import { useState } from 'react';

interface MembershipGateProps {
  children: React.ReactNode;
  toolName: string;
}

export default function MembershipGate({ children, toolName }: MembershipGateProps) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', company: '', employees: '' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      await fetch('/api/membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, industry: '', message: `Membership inquiry from ${toolName} tool` }),
      });
      setSubmitted(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('aea_member_access', 'true');
      }
    } catch {
      setSubmitted(true);
    }
    setSending(false);
  }

  if (submitted || (typeof window !== 'undefined' && localStorage.getItem('aea_member_access'))) {
    return <>{children}</>;
  }

  return (
    <div className="max-w-lg mx-auto text-center py-12">
      <div className="bg-ink-50 border border-ink-100 rounded p-8">
        <h3 className="font-serif text-xl font-bold text-ink-900 mb-2">
          Get full access to AEA AI Tools
        </h3>
        <p className="text-sm text-ink-500 mb-6">
          Complete the form below to unlock unlimited access to all AI-powered employer tools.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3 text-left">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="First name"
              required
              value={form.firstName}
              onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
              className="w-full px-3 py-2.5 border border-ink-200 rounded text-sm outline-none focus:ring-1 focus:ring-ink-500"
            />
            <input
              type="text"
              placeholder="Last name"
              required
              value={form.lastName}
              onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              className="w-full px-3 py-2.5 border border-ink-200 rounded text-sm outline-none focus:ring-1 focus:ring-ink-500"
            />
          </div>
          <input
            type="email"
            placeholder="Work email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full px-3 py-2.5 border border-ink-200 rounded text-sm outline-none focus:ring-1 focus:ring-ink-500"
          />
          <input
            type="text"
            placeholder="Organization name"
            required
            value={form.company}
            onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
            className="w-full px-3 py-2.5 border border-ink-200 rounded text-sm outline-none focus:ring-1 focus:ring-ink-500"
          />
          <select
            required
            value={form.employees}
            onChange={(e) => setForm((f) => ({ ...f, employees: e.target.value }))}
            className="w-full px-3 py-2.5 border border-ink-200 rounded text-sm outline-none focus:ring-1 focus:ring-ink-500 bg-white"
          >
            <option value="">Number of employees</option>
            <option value="2-10">2-10</option>
            <option value="11-25">11-25</option>
            <option value="26-50">26-50</option>
            <option value="51-100">51-100</option>
            <option value="101-250">101-250</option>
            <option value="251-500">251-500</option>
          </select>
          <button type="submit" disabled={sending} className="btn-primary w-full disabled:opacity-50">
            {sending ? 'Submitting...' : 'Get Full Access'}
          </button>
        </form>
      </div>
    </div>
  );
}
