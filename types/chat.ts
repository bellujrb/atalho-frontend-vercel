import type { MessageFunctionMetadata } from '@/lib/types';

export interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  thoughts?: ChatThought[]
}

export interface Chat {
  id: string
  title: string
  createdAt: Date
  lastMessage?: string
  lastActivity: Date
  totalMessages: number
  companyId: string
}

export interface ChatListResponse {
  success: boolean
  data: {
    chats: Chat[]
    totalChats: number
    timestamp: string
  }
}

export interface CreateChatResponse {
  success: boolean
  data: {
    chat: Chat
    message: string
    timestamp: string
  }
}

export interface SendMessageRequest {
  message: string
  chatId: string
}

export interface SendMessageResponse {
  success: boolean
  data: {
    response: string
    chatId: string
    timestamp: string
    metadata?: MessageFunctionMetadata
  }
}

export interface ChatHistoryResponse {
  success: boolean
  data: {
    messages: Message[]
    chatId: string
    totalMessages: number
  }
}

export interface DeleteChatRequest {
  chatId: string
}

export interface DeleteChatResponse {
  success: boolean
  data: {
    message: string
    timestamp: string
  }
}

export interface ProcessingStep {
  id: string
  text: string
  completed: boolean
  duration?: number
}

export interface TableRow {
  [key: string]: string | number
}

export interface AttachedData {
  id: string
  type: "table-row" | "full-table"
  data: any
  displayText: string
  tableName?: string
}

export interface Table {
  id: string
  name: string
  headers: string[]
  data: any[]
  description: string
}

export interface FunctionExecution {
  id: string
  functionName: string
  parameters: Record<string, any>
  result: any
  timestamp: Date
  status: "success" | "error"
  executionTime: number
}

export interface ChatThought {
  id: string
  content: string
  type: "thinking" | "action" | "result"
  completed: boolean
  timestamp: Date
  thoughtDetail?: string
  data?: any
}
