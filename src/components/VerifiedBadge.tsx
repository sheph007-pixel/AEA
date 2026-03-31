'use client';

import { useState, useEffect } from 'react';

interface VerificationData {
  lastChecked: string;
  status: string;
  passed: number;
}

export default function VerifiedBadge() {
  const [data, setData] = useState<VerificationData | null>(null);

  useEffect(() => {
    fetch('/api/verification')
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data || data.status !== 'verified') return null;

  const date = new Date(data.lastChecked);
  const formatted = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <span className="inline-flex items-center gap-1 text-ink-500">
      <svg className="w-3 h-3 text-green-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
      Content verified {formatted}
    </span>
  );
}
