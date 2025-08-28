import { BankIntegration, BankIntegrationInput, BankIntegrationAPIResponse } from '@/types/bank';
import { apiService } from '../lib/api';
import { API_CONFIG } from '@/config/api.config';

function createIntegration(data: BankIntegrationInput, companyId: string): Promise<any> {
  const formData = new FormData();
  formData.append('pixKey', data.pixKey);
  formData.append('accountNumber', data.accountNumber);
  formData.append('clientId', data.clientId);
  formData.append('clientSecret', data.clientSecret);
  formData.append('companyId', companyId);
  
  if (data.certification) {
    formData.append('certification', data.certification);
  }
  
  if (data.key) {
    formData.append('key', data.key);
  }

  return apiService.post(API_CONFIG.ENDPOINTS.BANK.CREATE_INTEGRATION, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

async function findIntegrations(companyId: string, searchParams: Record<string, string> = {}): Promise<BankIntegrationAPIResponse> {
  const queryUrl = buildQueryUrl(searchParams);
  const url = `${API_CONFIG.ENDPOINTS.BANK.INTEGRATIONS}/${companyId}${queryUrl}`;
  
  const response = await apiService.get<BankIntegrationAPIResponse>(url);
  return response.data;
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

const bankService = {
  createIntegration,
  findIntegrations,
};

export default bankService;
