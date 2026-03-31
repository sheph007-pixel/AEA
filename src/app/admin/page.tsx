'use client';

import { useState, useEffect, useCallback } from 'react';

interface Member {
  id: number;
  name: string;
  company: string | null;
  email: string | null;
  status: string;
  expires_at: string | null;
  last_used_at: string | null;
  created_at: string;
}

interface Stats {
  totalCases: number;
  memberCases: number;
  demoCases: number;
  issueTypes: { issue_type: string; count: string }[];
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [secret, setSecret] = useState('');
  const [loginError, setLoginError] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [newCode, setNewCode] = useState('');
  const [form, setForm] = useState({ name: '', company: '', email: '', expiresAt: '' });
  const [creating, setCreating] = useState(false);

  const loadData = useCallback(async () => {
    const [mRes, sRes] = await Promise.all([
      fetch('/api/admin/members'),
      fetch('/api/admin/stats'),
    ]);
    if (mRes.ok) {
      const mData = await mRes.json();
      setMembers(mData.members);
    }
    if (sRes.ok) {
      const sData = await sRes.json();
      setStats(sData);
    }
  }, []);

  useEffect(() => {
    if (authed) loadData();
  }, [authed, loadData]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret }),
    });
    if (res.ok) {
      setAuthed(true);
    } else {
      setLoginError('Invalid credentials.');
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setNewCode('');
    const res = await fetch('/api/admin/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      setNewCode(data.code);
      setForm({ name: '', company: '', email: '', expiresAt: '' });
      loadData();
    }
    setCreating(false);
  }

  async function handleStatusChange(id: number, status: string) {
    await fetch(`/api/admin/members/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    loadData();
  }

  if (!authed) {
    return (
      <section className="section-padding">
        <div className="container-wide max-w-sm">
          <h1 className="font-serif text-2xl font-bold text-ink-900 mb-6">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Admin password"
              className="w-full px-4 py-3 border border-ink-200 rounded text-sm outline-none focus:ring-1 focus:ring-ink-500"
            />
            {loginError && <p className="text-sm text-red-600">{loginError}</p>}
            <button type="submit" className="btn-primary w-full">Login</button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding">
      <div className="container-wide">
        <h1 className="font-serif text-2xl font-bold text-ink-900 mb-8">Admin Dashboard</h1>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-ink-50 border border-ink-100 rounded p-4">
              <p className="text-2xl font-bold text-ink-900">{stats.totalCases}</p>
              <p className="text-xs text-ink-500">Total Analyses</p>
            </div>
            <div className="bg-ink-50 border border-ink-100 rounded p-4">
              <p className="text-2xl font-bold text-ink-900">{stats.memberCases}</p>
              <p className="text-xs text-ink-500">Member Analyses</p>
            </div>
            <div className="bg-ink-50 border border-ink-100 rounded p-4">
              <p className="text-2xl font-bold text-ink-900">{stats.demoCases}</p>
              <p className="text-xs text-ink-500">Demo Analyses</p>
            </div>
            <div className="bg-ink-50 border border-ink-100 rounded p-4">
              <p className="text-2xl font-bold text-ink-900">{members.length}</p>
              <p className="text-xs text-ink-500">Member Codes</p>
            </div>
          </div>
        )}

        {/* Create Member Code */}
        <div className="bg-ink-50 border border-ink-100 rounded p-6 mb-10">
          <h2 className="font-semibold text-ink-900 mb-4">Create Member Code</h2>
          <form onSubmit={handleCreate} className="grid sm:grid-cols-5 gap-3">
            <input type="text" required placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="px-3 py-2 border border-ink-200 rounded text-sm outline-none" />
            <input type="text" placeholder="Company" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} className="px-3 py-2 border border-ink-200 rounded text-sm outline-none" />
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="px-3 py-2 border border-ink-200 rounded text-sm outline-none" />
            <input type="date" placeholder="Expires" value={form.expiresAt} onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))} className="px-3 py-2 border border-ink-200 rounded text-sm outline-none" />
            <button type="submit" disabled={creating} className="btn-primary text-sm disabled:opacity-50">Create</button>
          </form>
          {newCode && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded p-4">
              <p className="text-sm font-semibold text-green-800">
                New code created: <code className="text-lg font-mono bg-white px-2 py-1 rounded">{newCode}</code>
              </p>
              <p className="text-xs text-green-700 mt-1">Save this code now. It cannot be recovered once you leave this page.</p>
            </div>
          )}
        </div>

        {/* Member Codes Table */}
        <h2 className="font-semibold text-ink-900 mb-4">Member Codes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-ink-200 text-left">
                <th className="pb-2 pr-4 font-semibold text-ink-700">Name</th>
                <th className="pb-2 pr-4 font-semibold text-ink-700">Company</th>
                <th className="pb-2 pr-4 font-semibold text-ink-700">Email</th>
                <th className="pb-2 pr-4 font-semibold text-ink-700">Status</th>
                <th className="pb-2 pr-4 font-semibold text-ink-700">Last Used</th>
                <th className="pb-2 font-semibold text-ink-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b border-ink-100">
                  <td className="py-3 pr-4">{m.name}</td>
                  <td className="py-3 pr-4 text-ink-500">{m.company || '-'}</td>
                  <td className="py-3 pr-4 text-ink-500">{m.email || '-'}</td>
                  <td className="py-3 pr-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                      m.status === 'active' ? 'bg-green-100 text-green-800' :
                      m.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-ink-400 text-xs">
                    {m.last_used_at ? new Date(m.last_used_at).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="py-3 space-x-2">
                    {m.status === 'active' && (
                      <button onClick={() => handleStatusChange(m.id, 'inactive')} className="text-xs text-yellow-700 hover:underline">Disable</button>
                    )}
                    {m.status === 'inactive' && (
                      <button onClick={() => handleStatusChange(m.id, 'active')} className="text-xs text-green-700 hover:underline">Enable</button>
                    )}
                    {m.status !== 'revoked' && (
                      <button onClick={() => handleStatusChange(m.id, 'revoked')} className="text-xs text-red-700 hover:underline">Revoke</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Issue Types */}
        {stats && stats.issueTypes.length > 0 && (
          <div className="mt-10">
            <h2 className="font-semibold text-ink-900 mb-4">Top Issue Types</h2>
            <div className="space-y-2">
              {stats.issueTypes.map((t) => (
                <div key={t.issue_type} className="flex items-center gap-3">
                  <span className="text-sm text-ink-700 w-40">{t.issue_type}</span>
                  <div className="flex-1 bg-ink-100 rounded-full h-4">
                    <div className="bg-brand-red rounded-full h-4" style={{ width: `${Math.min(100, (parseInt(t.count) / stats.totalCases) * 100)}%` }} />
                  </div>
                  <span className="text-xs text-ink-500 w-8">{t.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
