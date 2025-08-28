"use client"

import { ThemeProvider } from './theme-provider'
import { Toaster } from 'sonner'
import { AuthSync } from './auth-sync'

interface ProvidersWrapperProps {
  children: React.ReactNode
}

export function ProvidersWrapper({ children }: ProvidersWrapperProps) {
  return (
    <ThemeProvider>
      <Toaster position="top-center" />
      <AuthSync>
        {children}
      </AuthSync>
    </ThemeProvider>
  )
}

