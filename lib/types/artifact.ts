export type ArtifactKind = 'text' | 'sheet';

export interface UIArtifact {
  title: string;
  documentId: string;
  kind: ArtifactKind;
  content: string;
  isVisible: boolean;
  status: 'streaming' | 'idle';
  boundingBox: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

export interface ArtifactAction {
  icon: React.ReactNode;
  description: string;
  onClick: () => void;
  isDisabled?: boolean;
}

export interface ArtifactToolbarItem {
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export interface ArtifactMetadata {
  suggestions?: any[];
  outputs?: any[];
}
