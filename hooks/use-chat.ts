import { useState, useCallback, useEffect, useRef } from 'react';
import { chatService } from '@/services/chat.service';
import { useSelectedCompany } from '@/hooks/companies/use-selected-company';
import { toast } from 'sonner';
import type { Chat, Message } from '@/types/chat';

export function useChat() {
  const { selectedCompany } = useSelectedCompany();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Usar ref para evitar dependência circular
  const selectedCompanyIdRef = useRef<string | undefined>(selectedCompany?.id);
  selectedCompanyIdRef.current = selectedCompany?.id;

  const loadChats = useCallback(async () => {
    const companyId = selectedCompanyIdRef.current;
    if (!companyId) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await chatService.getChats(companyId);
      setChats(response.data.chats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar chats';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []); // Remover dependências para evitar recriação

  const createChat = useCallback(async (name: string) => {
    const companyId = selectedCompanyIdRef.current;
    if (!companyId) {
      toast.error('Nenhuma empresa selecionada');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await chatService.createChat(companyId);
      const newChat = response.data.chat;
      
      setChats(prev => [newChat, ...prev]);
      setCurrentChat(newChat);
      setMessages([]);
      
      toast.success('Chat criado com sucesso');
      return newChat;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar chat';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []); // Remover dependências

  const sendMessage = useCallback(async (message: string, chatId?: string) => {
    const targetChatId = chatId || currentChat?.id;
    const companyId = selectedCompanyIdRef.current;
    
    if (!targetChatId || !companyId) {
      toast.error('Nenhum chat selecionado ou empresa não encontrada');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await chatService.sendMessage(companyId, targetChatId, message);
      
      // Atualizar a lista de chats para refletir a última mensagem
      await loadChats();
      
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao enviar mensagem';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentChat?.id, loadChats]); // Manter apenas dependências essenciais

  const loadChatHistory = useCallback(async (chatId: string) => {
    const companyId = selectedCompanyIdRef.current;
    if (!companyId) return null;

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await chatService.getChatHistory(companyId, chatId);
      setMessages(response.data.messages);
      
      // Encontrar e definir o chat atual
      setCurrentChat(prev => {
        const chat = chats.find(c => c.id === chatId);
        return chat || prev;
      });
      
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar histórico';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [chats]); // Manter apenas chats como dependência

  const deleteChat = useCallback(async (chatId: string) => {
    const companyId = selectedCompanyIdRef.current;
    if (!companyId) return;

    try {
      setIsLoading(true);
      setError(null);
      
      await chatService.deleteChat(companyId, chatId);
      
      // Remover o chat da lista
      setChats(prev => prev.filter(chat => chat.id !== chatId));
      
      // Se o chat deletado era o atual, limpar o estado
      if (currentChat?.id === chatId) {
        setCurrentChat(null);
        setMessages([]);
      }
      
      toast.success('Chat deletado com sucesso');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar chat';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [currentChat?.id]); // Manter apenas currentChat como dependência

  const selectChat = useCallback((chat: Chat) => {
    setCurrentChat(chat);
    loadChatHistory(chat.id);
  }, [loadChatHistory]);

  // Carregar chats quando a empresa é selecionada
  useEffect(() => {
    if (selectedCompany?.id) {
      loadChats();
    }
  }, [selectedCompany?.id]); // Remover loadChats da dependência

  return {
    isLoading,
    error,
    chats,
    currentChat,
    messages,
    loadChats,
    createChat,
    sendMessage,
    loadChatHistory,
    deleteChat,
    selectChat,
    selectedCompany,
  };
}
