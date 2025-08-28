import { useState, useCallback, useEffect, useRef } from 'react';
import { CompanyListItem, UpsertCompany, PaginationParams, PaginationInfo } from '@/types/company';
import companyService from '@/services/company.service';
import { toast } from 'sonner'
import { useSelectedCompany } from '@/hooks/companies/use-selected-company';

export function useCompanies() {
  const [companies, setCompanies] = useState<CompanyListItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 9
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectCompany: selectCompanyInHook } = useSelectedCompany();
  
  const toastRef = useRef(toast);

  const fetchCompanies = useCallback(async (paginationParams?: PaginationParams) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await companyService.findMany(paginationParams);
      
      if (!response || !response.companies || !Array.isArray(response.companies)) {
        throw new Error('Resposta da API inválida');
      }
      
      const transformedCompanies: CompanyListItem[] = response.companies.map(company => ({
        id: company.id,
        name: company.name.toLowerCase().replace(/\s+/g, '-'),
        displayName: company.name,
        taxId: company.taxId,
        erpType: company.erpType,
      }));

      setCompanies(transformedCompanies);
      setPagination(response.pagination);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar empresas';
      setError(errorMessage);
      toastRef.current.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []); 

  useEffect(() => {
    fetchCompanies();
  }, []); 

  const createCompany = useCallback(async (data: UpsertCompany) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await companyService.createCompanyWithChat(data);
      
      toastRef.current.success("Empresa criada com sucesso! Chat inicializado automaticamente.");

      await fetchCompanies({ p: 1, itemsPerPage: pagination.itemsPerPage });

      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar empresa';
      setError(errorMessage);
      toastRef.current.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [pagination.itemsPerPage]);

  const selectCompany = useCallback((companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    if (company) {
      selectCompanyInHook(company);
      
      toastRef.current.success("Empresa selecionada com sucesso!");
    }
  }, [companies, selectCompanyInHook]);

  const goToPage = useCallback(async (page: number) => {
    await fetchCompanies({ p: page, itemsPerPage: pagination.itemsPerPage });
  }, [pagination.itemsPerPage]); 

  return {
    companies,
    pagination,
    isLoading,
    error,
    fetchCompanies,
    createCompany,
    selectCompany,
    goToPage,
  };
}
