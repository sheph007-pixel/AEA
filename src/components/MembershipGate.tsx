'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMember } from '@/components/MemberContext';

interface MembershipGateProps {
  children: React.ReactNode;
  toolName: string;
}

export default function MembershipGate({ children, toolName }: MembershipGateProps) {
  const { isMember } = useMember();
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', company: '', employees: '' });

  // If logged in as member, always show content
  if (isMember) return <>{children}</>;

  // If submitted the form this session, show content
  if (submitted) return <>{children}</>;

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
    } catch {
      setSubmitted(true);
    }
    setSending(false);
  }

  return (
    <div className="max-w-lg mx-auto text-center py-12">
      <div className="bg-ink-50 border border-ink-100 rounded p-8">
        <h3 className="font-serif text-xl font-bold text-ink-900 mb-2">
          Member access required
        </h3>
        <p className="text-sm text-ink-500 mb-4">
          Log in with your member code, or request membership to access this tool.
        </p>
        <Link href="/member-login" className="btn-primary mb-6 inline-block">
          Member Login
        </Link>
        <div className="border-t border-ink-200 pt-6 mt-2">
          <p className="text-xs text-ink-400 mb-4">Not a member yet? Request access:</p>
          <form onSubmit={handleSubmit} className="space-y-3 text-left">
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="First name" required value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} className="w-full px-3 py-2.5 border border-ink-200 rounded text-sm outline-none focus:ring-1 focus:ring-ink-500" />
              <input type="text" placeholder="Last name" required value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} className="w-full px-3 py-2.5 border border-ink-200 rounded text-sm outline-none focus:ring-1 focus:ring-ink-500" />
            </div>
            <input type="email" placeholder="Work email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2.5 border border-ink-200 rounded text-sm outline-none focus:ring-1 focus:ring-ink-500" />
            <input type="text" placeholder="Organization name" required value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} className="w-full px-3 py-2.5 border border-ink-200 rounded text-sm outline-none focus:ring-1 focus:ring-ink-500" />
            <select required value={form.employees} onChange={(e) => setForm((f) => ({ ...f, employees: e.target.value }))} className="w-full px-3 py-2.5 border border-ink-200 rounded text-sm outline-none focus:ring-1 focus:ring-ink-500 bg-white">
              <option value="">Number of employees</option>
              <option value="1-14">1-14 employees</option>
              <option value="15-19">15-19 employees (Title VII, ADA)</option>
              <option value="20-49">20-49 employees (COBRA, ADEA)</option>
              <option value="50-99">50-99 employees (FMLA, ACA)</option>
              <option value="100-249">100-249 employees (WARN Act)</option>
              <option value="250-500">250-500 employees</option>
            </select>
            <button type="submit" disabled={sending} className="btn-primary w-full disabled:opacity-50">
              {sending ? 'Submitting...' : 'Request Membership'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
