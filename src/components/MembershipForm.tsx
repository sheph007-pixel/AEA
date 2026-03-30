'use client';

import { useState, FormEvent } from 'react';

export default function MembershipForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');

    const form = e.currentTarget;
    const data = {
      firstName: (form.elements.namedItem('firstName') as HTMLInputElement).value,
      lastName: (form.elements.namedItem('lastName') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      company: (form.elements.namedItem('company') as HTMLInputElement).value,
      employees: (form.elements.namedItem('employees') as HTMLSelectElement).value,
      industry: (form.elements.namedItem('industry') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch('/api/membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus('sent');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <h3 className="text-lg font-semibold text-ink-900 mb-2">Inquiry received</h3>
        <p className="text-ink-500">
          Thank you for your interest in AEA. We will be in touch within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="mem-firstName" className="block text-sm font-medium text-ink-700 mb-1.5">
            First name
          </label>
          <input
            type="text"
            id="mem-firstName"
            name="firstName"
            required
            className="w-full px-4 py-2.5 border border-ink-200 rounded-lg text-sm focus:ring-1 focus:ring-ink-500 focus:border-ink-500 outline-none transition-colors"
          />
        </div>
        <div>
          <label htmlFor="mem-lastName" className="block text-sm font-medium text-ink-700 mb-1.5">
            Last name
          </label>
          <input
            type="text"
            id="mem-lastName"
            name="lastName"
            required
            className="w-full px-4 py-2.5 border border-ink-200 rounded-lg text-sm focus:ring-1 focus:ring-ink-500 focus:border-ink-500 outline-none transition-colors"
          />
        </div>
      </div>
      <div>
        <label htmlFor="mem-email" className="block text-sm font-medium text-ink-700 mb-1.5">
          Email
        </label>
        <input
          type="email"
          id="mem-email"
          name="email"
          required
          className="w-full px-4 py-2.5 border border-ink-200 rounded-lg text-sm focus:ring-1 focus:ring-ink-500 focus:border-ink-500 outline-none transition-colors"
        />
      </div>
      <div>
        <label htmlFor="mem-company" className="block text-sm font-medium text-ink-700 mb-1.5">
          Organization name
        </label>
        <input
          type="text"
          id="mem-company"
          name="company"
          required
          className="w-full px-4 py-2.5 border border-ink-200 rounded-lg text-sm focus:ring-1 focus:ring-ink-500 focus:border-ink-500 outline-none transition-colors"
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="mem-employees" className="block text-sm font-medium text-ink-700 mb-1.5">
            Number of employees
          </label>
          <select
            id="mem-employees"
            name="employees"
            required
            className="w-full px-4 py-2.5 border border-ink-200 rounded-lg text-sm focus:ring-1 focus:ring-ink-500 focus:border-ink-500 outline-none transition-colors bg-white"
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
          <label htmlFor="mem-industry" className="block text-sm font-medium text-ink-700 mb-1.5">
            Industry
          </label>
          <input
            type="text"
            id="mem-industry"
            name="industry"
            className="w-full px-4 py-2.5 border border-ink-200 rounded-lg text-sm focus:ring-1 focus:ring-ink-500 focus:border-ink-500 outline-none transition-colors"
          />
        </div>
      </div>
      <div>
        <label htmlFor="mem-message" className="block text-sm font-medium text-ink-700 mb-1.5">
          Tell us about your organization (optional)
        </label>
        <textarea
          id="mem-message"
          name="message"
          rows={3}
          className="w-full px-4 py-2.5 border border-ink-200 rounded-lg text-sm focus:ring-1 focus:ring-ink-500 focus:border-ink-500 outline-none transition-colors resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-primary w-full sm:w-auto disabled:opacity-50"
      >
        {status === 'sending' ? 'Submitting...' : 'Request Membership Information'}
      </button>
      {status === 'error' && (
        <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
