"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { SidebarToggle } from "@/components/sidebar-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Pagination } from "@/components/ui/pagination"
import { useAutomations } from "@/hooks/automation"
import { AutomationService } from "@/services/automation.service"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Play, Pause, Trash2, Edit, Copy, RefreshCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

type ViewMode = "list" | "grid"

export default function AutomationsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  
  const {
    automations,
    pagination,
    loading,
    error,
    searchTerm,
    statusFilter,
    setSearchTerm,
    setStatusFilter,
    goToPage,
    refreshAutomations,
    deleteAutomation,
    toggleAutomationStatus,
    hasAutomations,
    totalFiltered
  } = useAutomations({ itemsPerPage: 10 })

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as 'all' | 'active' | 'inactive')
  }

  const handleDelete = async (automationId: string) => {
    if (confirm('Tem certeza que deseja excluir esta automação?')) {
      await deleteAutomation(automationId)
    }
  }

  const handleToggleStatus = async (automationId: string, currentStatus: boolean) => {
    await toggleAutomationStatus(automationId, currentStatus)
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen">
        <header className="flex items-center justify-between p-4 border-b bg-background">
          <SidebarToggle />
          <div className="flex-1" />
        </header>
        <main className="flex-1 p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Erro ao carregar automações: {error}
            </AlertDescription>
          </Alert>
          <Button onClick={refreshAutomations} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar novamente
          </Button>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-background">
        <SidebarToggle />
        <div className="flex-1" />
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Buscar automações por nome ou prompt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="inactive">Inativo</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-1 border rounded-md p-1">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="p-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="p-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </Button>
          </div>

          <Button onClick={refreshAutomations} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Results Info */}
        <div className="mb-4 text-sm text-muted-foreground">
          {loading ? (
            "Carregando..."
          ) : (
            `Mostrando ${totalFiltered} de ${pagination.totalItems} automações`
          )}
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-3 h-3 rounded-full" />
                  <Skeleton className="h-6 w-48" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Automations List/Grid */}
        {!loading && (
          <>
            {hasAutomations ? (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {automations.map((automation, index) => (
                  <motion.div
                    key={automation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow"
                  >
                    {viewMode === "list" ? (
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-3 h-3 rounded-full ${AutomationService.getStatusColor(automation.isActive)}`}
                            />
                            <h3 className="font-semibold text-lg">{automation.description}</h3>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="p-1">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <circle cx="12" cy="12" r="1"></circle>
                                  <circle cx="12" cy="5" r="1"></circle>
                                  <circle cx="12" cy="19" r="1"></circle>
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleToggleStatus(automation.id, automation.isActive)}>
                                {automation.isActive ? (
                                  <>
                                    <Pause className="h-4 w-4 mr-2" />
                                    Pausar
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-4 w-4 mr-2" />
                                    Ativar
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicar
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDelete(automation.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          <p className="line-clamp-2">{automation.prompt}</p>
                        </div>

                        <div className="flex gap-2">
                          <span className="text-xs bg-muted px-2 py-1 rounded">
                            {AutomationService.getWeekdayName(automation.weekday)} às {automation.hour}h
                          </span>
                          {automation.repeatCount && (
                            <span className="text-xs bg-muted px-2 py-1 rounded">
                              Repete {automation.repeatCount}x
                            </span>
                          )}
                        </div>

                        <div className="flex gap-6 text-sm">
                          <span>
                            Status: <span className={`font-medium ${automation.isActive ? 'text-green-600' : 'text-gray-600'}`}>
                              {AutomationService.getStatusText(automation.isActive)}
                            </span>
                          </span>
                          <span>
                            Criada: <span className="text-muted-foreground">
                              {new Date(automation.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-3 h-3 rounded-full ${AutomationService.getStatusColor(automation.isActive)}`}
                            />
                            <h3 className="font-semibold text-lg">{automation.description}</h3>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="p-1">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <circle cx="12" cy="12" r="1"></circle>
                                  <circle cx="12" cy="5" r="1"></circle>
                                  <circle cx="12" cy="19" r="1"></circle>
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleToggleStatus(automation.id, automation.isActive)}>
                                {automation.isActive ? (
                                  <>
                                    <Pause className="h-4 w-4 mr-2" />
                                    Pausar
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-4 w-4 mr-2" />
                                    Ativar
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicar
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDelete(automation.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          <p className="line-clamp-3">{automation.prompt}</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs bg-muted px-2 py-1 rounded">
                            {AutomationService.getWeekdayName(automation.weekday)} às {automation.hour}h
                          </span>
                          {automation.repeatCount && (
                            <span className="text-xs bg-muted px-2 py-1 rounded">
                              Repete {automation.repeatCount}x
                            </span>
                          )}
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <span className={`font-medium ${automation.isActive ? 'text-green-600' : 'text-gray-600'}`}>
                              {AutomationService.getStatusText(automation.isActive)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Criada:</span>
                            <span className="text-muted-foreground">
                              {new Date(automation.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== 'all' ? (
                    <>
                      <p className="text-lg font-medium mb-2">Nenhuma automação encontrada</p>
                      <p>Tente ajustar os filtros de busca</p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg font-medium mb-2">Nenhuma automação criada</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Pagination */}
            {hasAutomations && pagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={goToPage}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
