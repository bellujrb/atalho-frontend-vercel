import { UpsertCompany, CompanyAPIResponse, PaginationParams } from '@/types/company';
import { apiService } from '../lib/api';

async function create(data: UpsertCompany) {
  
  try {
    const response = await apiService.post<{ id: string; }>("company", data);
    return response;
  } catch (error: any) {
    throw error;
  }
}

async function createCompanyWithChat(data: UpsertCompany) {
  try {
    const companyResponse = await create(data);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return companyResponse;
  } catch (error) {
    console.error('Erro ao criar empresa com chat:', error);
    throw error;
  }
}

async function findMany(paginationParams: PaginationParams = {}) {
  const { p = 1, itemsPerPage = 9 } = paginationParams;
  const queryUrl = buildQueryUrl({ 
    p: p.toString(), 
    itemsPerPage: itemsPerPage.toString() 
  });
  const url = `company${queryUrl}`;
  
  try {
    const response = await apiService.get<CompanyAPIResponse>(url);
    
    if (!response || !response.data) {
      throw new Error('API response is empty or invalid');
    }
    
    if (!response.data.companies || !Array.isArray(response.data.companies)) {
      return {
        companies: [],
        pagination: {
          currentPage: p,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage
        }
      };
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
}

function buildQueryUrl(searchParams: Record<string, string | null | undefined>) {
  let queryUrl = "?";
  
  for (let key in searchParams) {
    const value = searchParams[key];
    if (value !== null && value !== undefined) {
      queryUrl += `${key}=${value}&`;
    }
  }
  
  return queryUrl;
}

const companyService = {
  create,
  createCompanyWithChat,
  findMany,
};

export default companyService;
