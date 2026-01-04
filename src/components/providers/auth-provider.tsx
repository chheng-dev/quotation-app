'use client';

import { useCurrentUser } from '@/src/hooks/use-current-user';
import { useEffect } from 'react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading) {
      console.log('Current user:', user ? `${user.name} (${user.email})` : 'Not logged in');
    }
  }, [user, isLoading]);  

  return <>{children}</>;
}
