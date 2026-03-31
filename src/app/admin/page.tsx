'use client';

import { useState, useEffect, useCallback } from 'react';

interface Member {
  id: number; name: string; company: string | null; email: string | null;
  code_plain: string | null; status: string; last_used_at: string | null; created_at: string;
}

interface Contact {
  id: number; form_type: string; first_name: string | null; last_name: string | null;
  email: string | null; company: string | null; employees: string | null;
  interest: string | null; message: string | null; status: string; created_at: string;
}

interface Stats {
  totalCases: number; memberCases: number; demoCases: number;
  issueTypes: { issue_type: string; count: string }[];
}

type Tab = 'members' | 'contacts' | 'stats';
type FilterTab = 'all' | 'active' | 'termed';

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [secret, setSecret] = useState('');
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState<Tab>('members');
  const [members, setMembers] = useState<Member[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [newCode, setNewCode] = useState('');
  const [form, setForm] = useState({ name: '', company: '', email: '' });
  const [creating, setCreating] = useState(false);
  const [memberFilter, setMemberFilter] = useState<FilterTab>('all');
  const [contactFilter, setContactFilter] = useState<FilterTab>('all');

  const loadData = useCallback(async () => {
    const [mRes, cRes, sRes] = await Promise.all([
      fetch('/api/admin/members'),
      fetch('/api/admin/contacts'),
      fetch('/api/admin/stats'),
    ]);
    if (mRes.ok) setMembers((await mRes.json()).members);
    if (cRes.ok) setContacts((await cRes.json()).contacts);
    if (sRes.ok) setStats(await sRes.json());
  }, []);

  useEffect(() => { if (authed) loadData(); }, [authed, loadData]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ secret }) });
    if (res.ok) setAuthed(true);
    else setLoginError('Invalid credentials.');
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true); setNewCode('');
    const res = await fetch('/api/admin/members', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) { const data = await res.json(); setNewCode(data.code); setForm({ name: '', company: '', email: '' }); loadData(); }
    setCreating(false);
  }

  async function handleMemberAction(id: number, action: 'active' | 'termed' | 'delete') {
    if (action === 'delete') {
      if (!confirm('Permanently delete this member code?')) return;
      await fetch(`/api/admin/members/${id}`, { method: 'DELETE' });
    } else {
      await fetch(`/api/admin/members/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: action }) });
    }
    loadData();
  }

  async function handleContactAction(id: number, action: 'active' | 'termed' | 'delete') {
    if (action === 'delete') {
      if (!confirm('Permanently delete this contact?')) return;
      await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' });
    } else {
      await fetch(`/api/admin/contacts/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: action }) });
    }
    loadData();
  }

  const filteredMembers = members.filter((m) => {
    if (memberFilter === 'all') return true;
    if (memberFilter === 'active') return m.status === 'active';
    return m.status !== 'active';
  });

  const filteredContacts = contacts.filter((c) => {
    if (contactFilter === 'all') return true;
    if (contactFilter === 'active') return c.status === 'active' || !c.status;
    return c.status === 'termed';
  });

  if (!authed) {
    return (
      <section className="section-padding">
        <div className="container-wide max-w-sm">
          <h1 className="font-serif text-2xl font-bold text-ink-900 mb-6">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" value={secret} onChange={(e) => setSecret(e.target.value)} placeholder="Admin password" className="w-full px-4 py-3 border border-ink-200 rounded text-sm outline-none focus:ring-1 focus:ring-ink-500" />
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
        <h1 className="font-serif text-2xl font-bold text-ink-900 mb-6">Admin Dashboard</h1>

        {/* Main Tabs */}
        <div className="flex gap-1 mb-8 border-b border-ink-200">
          {(['members', 'contacts', 'stats'] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === t ? 'border-ink-900 text-ink-900' : 'border-transparent text-ink-400 hover:text-ink-700'}`}>
              {t === 'members' ? `Members (${members.length})` : t === 'contacts' ? `Contacts (${contacts.length})` : 'Stats'}
            </button>
          ))}
        </div>

        {/* MEMBERS TAB */}
        {tab === 'members' && (
          <>
            <div className="bg-ink-50 border border-ink-100 rounded p-6 mb-8">
              <h2 className="font-semibold text-ink-900 mb-4">Create Member Code</h2>
              <form onSubmit={handleCreate} className="grid sm:grid-cols-4 gap-3">
                <input type="text" required placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="px-3 py-2 border border-ink-200 rounded text-sm outline-none" />
                <input type="text" placeholder="Company" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} className="px-3 py-2 border border-ink-200 rounded text-sm outline-none" />
                <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="px-3 py-2 border border-ink-200 rounded text-sm outline-none" />
                <button type="submit" disabled={creating} className="btn-primary text-sm disabled:opacity-50">Create</button>
              </form>
              {newCode && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded p-4">
                  <p className="text-sm font-semibold text-green-800">New code: <code className="text-lg font-mono bg-white px-2 py-1 rounded">{newCode}</code></p>
                  <p className="text-xs text-green-700 mt-1">Save this code now.</p>
                </div>
              )}
            </div>

            <div className="flex gap-1 mb-4">
              {(['all', 'active', 'termed'] as FilterTab[]).map((f) => (
                <button key={f} onClick={() => setMemberFilter(f)} className={`px-4 py-1.5 rounded text-sm font-medium ${memberFilter === f ? 'bg-ink-900 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'}`}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-ink-200 text-left">
                    <th className="pb-2 pr-4 font-semibold text-ink-700">Name</th>
                    <th className="pb-2 pr-4 font-semibold text-ink-700">Company</th>
                    <th className="pb-2 pr-4 font-semibold text-ink-700">Email</th>
                    <th className="pb-2 pr-4 font-semibold text-ink-700">Code</th>
                    <th className="pb-2 pr-4 font-semibold text-ink-700">Status</th>
                    <th className="pb-2 pr-4 font-semibold text-ink-700">Last Used</th>
                    <th className="pb-2 font-semibold text-ink-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((m) => (
                    <tr key={m.id} className="border-b border-ink-100">
                      <td className="py-3 pr-4">{m.name}</td>
                      <td className="py-3 pr-4 text-ink-500">{m.company || '-'}</td>
                      <td className="py-3 pr-4 text-ink-500">{m.email || '-'}</td>
                      <td className="py-3 pr-4">
                        {m.code_plain ? <code className="font-mono text-xs bg-ink-100 px-1.5 py-0.5 rounded">{m.code_plain}</code> : <span className="text-ink-400 text-xs">-</span>}
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${m.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {m.status === 'active' ? 'active' : 'termed'}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-ink-400 text-xs">{m.last_used_at ? new Date(m.last_used_at).toLocaleDateString() : 'Never'}</td>
                      <td className="py-3 space-x-2">
                        {m.status === 'active' ? (
                          <button onClick={() => handleMemberAction(m.id, 'termed')} className="text-xs text-red-700 hover:underline">Term</button>
                        ) : (
                          <button onClick={() => handleMemberAction(m.id, 'active')} className="text-xs text-green-700 hover:underline">Activate</button>
                        )}
                        <button onClick={() => handleMemberAction(m.id, 'delete')} className="text-xs text-ink-400 hover:text-red-700 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredMembers.length === 0 && <p className="text-sm text-ink-400 py-6 text-center">No members found.</p>}
            </div>
          </>
        )}

        {/* CONTACTS TAB */}
        {tab === 'contacts' && (
          <>
            <div className="flex gap-1 mb-4">
              {(['all', 'active', 'termed'] as FilterTab[]).map((f) => (
                <button key={f} onClick={() => setContactFilter(f)} className={`px-4 py-1.5 rounded text-sm font-medium ${contactFilter === f ? 'bg-ink-900 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'}`}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-ink-200 text-left">
                    <th className="pb-2 pr-4 font-semibold text-ink-700">Name</th>
                    <th className="pb-2 pr-4 font-semibold text-ink-700">Company</th>
                    <th className="pb-2 pr-4 font-semibold text-ink-700">Email</th>
                    <th className="pb-2 pr-4 font-semibold text-ink-700">Type</th>
                    <th className="pb-2 pr-4 font-semibold text-ink-700">Status</th>
                    <th className="pb-2 pr-4 font-semibold text-ink-700">Message</th>
                    <th className="pb-2 pr-4 font-semibold text-ink-700">Date</th>
                    <th className="pb-2 font-semibold text-ink-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((c) => (
                    <tr key={c.id} className="border-b border-ink-100">
                      <td className="py-3 pr-4">{[c.first_name, c.last_name].filter(Boolean).join(' ') || '-'}</td>
                      <td className="py-3 pr-4 text-ink-500">{c.company || '-'}</td>
                      <td className="py-3 pr-4 text-ink-500">{c.email || '-'}</td>
                      <td className="py-3 pr-4 text-xs text-ink-500">{c.form_type}</td>
                      <td className="py-3 pr-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${(c.status === 'active' || !c.status) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {(c.status === 'active' || !c.status) ? 'active' : 'termed'}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-xs text-ink-500 max-w-[200px] truncate">{c.message || c.interest || '-'}</td>
                      <td className="py-3 pr-4 text-ink-400 text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
                      <td className="py-3 space-x-2">
                        {(c.status === 'active' || !c.status) ? (
                          <button onClick={() => handleContactAction(c.id, 'termed')} className="text-xs text-red-700 hover:underline">Term</button>
                        ) : (
                          <button onClick={() => handleContactAction(c.id, 'active')} className="text-xs text-green-700 hover:underline">Activate</button>
                        )}
                        <button onClick={() => handleContactAction(c.id, 'delete')} className="text-xs text-ink-400 hover:text-red-700 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredContacts.length === 0 && <p className="text-sm text-ink-400 py-6 text-center">No contacts found.</p>}
            </div>
          </>
        )}

        {/* STATS TAB */}
        {tab === 'stats' && stats && (
          <>
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

            {stats.issueTypes.length > 0 && (
              <div>
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
          </>
        )}
      </div>
    </section>
  );
}
