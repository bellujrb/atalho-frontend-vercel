'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { UIArtifact, ArtifactKind, ArtifactMetadata } from '@/lib/types/artifact';

interface ArtifactContextType {
  artifact: UIArtifact;
  setArtifact: (artifact: UIArtifact | ((prev: UIArtifact) => UIArtifact)) => void;
  metadata: ArtifactMetadata | null;
  setMetadata: (metadata: ArtifactMetadata | ((prev: ArtifactMetadata | null) => ArtifactMetadata | null)) => void;
  openArtifact: (kind: ArtifactKind, title: string, content: string) => void;
  closeArtifact: () => void;
}

const ArtifactContext = createContext<ArtifactContextType | undefined>(undefined);

const initialArtifact: UIArtifact = {
  documentId: 'init',
  content: '',
  kind: 'text',
  title: '',
  status: 'idle',
  isVisible: false,
  boundingBox: {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  },
};

export function ArtifactProvider({ children }: { children: ReactNode }) {
  const [artifact, setArtifact] = useState<UIArtifact>(initialArtifact);
  const [metadata, setMetadata] = useState<ArtifactMetadata | null>(null);

  const openArtifact = useCallback((kind: ArtifactKind, title: string, content: string) => {
    setArtifact({
      documentId: `demo-${kind}-${Date.now()}`,
      title,
      kind,
      content,
      isVisible: true,
      status: 'idle',
      boundingBox: {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
      },
    });
  }, []);

  const closeArtifact = useCallback(() => {
    setArtifact(prev => ({
      ...prev,
      isVisible: false,
    }));
  }, []);

  const value: ArtifactContextType = {
    artifact,
    setArtifact,
    metadata,
    setMetadata,
    openArtifact,
    closeArtifact,
  };

  return (
    <ArtifactContext.Provider value={value}>
      {children}
    </ArtifactContext.Provider>
  );
}

export function useArtifactContext() {
  const context = useContext(ArtifactContext);
  if (context === undefined) {
    throw new Error('useArtifactContext must be used within an ArtifactProvider');
  }
  return context;
}
