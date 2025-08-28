"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { FileTextIcon, XIcon } from "lucide-react"
import type { DocumentAttachment } from "@/lib/types"

interface DocumentPreviewProps {
  documents: DocumentAttachment[]
  onRemoveDocument: (documentId: string) => void
}

export function DocumentPreview({ documents, onRemoveDocument }: DocumentPreviewProps) {
  if (documents.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm text-muted-foreground font-medium">
        Documentos anexados ({documents.length})
      </div>
      
      <div className="flex flex-row gap-2 flex-wrap">
        {documents.map((document) => (
          <div
            key={document.url}
            className="flex flex-row gap-2 items-center bg-muted/50 border border-border/30 p-3 rounded-md max-w-full"
          >
            <FileTextIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
            
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-medium text-foreground truncate">
                {document.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {document.extractedText ? 'Processado' : 'Processando...'}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-muted/80 text-muted-foreground hover:text-foreground flex-shrink-0"
              onClick={() => onRemoveDocument(document.url)}
              title="Remover documento"
            >
              <XIcon className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
