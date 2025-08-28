"use client"

import React, { useState, useCallback, useMemo, useEffect, useRef } from "react"
import { ChatHeader } from "@/components/chat/chat-header"
import { MultimodalInput } from "./multimodal-input"
import { Messages } from "./messages"
import { Artifact } from "@/components/artifacts"
import type { ChatMessage } from "@/lib/types"
import { useChat } from "@/hooks/use-chat"
import { useArtifact } from "@/hooks/use-artifact"
import { useDocuments } from "@/hooks/use-documents"
import { toast } from "sonner"

export function Chat({
  id,
}: {
  id: string
}) {
  const [input, setInput] = useState<string>("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [status, setStatus] = useState<"idle" | "streaming">("idle")
  const { 
    sendMessage: sendChatMessage, 
    loadChatHistory, 
    selectedCompany,
    currentChat
  } = useChat()
  const { artifact } = useArtifact()
  const { documents, clearDocuments } = useDocuments()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const stop = useCallback(() => setStatus("idle"), [])
  const setInputCallback = useCallback(setInput, [])
  const setMessagesCallback = useCallback(setMessages, [])

  // Função para scroll automático para o final
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior, 
        block: 'end',
        inline: 'nearest'
      })
    }
  }, [])

  useEffect(() => {
    const loadChatHistoryData = async () => {
      if (id && messages.length === 0 && selectedCompany?.id) {
        try {
          const history = await loadChatHistory(id);
          if (history && history.messages.length > 0) {
            // Verificar se já não existem mensagens com os mesmos IDs
            const formattedMessages: ChatMessage[] = history.messages
              .filter((msg: any) => !messages.some(existingMsg => existingMsg.id === msg.id))
              .map((msg: any) => ({
                id: msg.id,
                role: msg.type === 'user' ? 'user' : 'assistant',
                content: msg.content,
                createdAt: msg.timestamp,
                metadata: msg.thoughts ? {
                  functions: {
                    executed: [],
                    totalExecuted: 0,
                    hasErrors: false
                  }
                } : undefined,
              }));
              
            if (formattedMessages.length > 0) {
              setMessages(formattedMessages);
              
              // Scroll para o final após carregar histórico
              setTimeout(() => {
                scrollToBottom('instant');
              }, 200);
            }
          }
        } catch (error) {
          console.error('Erro ao carregar histórico do chat:', error);
        }
      }
    };

    loadChatHistoryData();
  }, [id, loadChatHistory, scrollToBottom, selectedCompany?.id]);

  const sendMessage = useCallback(
    async (messageText: string) => {
      if (!messageText.trim() || !id) return

      // Verificar se a mensagem já existe
      const messageExists = messages.some(
        msg => msg.role === 'user' && msg.content === messageText
      );
      if (messageExists) return;

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: messageText,
        createdAt: new Date().toISOString(),
      }

      setMessagesCallback((prev) => [...prev, userMessage])
      setStatus("streaming")

      // Scroll para o final imediatamente após enviar mensagem
      setTimeout(() => {
        scrollToBottom('smooth');
      }, 100);

      try {
        // Enviar mensagem usando o hook de chat
        const response = await sendChatMessage(messageText, id);

        if (response) {
          const assistantMessage: ChatMessage = {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: response.response,
            createdAt: new Date(response.timestamp).toISOString(),
            metadata: response.metadata,
          }

          // Verificar se a resposta já existe
          const responseExists = messages.some(
            msg => msg.role === 'assistant' && msg.content === response.response
          );
          if (!responseExists) {
            setMessagesCallback((prev) => [...prev, assistantMessage])
          }
          
          // Scroll para o final após receber resposta
          setTimeout(() => {
            scrollToBottom('smooth');
          }, 100);
        }
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        toast.error('Erro ao enviar mensagem. Tente novamente.');
      } finally {
        setStatus("idle")
        // Limpar documentos após enviar mensagem
        clearDocuments()
      }
    },
    [id, sendChatMessage, setMessagesCallback, scrollToBottom, clearDocuments, messages]
  )

  // Função vazia para compatibilidade
  const regenerate = useCallback(() => {}, [])

  // Props simplificadas para chat local
  const inputProps = useMemo(
    () => ({
      chatId: id,
      input,
      setInput: setInputCallback,
      status,
      stop,
      attachments: [],
      setAttachments: () => {},
      messages,
      setMessages: setMessagesCallback,
      sendMessage,
    }),
    [id, input, status, messages, sendMessage, setInputCallback, setMessagesCallback, stop],
  )

  return (
    <div className="flex h-dvh bg-background">
      {/* Chat Area - se adapta ao espaço disponível */}
      <div 
        className={`flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          artifact.isVisible ? 'w-[30%]' : 'w-full'
        }`}
      >
        <ChatHeader
          chatId={id}
          selectedModelId="openai-chat"
        />

        <Messages
          chatId={id}
          status={status}
          messages={messages}
          setMessages={setMessagesCallback}
          regenerate={regenerate}
          isArtifactVisible={artifact.isVisible}
        />

        {/* Separador visual acima do input */}
        <div className="flex-shrink-0 border-t border-border/50 bg-gradient-to-r from-transparent via-border/20 to-transparent" />

        <form
          className={`flex mx-auto px-4 pt-4 bg-background pb-4 md:pb-6 gap-2 transition-all duration-300 ease-in-out ${
            artifact.isVisible ? 'w-full max-w-none' : 'w-full md:max-w-3xl'
          }`}
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <MultimodalInput {...inputProps} />
        </form>
      </div>

      {/* Artifact Area */}
      <Artifact />
      
      {/* Elemento de referência para scroll */}
      <div ref={messagesEndRef} />
    </div>
  )
}
