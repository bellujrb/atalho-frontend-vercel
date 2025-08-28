import { apiService } from '../lib/api';
import type { 
  Chat, 
  ChatListResponse, 
  CreateChatResponse,
  SendMessageRequest, 
  SendMessageResponse, 
  ChatHistoryResponse,
  DeleteChatRequest,
  DeleteChatResponse
} from '../types/chat';

class ChatService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  }

  async getChats(companyId: string): Promise<ChatListResponse> {
    try {
      interface BackendChatResponse {
        success: boolean;
        data: {
          chats: Array<{
            chatId: string;
            totalMessages: number;
            lastActivity: string;
            lastMessage?: string;
          }>;
          totalChats: number;
          timestamp: string;
        };
      }

      const response = await apiService.get<BackendChatResponse>(`chat/${companyId}`);
      
      const mappedChats = response.data.data.chats.map(chat => ({
        id: chat.chatId,
        title: `Chat ${chat.chatId.slice(0, 8)}`, 
        createdAt: new Date(chat.lastActivity), 
        lastMessage: chat.lastMessage,
        lastActivity: new Date(chat.lastActivity),
        totalMessages: chat.totalMessages,
        companyId: companyId,
      }));

      return {
        success: true,
        data: {
          chats: mappedChats,
          totalChats: response.data.data.totalChats,
          timestamp: response.data.data.timestamp,
        },
      };
    } catch (error) {
      console.error('Erro ao buscar chats:', error);
      throw error;
    }
  }

  async createChat(companyId: string): Promise<CreateChatResponse> {
    try {
      const response = await apiService.post<CreateChatResponse>(`chat/${companyId}`, {
        companyId 
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar chat:', error);
      throw error;
    }
  }

  async sendMessage(companyId: string, chatId: string, message: string): Promise<SendMessageResponse> {
    try {
      const requestBody: SendMessageRequest = { message, chatId };
      const response = await apiService.post<SendMessageResponse>(`chat/${companyId}/${chatId}/send`, requestBody);
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  }

  async getChatHistory(companyId: string, chatId: string): Promise<ChatHistoryResponse> {
    try {
      interface BackendMessageResponse {
        success: boolean;
        data: {
          messages: Array<{
            id: string;
            role: string;
            content: string;
            createdAt: string;
          }>;
          chatId: string;
          totalMessages: number;
        };
      }

      const response = await apiService.get<BackendMessageResponse>(`chat/${companyId}/${chatId}/history`);
      
      const mappedMessages = response.data.data.messages.map(message => ({
        id: message.id,
        type: message.role as "user" | "assistant", 
        content: message.content,
        timestamp: new Date(message.createdAt), 
      }));

      return {
        success: true,
        data: {
          messages: mappedMessages,
          chatId: response.data.data.chatId,
          totalMessages: response.data.data.totalMessages,
        },
      };
    } catch (error) {
      console.error('Erro ao buscar histórico do chat:', error);
      throw error;
    }
  }

  async deleteChat(companyId: string, chatId: string): Promise<DeleteChatResponse> {
    try {
      const requestBody: DeleteChatRequest = { chatId };
      const response = await apiService.post<DeleteChatResponse>(`chat/${companyId}/delete`, requestBody);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar chat:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService();
export default chatService;
