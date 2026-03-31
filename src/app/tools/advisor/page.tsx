'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import MembershipGate from '@/components/MembershipGate';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function AdvisorChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [queryCount, setQueryCount] = useState(0);
  const [gated, setGated] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const count = parseInt(localStorage.getItem('aea_advisor_count') || '0');
      setQueryCount(count);
      if (count >= 3 && !localStorage.getItem('aea_member_access')) {
        setGated(true);
      }
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const question = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.answer || data.error }]);
      const newCount = queryCount + 1;
      setQueryCount(newCount);
      localStorage.setItem('aea_advisor_count', String(newCount));
      if (newCount >= 3 && !localStorage.getItem('aea_member_access')) {
        setGated(true);
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
    }
    setLoading(false);
  }

  if (gated) {
    return <MembershipGate toolName="HR & Compliance Advisor"><AdvisorChat /></MembershipGate>;
  }

  return (
    <div>
      {/* Messages */}
      <div className="border border-ink-100 rounded bg-white min-h-[400px] max-h-[600px] overflow-y-auto p-6">
        {messages.length === 0 && (
          <div className="text-center py-16">
            <p className="font-serif text-lg font-bold text-ink-900 mb-2">Ask your HR or compliance question</p>
            <p className="text-sm text-ink-400 max-w-md mx-auto">
              Get instant guidance on employment law, HR policies, hiring, terminations, benefits, FMLA, ADA, OSHA, and more.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {[
                'Do I need to provide FMLA leave for a team of 40?',
                'How should I handle an ADA accommodation request?',
                'What is required for overtime exempt classification?',
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="text-xs text-ink-500 border border-ink-200 px-3 py-1.5 rounded hover:border-ink-400 hover:text-ink-700 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`mb-6 ${msg.role === 'user' ? 'text-right' : ''}`}>
            <p className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-1">
              {msg.role === 'user' ? 'You' : 'AEA Advisor'}
            </p>
            <div
              className={`inline-block text-left max-w-[90%] text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-ink-900 text-white p-4 rounded'
                  : 'bg-ink-50 text-ink-700 p-4 rounded'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-1">AEA Advisor</p>
            <div className="inline-block bg-ink-50 text-ink-400 p-4 rounded text-sm">
              Analyzing your question...
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask an HR or compliance question..."
          className="flex-1 px-4 py-3 border border-ink-200 rounded text-sm outline-none focus:ring-1 focus:ring-ink-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="btn-primary disabled:opacity-50"
        >
          Ask
        </button>
      </form>
      <p className="text-xs text-ink-400 mt-2">
        {3 - queryCount > 0 ? `${3 - queryCount} free questions remaining` : 'Unlimited access with membership'}
        {' '}&middot; AI-generated guidance &middot; Always consult legal counsel for specific situations
      </p>
    </div>
  );
}

export default function AdvisorPage() {
  return (
    <>
      <section className="border-b border-ink-100">
        <div className="container-wide py-10">
          <Link href="/tools" className="category-tag hover:text-brand-red-dark transition-colors">
            AI Tools
          </Link>
          <h1 className="font-serif text-3xl md:text-4.5xl font-bold text-ink-900 mt-2">
            HR & Compliance Advisor
          </h1>
          <p className="mt-3 text-ink-500 max-w-2xl">
            Ask any HR or employment law question and get instant, practical guidance powered by AI.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide max-w-4xl">
          <AdvisorChat />
        </div>
      </section>
    </>
  );
}
