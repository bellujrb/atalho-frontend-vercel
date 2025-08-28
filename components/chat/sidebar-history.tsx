"use client"

import { useParams } from "next/navigation"
import { SidebarGroup, SidebarGroupContent, SidebarMenu, useSidebar } from "@/components/ui/sidebar"
import { ChatItem } from "./sidebar-history-item"
import { useChat } from "@/hooks/use-chat"
import { useMemo, useCallback, memo } from "react"

// Memoizar o componente principal para evitar re-renders desnecessários
const SidebarHistoryMemo = memo(function SidebarHistory() {
  const { setOpenMobile } = useSidebar()
  const { id } = useParams()
  const { chats, isLoading, deleteChat, selectChat, selectedCompany } = useChat()

  const handleDeleteChat = useCallback((chatId: string) => {
    try {
      deleteChat(chatId)
    } catch (error) {
    }
  }, [deleteChat])

  const groupedChats = useMemo(() => {
    if (!chats.length) return {
      today: [],
      yesterday: [],
      lastWeek: [],
      lastMonth: [],
      older: []
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    return {
      today: chats.filter((chat) => 
        new Date(chat.lastActivity).getTime() >= today.getTime()
      ),
      yesterday: chats.filter((chat) => {
        const chatDate = new Date(chat.lastActivity)
        return chatDate.getTime() >= yesterday.getTime() && chatDate.getTime() < today.getTime()
      }),
      lastWeek: chats.filter((chat) => {
        const chatDate = new Date(chat.lastActivity)
        return chatDate.getTime() >= weekAgo.getTime() && chatDate.getTime() < yesterday.getTime()
      }),
      lastMonth: chats.filter((chat) => {
        const chatDate = new Date(chat.lastActivity)
        return chatDate.getTime() >= monthAgo.getTime() && chatDate.getTime() < weekAgo.getTime()
      }),
      older: chats.filter((chat) => {
        const chatDate = new Date(chat.lastActivity)
        return chatDate.getTime() < monthAgo.getTime()
      }),
    }
  }, [chats])

  // Se não há empresa selecionada, mostrar mensagem
  if (!selectedCompany) {
    return (
      <div className="p-4 text-sm text-muted-foreground text-center">
        Selecione uma empresa para ver os chats
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col p-4 space-y-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Lista de chats */}
      {groupedChats.today.length > 0 && (
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {groupedChats.today.map((chat) => (
                <ChatItem 
                  key={chat.id} 
                  chat={chat} 
                  isActive={id === chat.id} 
                  onDelete={() => handleDeleteChat(chat.id)}
                  setOpenMobile={setOpenMobile}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}

      {groupedChats.yesterday.length > 0 && (
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {groupedChats.yesterday.map((chat) => (
                <ChatItem 
                  key={chat.id} 
                  chat={chat} 
                  isActive={id === chat.id} 
                  onDelete={() => handleDeleteChat(chat.id)}
                  setOpenMobile={setOpenMobile}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}

      {groupedChats.lastWeek.length > 0 && (
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {groupedChats.lastWeek.map((chat) => (
                <ChatItem 
                  key={chat.id} 
                  chat={chat} 
                  isActive={id === chat.id} 
                  onDelete={() => handleDeleteChat(chat.id)}
                  setOpenMobile={setOpenMobile}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}

      {groupedChats.lastMonth.length > 0 && (
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {groupedChats.lastMonth.map((chat) => (
                <ChatItem 
                  key={chat.id} 
                  chat={chat} 
                  isActive={id === chat.id} 
                  onDelete={() => handleDeleteChat(chat.id)}
                  setOpenMobile={setOpenMobile}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}

      {groupedChats.older.length > 0 && (
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {groupedChats.older.map((chat) => (
                <ChatItem 
                  key={chat.id} 
                  chat={chat} 
                  isActive={id === chat.id} 
                  onDelete={() => handleDeleteChat(chat.id)}
                  setOpenMobile={setOpenMobile}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}

      {chats.length === 0 && (
        <div className="p-4 text-sm text-muted-foreground text-center">
          Nenhum chat encontrado.
        </div>
      )}
    </div>
  )
})

// Exportar o componente memoizado
export { SidebarHistoryMemo as SidebarHistory }
