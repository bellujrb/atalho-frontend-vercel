'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useArtifact } from '@/hooks/use-artifact';

export function ArtifactCloseButton() {
  const { closeArtifact } = useArtifact();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={closeArtifact}
      className="h-8 w-8 p-0 hover:bg-muted"
    >
      <X className="h-4 w-4" />
    </Button>
  );
}
