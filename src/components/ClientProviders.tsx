'use client';

import { MemberProvider } from '@/components/MemberContext';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return <MemberProvider>{children}</MemberProvider>;
}
