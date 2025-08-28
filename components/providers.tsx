"use client"

import { ThemeProvider } from './theme-provider'
import { Toaster } from 'sonner'
import { AuthSync } from './auth-sync'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <Toaster position="top-center" />
      <AuthSync>
        {children}
      </AuthSync>
    </ThemeProvider>
  )
}