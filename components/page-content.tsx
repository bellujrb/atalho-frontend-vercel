"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowUp, Sparkles } from "lucide-react"
import { SidebarToggle } from "@/components/sidebar-toggle"
import { SidebarLayout } from "@/components/sidebar-layout"
import { chatService } from "@/services/chat.service"
import { useSelectedCompany } from "@/hooks/companies/use-selected-company"
import { toast } from "@/components/ui/use-toast"
import { AppLayoutSkeleton } from "@/components/skeletons/app-layout-skeleton"
import { AuthDebug } from "@/components/auth-debug"

export function PageContent() {
  const [showBetaBanner, setShowBetaBanner] = useState(true)
  const [showFeedbackPopover, setShowFeedbackPopover] = useState(false)
  const [feedbackText, setFeedbackText] = useState("")
  const [inputValue, setInputValue] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const lastSubmissionTime = useRef<number>(0)
  
  const router = useRouter()
  const { selectedCompany } = useSelectedCompany()

  useEffect(() => {
    // Simular um tempo de carregamento para mostrar o skeleton
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async () => {
    const now = Date.now()
    if (now - lastSubmissionTime.current < 1000) return
    
    if (!inputValue.trim() || isSubmitting) return
    
    if (!selectedCompany) {
      toast({
        title: "Erro",
        description: "Selecione uma empresa primeiro",
        variant: "destructive",
      })
      return
    }
    
    setIsSubmitting(true)
    lastSubmissionTime.current = now
    
    try {
      const createChatResponse = await chatService.createChat(selectedCompany.id)
      
      if (createChatResponse.success && createChatResponse.data.chat) {
        const chatId = createChatResponse.data.chat.id
        
        await chatService.sendMessage(selectedCompany.id, chatId, inputValue.trim())
        
        setInputValue("")
        
        router.push(`/chat/${chatId}`)
      } else {
        throw new Error("Falha ao criar chat")
      }
    } catch (error) {
      console.error('Erro ao criar chat:', error)
      toast({
        title: "Erro",
        description: "Não foi possível criar o chat. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Previne o envio se estiver submetendo ou se a tecla Shift estiver pressionada
    if (e.key === 'Enter' && !e.shiftKey && !isSubmitting) {
      e.preventDefault()
      e.stopPropagation()
      handleSubmit()
    }
  }

  const handleFeedbackSubmit = async () => {
    if (!feedbackText.trim()) return
    
    setIsSubmitting(true)
    
    setTimeout(() => {
      setFeedbackText("")
      setShowFeedbackPopover(false)
      setIsSubmitting(false)
    }, 1000)
  }

  if (isLoading) {
    return <AppLayoutSkeleton />
  }

  return (
    <SidebarLayout>
      <div className="flex flex-col min-h-screen bg-background">
        <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2 border-b border-border/40">
          <SidebarToggle />
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 max-w-5xl mx-auto">
          {/* Main Heading */}
          <div className="text-center mb-8 md:mb-16">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 px-4">
              Como posso ajudar na sua gestão financeira hoje?
            </h1>
          </div>

          {/* Input Section */}
          <div className="w-full max-w-4xl mb-8 md:mb-12 relative px-4">
            <div className="border border-gray-300 focus-within:border-gray-400 rounded-xl bg-white shadow-sm overflow-hidden">
              {/* Textarea Section */}
              <div className="p-4 md:p-6 pb-0">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Peça ao Fin para automatizar..."
                  className="min-h-16 max-h-48 text-base md:text-lg border-0 focus:ring-0 focus:outline-none resize-none overflow-y-auto p-0 bg-transparent"
                  rows={1}
                  disabled={isSubmitting}
                  style={{
                    height: "auto",
                    minHeight: "64px",
                  }}
                  onKeyDown={handleKeyDown}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement
                    target.style.height = "auto"
                    target.style.height = Math.min(target.scrollHeight, 192) + "px"
                  }}
                />
              </div>

              {/* Icons Section */}
              <div className="flex items-center justify-between p-4 pt-2">
                <div className="flex items-center gap-2 md:gap-3">
                  <Button size="sm" variant="ghost" className="text-teal-600 hover:text-teal-700 p-2 md:p-2">
                    <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="ml-1 md:ml-2 text-xs md:text-sm font-medium">Fin-1</span>
                  </Button>
                </div>

                <Button
                  size="sm"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 md:p-2"
                  disabled={!inputValue.trim() || isSubmitting}
                  onClick={handleSubmit}
                  type="button"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ArrowUp className="w-4 h-4 md:w-5 md:h-5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Beta Banner */}
            {showBetaBanner && (
              <div className="mt-4 md:mt-6 p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <span className="text-xs md:text-sm text-gray-700">
                  Atalho está em Fase Beta! Seu feedback será muito importante para melhorarmos a plataforma
                </span>
                <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
                  <Popover open={showFeedbackPopover} onOpenChange={setShowFeedbackPopover}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-500 text-green-700 hover:bg-green-50 bg-transparent text-xs md:text-sm flex-1 md:flex-none"
                      >
                        Feedback
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 text-sm">Envie seu feedback</h3>
                        <p className="text-xs text-gray-600">
                          Sua opinião é muito importante para melhorarmos o Atalho!
                        </p>
                        <Textarea
                          placeholder="Como podemos melhorar a plataforma?"
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          className="min-h-[100px] resize-none"
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowFeedbackPopover(false)}
                            className="text-gray-500"
                          >
                            Cancelar
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleFeedbackSubmit}
                            disabled={!feedbackText.trim() || isSubmitting}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Enviar
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>

          {/* Auth Debug Component - Temporary */}
          <div className="w-full max-w-4xl px-4">
            <AuthDebug />
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}
