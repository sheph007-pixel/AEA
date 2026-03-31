'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'agent' | 'visitor';
  text: string;
}

export default function LiveAgent() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'agent',
      text: "Hi there! I'm with the AEA team. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [contactCollected, setContactCollected] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', company: '' });
  const [submitted, setSubmitted] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'visitor', text: msg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/live-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          history: messages.slice(-6).map((m) => `${m.role}: ${m.text}`).join('\n'),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'agent', text: data.reply }]);
      if (data.collectContact) {
        setContactCollected(true);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'agent', text: "I'm sorry, I'm having a connection issue. Could you try again?" },
      ]);
    }
    setLoading(false);
  }

  async function handleContactSubmit() {
    if (!contactForm.name || !contactForm.email) return;
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: contactForm.name,
          lastName: '',
          email: contactForm.email,
          company: contactForm.company,
          employees: '',
          interest: 'Live agent chat',
          message: messages.map((m) => `${m.role}: ${m.text}`).join('\n'),
        }),
      });
      setSubmitted(true);
      setContactCollected(false);
      setMessages((prev) => [
        ...prev,
        {
          role: 'agent',
          text: `Thanks, ${contactForm.name}! I've passed your info to the team. Someone from AEA will follow up with you shortly. Is there anything else I can help with in the meantime?`,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'agent', text: "I wasn't able to submit that. You can also reach us through our Contact page." },
      ]);
    }
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 left-4 z-50 flex items-center gap-2 bg-ink-900 text-white pl-3 pr-4 py-2.5 sm:pl-4 sm:pr-5 sm:py-3 rounded-full shadow-lg hover:bg-ink-700 transition-colors"
        aria-label="Chat with AEA"
      >
        {open ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-sm font-medium">Chat with AEA</span>
          </>
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-16 left-4 right-4 sm:right-auto sm:left-4 z-50 w-auto sm:w-96 bg-white border border-ink-200 rounded-lg shadow-2xl flex flex-col max-h-[70vh] sm:max-h-[480px]">
          {/* Header */}
          <div className="bg-ink-900 text-white px-4 py-3 rounded-t-lg flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <div>
              <p className="text-sm font-semibold">AEA Team</p>
              <p className="text-xs text-ink-400">We&apos;re here to help</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[280px]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'visitor' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-lg text-sm leading-relaxed ${
                    msg.role === 'visitor'
                      ? 'bg-ink-900 text-white'
                      : 'bg-ink-50 text-ink-700'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-ink-50 text-ink-400 px-3 py-2 rounded-lg text-sm">
                  Typing...
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Contact Collection */}
          {contactCollected && !submitted && (
            <div className="border-t border-ink-100 p-3 bg-ink-50 space-y-2">
              <p className="text-xs text-ink-500 font-medium">Share your info so we can follow up:</p>
              <input
                type="text"
                placeholder="Your name"
                value={contactForm.name}
                onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 border border-ink-200 rounded text-sm outline-none focus:ring-1 focus:ring-ink-500"
              />
              <input
                type="email"
                placeholder="Email address"
                value={contactForm.email}
                onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full px-3 py-2 border border-ink-200 rounded text-sm outline-none focus:ring-1 focus:ring-ink-500"
              />
              <input
                type="text"
                placeholder="Company (optional)"
                value={contactForm.company}
                onChange={(e) => setContactForm((f) => ({ ...f, company: e.target.value }))}
                className="w-full px-3 py-2 border border-ink-200 rounded text-sm outline-none focus:ring-1 focus:ring-ink-500"
              />
              <button onClick={handleContactSubmit} className="btn-primary w-full text-xs py-2">
                Connect Me with AEA
              </button>
            </div>
          )}

          {/* Input */}
          {!contactCollected && (
            <div className="border-t border-ink-100 p-3 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-ink-200 rounded text-sm outline-none focus:ring-1 focus:ring-ink-500"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-3 py-2 bg-ink-900 text-white rounded text-sm hover:bg-ink-700 transition-colors disabled:opacity-50"
              >
                Send
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
