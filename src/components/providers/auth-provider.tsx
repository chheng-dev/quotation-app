'use client'

import { useEffect } from 'react'

import { useCurrentUser } from '@/src/hooks/use-current-user'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useCurrentUser()

  useEffect(() => {
    if (!isLoading) {
      console.log(
        'Current user:',
        user ? `${user.name} (${user.email})` : 'Not logged in',
      )
    }
  }, [user, isLoading])

  return <>{children}</>
}
