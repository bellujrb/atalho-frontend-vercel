import { useState, useCallback } from 'react';
import type { DocumentAttachment } from '@/lib/types';

export function useDocuments() {
  const [documents, setDocuments] = useState<DocumentAttachment[]>([]);

  const addDocument = useCallback((document: DocumentAttachment) => {
    setDocuments(prev => [...prev, document]);
  }, []);

  const removeDocument = useCallback((documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.url !== documentId));
  }, []);

  const clearDocuments = useCallback(() => {
    setDocuments([]);
  }, []);

  const getDocumentContext = useCallback(() => {
    return documents
      .filter(doc => doc.extractedText)
      .map(doc => `[Documento: ${doc.name}]\n${doc.extractedText}`)
      .join('\n\n');
  }, [documents]);

  const hasDocuments = useCallback(() => {
    return documents.length > 0;
  }, [documents]);

  return {
    documents,
    addDocument,
    removeDocument,
    clearDocuments,
    getDocumentContext,
    hasDocuments,
  };
}
