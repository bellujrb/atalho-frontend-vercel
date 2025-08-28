'use client';

import { useArtifactContext } from '@/contexts/artifact-context';

export function useArtifact() {
  const context = useArtifactContext();
  return context;
}
