'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface SearchItem {
  title: string;
  description: string;
  category: string;
  slug: string;
  href: string;
  source: string;
}

export default function SearchDialog({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<SearchItem[]>([]);
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
    fetch('/api/search-index')
      .then((r) => r.json())
      .then((data) => { setItems(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    const filtered = items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
    setResults(filtered.slice(0, 15));
  }, [query, items]);

  const handleSelect = useCallback((href: string) => {
    onClose();
    router.push(href);
  }, [onClose, router]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-32">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink-900/50" onClick={onClose} />

      {/* Dialog */}
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-lg shadow-2xl border border-ink-200 overflow-hidden">
        {/* Search input */}
        <div className="flex items-center border-b border-ink-100 px-4">
          <svg className="w-5 h-5 text-ink-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search resources, briefings, news..."
            className="w-full px-3 py-4 text-base outline-none"
          />
          <button onClick={onClose} className="text-xs text-ink-400 bg-ink-100 px-2 py-1 rounded shrink-0">
            ESC
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="px-4 py-8 text-center text-ink-400 text-sm">Loading...</div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="px-4 py-8 text-center text-ink-400 text-sm">
              No results for &ldquo;{query}&rdquo;
            </div>
          )}

          {!loading && !query && (
            <div className="px-4 py-6 text-center text-ink-400 text-sm">
              Search across {items.length} articles, briefings, and news items
            </div>
          )}

          {results.map((item) => (
            <button
              key={`${item.source}-${item.slug}`}
              onClick={() => handleSelect(item.href)}
              className="w-full text-left px-4 py-3 hover:bg-ink-50 transition-colors border-b border-ink-50 last:border-0"
            >
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-red">
                  {item.source}
                </span>
                <span className="text-[10px] text-ink-400">{item.category}</span>
              </div>
              <h4 className="text-sm font-semibold text-ink-900 leading-snug">
                {item.title}
              </h4>
              <p className="text-xs text-ink-500 mt-0.5 line-clamp-1">
                {item.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
