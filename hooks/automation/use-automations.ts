import { useState, useEffect, useCallback } from 'react'
import { useSelectedCompany } from '@/hooks/companies/use-selected-company'
import { AutomationService, Automation, AutomationListResponse } from '@/services/automation.service'
import { toast } from 'sonner'

interface UseAutomationsOptions {
  initialPage?: number
  itemsPerPage?: number
}

export function useAutomations(options: UseAutomationsOptions = {}) {
  const { selectedCompany } = useSelectedCompany()
  
  const [automations, setAutomations] = useState<Automation[]>([])
  const [pagination, setPagination] = useState({
    currentPage: options.initialPage || 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: options.itemsPerPage || 10
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')

  const fetchAutomations = useCallback(async (page: number = 1) => {
    if (!selectedCompany?.id) return

    setLoading(true)
    setError(null)

    try {
      const response: AutomationListResponse = await AutomationService.listAutomations(
        selectedCompany.id,
        page,
        pagination.itemsPerPage
      )

      setAutomations(response.data)
      setPagination(prev => ({
        ...prev,
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        totalItems: response.pagination.totalItems
      }))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar automações'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [selectedCompany?.id, pagination.itemsPerPage])

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchAutomations(page)
    }
  }, [fetchAutomations, pagination.totalPages])

  const refreshAutomations = useCallback(() => {
    fetchAutomations(pagination.currentPage)
  }, [fetchAutomations, pagination.currentPage])

  const deleteAutomation = useCallback(async (automationId: string) => {
    if (!selectedCompany?.id) return

    try {
      await AutomationService.deleteAutomation(selectedCompany.id, automationId)
      toast.success('Automação excluída com sucesso')
      refreshAutomations()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir automação'
      toast.error(errorMessage)
    }
  }, [selectedCompany?.id, refreshAutomations])

  const toggleAutomationStatus = useCallback(async (automationId: string, currentStatus: boolean) => {
    if (!selectedCompany?.id) return

    try {
      await AutomationService.updateAutomation(selectedCompany.id, automationId, {
        isActive: !currentStatus
      })
      toast.success(`Automação ${currentStatus ? 'pausada' : 'ativada'} com sucesso`)
      refreshAutomations()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao alterar status da automação'
      toast.error(errorMessage)
    }
  }, [selectedCompany?.id, refreshAutomations])

  // Filtrar automações baseado no termo de busca e filtro de status
  const filteredAutomations = automations.filter(automation => {
    const matchesSearch = automation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         automation.prompt.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && automation.isActive) ||
                         (statusFilter === 'inactive' && !automation.isActive)
    
    return matchesSearch && matchesStatus
  })

  // Carregar automações quando a empresa for selecionada
  useEffect(() => {
    if (selectedCompany?.id) {
      fetchAutomations(1)
    }
  }, [selectedCompany?.id, fetchAutomations])

  return {
    // Estado
    automations: filteredAutomations,
    pagination,
    loading,
    error,
    searchTerm,
    statusFilter,
    
    // Ações
    setSearchTerm,
    setStatusFilter,
    goToPage,
    refreshAutomations,
    deleteAutomation,
    toggleAutomationStatus,
    
    // Utilitários
    hasAutomations: automations.length > 0,
    totalFiltered: filteredAutomations.length
  }
}
