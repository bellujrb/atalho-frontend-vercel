"use client"

import cx from "classnames"
import type React from "react"
import { useRef, useEffect, useCallback, type Dispatch, type SetStateAction, type ChangeEvent, memo, useState } from "react"
import { useLocalStorage, useWindowSize } from "usehooks-ts"

import { ArrowUpIcon, StopIcon } from "../icons"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { ArrowDown } from "lucide-react"
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom"
import type { Attachment, ChatMessage, DocumentAttachment } from "@/lib/types"
import { DocumentAttachment as DocumentAttachmentComponent } from "./document-attachment"
import { DocumentPreview } from "./document-preview"
import equal from "fast-deep-equal"

function PureMultimodalInput({
  chatId,
  input,
  setInput,
  status,
  stop,
  attachments,
  setAttachments,
  messages,
  setMessages,
  sendMessage,
  className,
}: {
  chatId: string
  input: string
  setInput: Dispatch<SetStateAction<string>>
  status: "idle" | "streaming"
  stop: () => void
  attachments: Array<Attachment>
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>
  messages: Array<ChatMessage>
  setMessages: (messages: ChatMessage[] | ((messages: ChatMessage[]) => ChatMessage[])) => void
  sendMessage: (message: string) => void
  className?: string
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { width } = useWindowSize()
  const [documents, setDocuments] = useState<DocumentAttachment[]>([])

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight()
    }
  }, [])

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`
    }
  }

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = "98px"
    }
  }

  const [localStorageInput, setLocalStorageInput] = useLocalStorage("input", "")

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value
      // Prefer DOM value over localStorage to handle hydration
      const finalValue = domValue || localStorageInput || ""
      setInput(finalValue)
      adjustHeight()
    }
    // Only run once after hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setLocalStorageInput(input)
  }, [input, setLocalStorageInput])

  const handleInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value)
    adjustHeight()
  }

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault()
        handleSubmit()
      }
    },
    [input, status, sendMessage], // Added missing dependencies
  )

  const handleSubmit = useCallback(
    (event?: React.FormEvent) => {
      if (event) {
        event.preventDefault()
      }

      if (!input.trim() || status === "streaming") {
        return
      }

      // Se houver documentos anexados, enviar junto com a mensagem
      if (documents.length > 0) {
        const documentContext = documents
          .map(doc => `[Documento: ${doc.name}]\n${doc.extractedText}`)
          .join('\n\n')
        
        const fullMessage = `${input}\n\n${documentContext}`
        sendMessage(fullMessage)
      } else {
        sendMessage(input.trim())
      }
      
      setInput("")
      setDocuments([]) // Limpar documentos após enviar
      resetHeight()
    },
    [input, status, sendMessage, documents, setInput],
  )

  const handleDocumentAttached = useCallback((document: DocumentAttachment) => {
    setDocuments(prev => [...prev, document])
  }, [])

  const handleDocumentRemoved = useCallback((documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.url !== documentId))
  }, [])

  return (
    <div className={cx("flex flex-col gap-2 w-full", className)}>
      <div className="flex flex-row gap-2 items-end bg-card border border-border/50 rounded-lg p-3 shadow-sm">
        <div className="flex flex-col gap-2 flex-1">
          <Textarea
            ref={textareaRef}
            data-testid="multimodal-input"
            className="min-h-[98px] max-h-[400px] resize-none overflow-hidden border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
            placeholder="Digite uma mensagem..."
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={status === "streaming"}
          />

          {/* Preview dos documentos anexados */}
          <DocumentPreview 
            documents={documents}
            onRemoveDocument={handleDocumentRemoved}
          />

          {attachments.length > 0 && (
            <div className="flex flex-row gap-2 flex-wrap">
              {attachments.map((attachment, index) => (
                <div
                  key={attachment.url}
                  className="flex flex-row gap-2 items-center bg-muted/50 border border-border/30 p-2 rounded-md"
                >
                  <span className="text-sm text-muted-foreground">{attachment.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setAttachments((prev) => prev.filter((_, i) => i !== index))
                    }}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {/* Botão de anexo de documento */}
          <DocumentAttachmentComponent
            onDocumentAttached={handleDocumentAttached}
            onDocumentRemoved={handleDocumentRemoved}
            disabled={status === "streaming"}
          />
          
          {status === "streaming" ? (
            <Button
              data-testid="stop-button"
              variant="outline"
              size="icon"
              className="h-10 w-10 border-border/50 hover:bg-muted/50 bg-transparent"
              onClick={stop}
            >
              <StopIcon />
            </Button>
          ) : (
            <Button
              data-testid="send-button"
              variant="default"
              size="icon"
              className="h-10 w-10 shadow-sm hover:shadow-md transition-shadow bg-green-600 hover:bg-green-700 text-white"
              onClick={(e) => {
                e.preventDefault()
                handleSubmit()
              }}
              disabled={!input.trim()}
            >
              <ArrowUpIcon />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export const MultimodalInput = memo(PureMultimodalInput, (prevProps, nextProps) => {
  if (prevProps.status !== nextProps.status) return false
  if (prevProps.input !== nextProps.input) return false
  if (prevProps.attachments.length !== nextProps.attachments.length) return false
  if (!equal(prevProps.attachments, nextProps.attachments)) return false
  if (prevProps.messages.length !== nextProps.messages.length) return false
  if (prevProps.chatId !== nextProps.chatId) return false

  return true
})
