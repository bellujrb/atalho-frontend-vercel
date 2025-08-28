import api from '@/lib/api'

export interface Automation {
  id: string
  description: string
  prompt: string
  weekday: number
  hour: number
  repeatCount?: number
  isActive: boolean
  createdAt: string
}

export interface AutomationListResponse {
  data: Automation[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}

export interface CreateAutomationData {
  description: string
  prompt: string
  weekday: number
  hour: number
  repeatCount?: number
}

export interface UpdateAutomationData {
  description?: string
  prompt?: string
  weekday?: number
  hour?: number
  repeatCount?: number
  isActive?: boolean
}

export class AutomationService {
  static async listAutomations(
    companyId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<AutomationListResponse> {
    const response = await api.get(`/automation/${companyId}`, {
      params: { page, limit }
    })
    return response.data
  }

  static async createAutomation(
    companyId: string,
    data: CreateAutomationData
  ): Promise<Automation> {
    const response = await api.post(`/automation/${companyId}`, data)
    return response.data
  }

  static async updateAutomation(
    companyId: string,
    automationId: string,
    data: UpdateAutomationData
  ): Promise<Automation> {
    const response = await api.patch(`/automation/${companyId}/${automationId}`, data)
    return response.data
  }

  static async deleteAutomation(
    companyId: string,
    automationId: string
  ): Promise<void> {
    await api.delete(`/automation/${companyId}/${automationId}`)
  }

  static getWeekdayName(weekday: number): string {
    const weekdays = [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado'
    ]
    return weekdays[weekday] || 'Desconhecido'
  }

  static getStatusText(isActive: boolean): string {
    return isActive ? 'Ativo' : 'Inativo'
  }

  static getStatusColor(isActive: boolean): string {
    return isActive ? 'bg-green-500' : 'bg-gray-400'
  }
}
