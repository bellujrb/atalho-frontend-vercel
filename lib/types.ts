import { z } from 'zod';

export const messageMetadataSchema = z.object({
  createdAt: z.string(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

// Tipo para funções executadas
export interface FunctionExecution {
  name: string;
  description: string;
  parameters: Record<string, any>;
  result: {
    successful: any[];
    failed: any[];
  };
  executionTime: number;
}

// Tipo para metadata de mensagens com funções
export interface MessageFunctionMetadata {
  functions: {
    executed: FunctionExecution[];
    totalExecuted: number;
    hasErrors: boolean;
  };
}

// Tipo simples para mensagens de chat
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  metadata?: MessageFunctionMetadata;
}

export interface Attachment {
  name: string;
  url: string;
  contentType: string;
}

// Novo tipo para anexos de documentos
export interface DocumentAttachment extends Attachment {
  type: 'document';
  file: File;
  isProcessing?: boolean;
  extractedText?: string;
  error?: string;
}

export interface Suggestion {
  id: string;
  text: string;
  type: string;
}
