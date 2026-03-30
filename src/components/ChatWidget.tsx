'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'bot' | 'user';
  text: string;
}

const FAQ_RESPONSES: Record<string, string> = {
  membership:
    'AEA membership gives employers access to compliance tools, HR resources, employer toolkits, and cost-saving programs. To learn more, I can have someone reach out to you. Would you like to share your contact information?',
  pricing:
    'Membership details and pricing are provided directly by our team based on your organization\'s size and needs. I can have someone contact you to discuss options. Would you like to share your email?',
  cost: 'Membership details and pricing are provided directly by our team based on your organization\'s size and needs. I can have someone contact you to discuss options. Would you like to share your email?',
  benefits:
    'AEA offers access to competitive employee benefits, risk management programs, and supplemental coverage options through our network of partners. Would you like to speak with someone about benefits programs?',
  compliance:
    'AEA provides compliance alerts, plain-language guides, checklists, and tools covering federal, state, and local employment law. Members receive updates as regulations change. Would you like to learn more?',
  insurance:
    'AEA is not an insurance company. We are an employer association that provides access to benefits programs through our partners, along with compliance resources, employer tools, and cost-saving programs.',
  contact:
    'I can help connect you with our team. Just share your name, email, and a brief message and I will make sure someone gets back to you within one business day.',
  join: 'Great! To get you connected with our membership team, could you share your name, email, and organization name? Someone will be in touch within one business day.',
};

function matchResponse(input: string): string | null {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(FAQ_RESPONSES)) {
    if (lower.includes(key)) return response;
  }
  if (lower.includes('who') && (lower.includes('are you') || lower.includes('is aea'))) {
    return 'AEA is the American Employers Alliance, a national employer association founded in 2013. We help businesses with 2-500 employees operate efficiently, stay compliant, and reduce costs through practical tools and resources.';
  }
  return null;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      text: 'Hello! I can answer questions about AEA, membership, compliance resources, and more. How can I help?',
    },
  ]);
  const [input, setInput] = useState('');
  const [collectingInfo, setCollectingInfo] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend() {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);

    // Check if user seems to be providing contact info
    const hasEmail = /\S+@\S+\.\S+/.test(userMsg);
    if (hasEmail && !collectingInfo) {
      setCollectingInfo(true);
      setContactForm((prev) => ({ ...prev, email: userMsg }));
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: 'bot',
            text: 'Thanks! Could you also share your name and what you would like to discuss? I will have someone reach out to you.',
          },
        ]);
      }, 500);
      return;
    }

    const matched = matchResponse(userMsg);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text:
            matched ||
            'I can help with questions about AEA membership, compliance resources, benefits programs, and employer tools. For more specific questions, I can connect you with our team. Would you like to share your contact information?',
        },
      ]);
    }, 600);
  }

  async function handleContactSubmit() {
    if (!contactForm.name || !contactForm.email) return;
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          message: contactForm.message || messages.map((m) => `${m.role}: ${m.text}`).join('\n'),
        }),
      });
      setSent(true);
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: 'Thank you! Someone from AEA will be in touch within one business day.',
        },
      ]);
      setCollectingInfo(false);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Something went wrong. Please try the contact form on our Contact page.' },
      ]);
    }
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-ink-900 text-white rounded-full shadow-lg hover:bg-ink-700 transition-colors flex items-center justify-center"
        aria-label="Chat with AEA"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white border border-ink-200 rounded-lg shadow-2xl flex flex-col max-h-[480px]">
          {/* Header */}
          <div className="bg-ink-900 text-white px-4 py-3 rounded-t-lg">
            <p className="text-sm font-semibold">AEA Support</p>
            <p className="text-xs text-ink-400">Ask us anything about AEA</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[300px]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-lg text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-ink-900 text-white'
                      : 'bg-ink-50 text-ink-700'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEnd} />
          </div>

          {/* Contact Info Collection */}
          {collectingInfo && !sent && (
            <div className="border-t border-ink-100 p-3 bg-ink-50 space-y-2">
              <input
                type="text"
                placeholder="Your name"
                value={contactForm.name}
                onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 border border-ink-200 rounded text-sm focus:ring-1 focus:ring-ink-500 outline-none"
              />
              <input
                type="email"
                placeholder="Your email"
                value={contactForm.email}
                onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full px-3 py-2 border border-ink-200 rounded text-sm focus:ring-1 focus:ring-ink-500 outline-none"
              />
              <input
                type="text"
                placeholder="Brief message (optional)"
                value={contactForm.message}
                onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
                className="w-full px-3 py-2 border border-ink-200 rounded text-sm focus:ring-1 focus:ring-ink-500 outline-none"
              />
              <button
                onClick={handleContactSubmit}
                className="w-full btn-primary text-xs py-2"
              >
                Send to AEA Team
              </button>
            </div>
          )}

          {/* Input */}
          {!collectingInfo && (
            <div className="border-t border-ink-100 p-3 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-ink-200 rounded text-sm focus:ring-1 focus:ring-ink-500 outline-none"
              />
              <button
                onClick={handleSend}
                className="px-3 py-2 bg-ink-900 text-white rounded text-sm hover:bg-ink-700 transition-colors"
              >
                Send
              </button>
            </div>
          )}

          {/* Collect info prompt */}
          {!collectingInfo && !sent && (
            <div className="border-t border-ink-100 px-4 py-2 bg-ink-50">
              <button
                onClick={() => setCollectingInfo(true)}
                className="text-xs text-brand-red hover:text-brand-red-dark font-medium"
              >
                Want someone to reach out? Share your info &rarr;
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
