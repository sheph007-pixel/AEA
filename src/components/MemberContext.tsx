'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface MemberInfo {
  id: number;
  name: string;
  company: string | null;
}

interface MemberContextType {
  member: MemberInfo | null;
  isMember: boolean;
  loading: boolean;
  logout: () => Promise<void>;
}

const MemberContext = createContext<MemberContextType>({
  member: null,
  isMember: false,
  loading: true,
  logout: async () => {},
});

export function MemberProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<MemberInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) setMember(data.member);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setMember(null);
  }

  return (
    <MemberContext.Provider value={{ member, isMember: !!member, loading, logout }}>
      {children}
    </MemberContext.Provider>
  );
}

export function useMember() {
  return useContext(MemberContext);
}
