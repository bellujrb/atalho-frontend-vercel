"use client"

import { AppContextProvider } from '@/contexts/app-context';
import { ArtifactProvider } from '@/contexts/artifact-context';

interface ContextsWrapperProps {
  children: React.ReactNode;
}

export function ContextsWrapper({ children }: ContextsWrapperProps) {
  return (
    <AppContextProvider>
      <ArtifactProvider>
        {children}
      </ArtifactProvider>
    </AppContextProvider>
  );
}

