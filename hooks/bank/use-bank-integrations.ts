import { useState, useCallback } from 'react';
import { BankIntegrationInput, BankIntegrationListItem } from '@/types/bank';
import bankService from '@/services/bank.service';
import { toast } from 'sonner'
import { useSelectedCompany } from '@/hooks/companies/use-selected-company';

export function useBankIntegrations() {
  const [integrations, setIntegrations] = useState<BankIntegrationListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedCompany } = useSelectedCompany();

  const fetchIntegrations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!selectedCompany?.id) {
        throw new Error('Nenhuma empresa selecionada');
      }

      const response = await bankService.findIntegrations(selectedCompany.id);
            
      if (!Array.isArray(response)) {
        setIntegrations([]);
        return;
      }
      
      const transformedIntegrations: BankIntegrationListItem[] = response.map(integration => ({
        id: integration.id,
        bankName: 'Inter',
        conta: integration.accountNumber,
        pix: integration.pixKey,
      }));

      setIntegrations(transformedIntegrations);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar integrações bancárias';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCompany, toast]);

  const createIntegration = useCallback(async (data: BankIntegrationInput) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!selectedCompany?.id) {
        throw new Error('Nenhuma empresa selecionada');
      }

      const response = await bankService.createIntegration(data, selectedCompany.id);
      
      const newIntegration: BankIntegrationListItem = {
        id: response.id,
        bankName: 'Inter',
        conta: data.accountNumber,
        pix: data.pixKey,
      };

      setIntegrations(prev => [...prev, newIntegration]);
      
      toast.success("Integração bancária criada com sucesso!");

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar integração bancária';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedCompany, toast]);

  const deleteIntegration = useCallback(async (integrationId: string) => {
    try {
      setIntegrations(prev => prev.filter(integration => integration.id !== integrationId));
      
      toast.success("Integração bancária removida com sucesso!");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover integração bancária';
      toast.error(errorMessage);
    }
  }, [toast]);

  return {
    integrations,
    isLoading,
    error,
    fetchIntegrations,
    createIntegration,
    deleteIntegration,
  };
}
