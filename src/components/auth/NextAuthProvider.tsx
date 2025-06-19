// src/components/auth/NextAuthProvider.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';

interface NextAuthProviderProps {
  children: ReactNode;
  // Removed session prop as SessionProvider fetches it internally for client components
}

export default function NextAuthProvider({ children }: NextAuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
