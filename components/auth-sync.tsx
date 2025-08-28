'use client'

import { useClerkAuth } from '@/hooks/use-clerk-auth'

interface AuthSyncProps {
  children: React.ReactNode
}

export function AuthSync({ children }: AuthSyncProps) {
  const { isInitialized } = useClerkAuth()

  return <>{children}</>
}
