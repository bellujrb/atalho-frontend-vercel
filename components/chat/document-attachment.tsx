"use client"

import React, { useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { PaperclipIcon, FileTextIcon, XIcon, Loader2Icon } from "lucide-react"
import { toast } from "sonner"
import { documentService } from "@/services/document.service"
import type { DocumentAttachment } from "@/lib/types"

interface DocumentAttachmentProps {
  onDocumentAttached: (document: DocumentAttachment) => void
  onDocumentRemoved: (documentId: string) => void
  disabled?: boolean
}

export function DocumentAttachment({ onDocumentAttached, onDocumentRemoved, disabled = false }: DocumentAttachmentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    if (file.type !== 'application/pdf') {
      toast.error('Apenas arquivos PDF são suportados')
      return
    }

    // Validar tamanho (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('O arquivo deve ter no máximo 10MB')
      return
    }

    setIsProcessing(true)
    toast.info(`Processando documento: ${file.name}`)

    try {
      const result = await documentService.processDocument(file)

      if (result.success && result.data) {
        toast.success(`Documento anexado: ${result.data.fileName}`)
        
        // Criar o documento anexado
        const documentAttachment: DocumentAttachment = {
          type: 'document',
          name: result.data.fileName,
          url: URL.createObjectURL(file), // URL temporária para preview
          contentType: 'application/pdf',
          file: file,
          extractedText: result.data.text,
        }
        
        onDocumentAttached(documentAttachment)
      } else {
        toast.error(result.error || 'Erro ao processar documento')
        if (result.details) {
          console.error('Detalhes do erro:', result.details)
        }
      }
    } catch (error) {
      console.error('Erro ao processar documento:', error)
      toast.error('Erro inesperado ao processar documento')
    } finally {
      setIsProcessing(false)
      // Limpar o input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }, [onDocumentAttached])

  const handleClick = useCallback(() => {
    if (!disabled && !isProcessing) {
      fileInputRef.current?.click()
    }
  }, [disabled, isProcessing])

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isProcessing}
      />
      
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-lg hover:bg-muted/80 transition-colors"
        onClick={handleClick}
        disabled={disabled || isProcessing}
        title="Anexar documento PDF"
      >
        {isProcessing ? (
          <Loader2Icon className="h-5 w-5 animate-spin text-muted-foreground" />
        ) : (
          <PaperclipIcon className="h-5 w-5 text-muted-foreground" />
        )}
      </Button>
    </div>
  )
}
