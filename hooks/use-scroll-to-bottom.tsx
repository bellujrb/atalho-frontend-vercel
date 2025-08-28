import { useRef, useEffect, useCallback, useState, useMemo } from 'react';

type ScrollFlag = ScrollBehavior | false;

export function useScrollToBottom() {
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [shouldScroll, setShouldScroll] = useState<ScrollFlag>(false);
  const [autoScroll, setAutoScroll] = useState(true);

  // Função para verificar se está no final da lista
  const checkIfAtBottom = useCallback(() => {
    if (!containerRef.current) return false;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const threshold = 100; // Tolerância de 100px para considerar "no final"
    return scrollHeight - scrollTop - clientHeight < threshold;
  }, []);

  // Função para scroll suave para o final
  const scrollToBottom = useCallback(
    (scrollBehavior: ScrollBehavior = 'smooth') => {
      if (endRef.current) {
        endRef.current.scrollIntoView({ 
          behavior: scrollBehavior,
          block: 'end',
          inline: 'nearest'
        });
      }
    },
    [],
  );

  // Função para scroll instantâneo para o final
  const scrollToBottomInstant = useCallback(() => {
    if (endRef.current && containerRef.current) {
      // Usar scrollTop diretamente para scroll instantâneo mais confiável
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
      
      // Forçar um reflow para garantir que o scroll seja aplicado
      containerRef.current.offsetHeight;
      
      // Tentar novamente com scrollIntoView como fallback
      setTimeout(() => {
        if (endRef.current) {
          endRef.current.scrollIntoView({ 
            behavior: 'instant',
            block: 'end',
            inline: 'nearest'
          });
        }
      }, 10);
    }
  }, []);

  // Função para scroll automático baseado no comportamento
  const autoScrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (autoScroll) {
      if (behavior === 'instant') {
        scrollToBottomInstant();
      } else {
        scrollToBottom(behavior);
      }
    }
  }, [autoScroll, scrollToBottom, scrollToBottomInstant]);

  // Função para forçar scroll para o final
  const forceScrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (behavior === 'instant') {
      scrollToBottomInstant();
    } else {
      scrollToBottom(behavior);
    }
  }, [scrollToBottom, scrollToBottomInstant]);

  // Verificar se está no final quando o scroll acontece
  const handleScroll = useCallback(() => {
    const atBottom = checkIfAtBottom();
    setIsAtBottom(atBottom);
    
    // Se o usuário fez scroll manual para cima, desabilitar auto-scroll
    if (!atBottom && autoScroll) {
      setAutoScroll(false);
    }
  }, [checkIfAtBottom, autoScroll]);

  // Reabilitar auto-scroll quando chegar ao final
  const onViewportEnter = useCallback(() => {
    setIsAtBottom(true);
    setAutoScroll(true);
  }, []);

  const onViewportLeave = useCallback(() => {
    setIsAtBottom(false);
  }, []);

  // Adicionar listener de scroll
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Executar scroll quando solicitado
  useEffect(() => {
    if (shouldScroll && endRef.current) {
      if (shouldScroll === 'instant') {
        scrollToBottomInstant();
      } else {
        scrollToBottom(shouldScroll);
      }
      setShouldScroll(false);
    }
  }, [shouldScroll, scrollToBottom, scrollToBottomInstant]);

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
    setAutoScroll,
  }), [
    isAtBottom, 
    autoScroll, 
    scrollToBottom, 
    scrollToBottomInstant, 
    autoScrollToBottom, 
    forceScrollToBottom, 
    onViewportEnter, 
    onViewportLeave
  ]);

  return result;
}
