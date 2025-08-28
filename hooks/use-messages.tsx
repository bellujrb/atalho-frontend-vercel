import { useState, useEffect, useMemo } from 'react';
import { useScrollToBottom } from './use-scroll-to-bottom';
import type { ChatMessage } from '@/lib/types';

export function useMessages({
  chatId,
  status,
  messages,
}: {
  chatId: string;
  status: 'idle' | 'streaming';
  messages: ChatMessage[];
}) {
  const {
    containerRef,
    endRef,
    isAtBottom,
    autoScroll,
    scrollToBottom,
    scrollToBottomInstant,
    autoScrollToBottom,
    forceScrollToBottom,
    onViewportEnter,
    onViewportLeave,
    setAutoScroll,
  } = useScrollToBottom();

  const [hasSentMessage, setHasSentMessage] = useState(false);

  // Reset quando mudar de chat
  useEffect(() => {
    if (chatId) {
      setHasSentMessage(false);
      // Scroll instantâneo para o final ao carregar novo chat
      // Usar um delay menor e múltiplas tentativas para garantir que funcione
      const scrollToBottom = () => {
        forceScrollToBottom('instant');
      };
      
      // Primeira tentativa imediata
      scrollToBottom();
      
      // Segunda tentativa com delay pequeno
      const timer1 = setTimeout(scrollToBottom, 50);
      
      // Terceira tentativa com delay maior para garantir que o DOM foi renderizado
      const timer2 = setTimeout(scrollToBottom, 200);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [chatId, forceScrollToBottom]);

  // Scroll automático quando começar a streamar
  useEffect(() => {
    if (status === 'streaming') {
      setHasSentMessage(true);
      // Scroll suave para baixo quando começar a responder
      autoScrollToBottom('smooth');
    }
  }, [status, autoScrollToBottom]);

  // Scroll automático quando terminar de streamar
  useEffect(() => {
    if (status === 'idle' && hasSentMessage) {
      // Scroll suave para o final quando a resposta terminar
      autoScrollToBottom('smooth');
    }
  }, [status, hasSentMessage, autoScrollToBottom]);

  // Scroll automático quando as mensagens mudarem (para casos de carregamento assíncrono)
  useEffect(() => {
    if (messages.length > 0 && chatId && autoScroll) {
      // Garantir que o scroll vai para o final quando as mensagens são carregadas
      const timer = setTimeout(() => {
        autoScrollToBottom('instant');
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [messages.length, chatId, autoScroll, autoScrollToBottom]);

  // Garantir que o chat sempre comece no final quando carregar
  useEffect(() => {
    if (chatId && messages.length > 0) {
      // Forçar scroll para o final sempre que o chat for carregado
      const timer = setTimeout(() => {
        forceScrollToBottom('instant');
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [chatId, messages.length, forceScrollToBottom]);

  // Memoizar o retorno para evitar re-renders
  const result = useMemo(() => ({
    containerRef,
    endRef,
    isAtBottom,
    autoScroll,
    scrollToBottom,
    scrollToBottomInstant,
    autoScrollToBottom,
    forceScrollToBottom,
    onViewportEnter,
    onViewportLeave,
    hasSentMessage,
    setAutoScroll,
  }), [
    containerRef, 
    endRef, 
    isAtBottom, 
    autoScroll, 
    scrollToBottom, 
    scrollToBottomInstant, 
    autoScrollToBottom, 
    forceScrollToBottom, 
    onViewportEnter, 
    onViewportLeave, 
    hasSentMessage, 
    setAutoScroll
  ]);

  return result;
}
