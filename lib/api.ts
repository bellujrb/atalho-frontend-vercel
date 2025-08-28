import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@/config/api.config';

const api: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '1', 
  },
});

let globalGetToken: (() => Promise<string | null>) | null = null;

export function setGlobalTokenGetter(getToken: () => Promise<string | null>) {
  globalGetToken = getToken;
  console.log('Global token getter set');
}

export async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    if (globalGetToken) {
      console.log('Getting auth headers...');
      const token = await globalGetToken();
      if (token) {
        console.log('Token obtained for headers, length:', token.length);
        return {
          Authorization: `Bearer ${token}`
        };
      } else {
        console.log('No token available for headers');
      }
    } else {
      console.log('No global token getter available');
    }
    return {};
  } catch (error) {
    console.error('Erro ao obter headers de autenticação:', error);
    return {};
  }
}

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      console.log('Request interceptor - URL:', config.url);
      const authHeaders = await getAuthHeaders();
      if (authHeaders.Authorization) {
        config.headers.Authorization = authHeaders.Authorization;
        console.log('Authorization header added to request');
      } else {
        console.log('No authorization header available for request');
      }
    } catch (error) {
      console.error('Erro no interceptor de requisição:', error);
      // Não rejeitar a requisição, apenas logar o erro
    }
    return config;
  },
  (error: any) => {
    console.error('Erro no interceptor de requisição:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: any) => {
    console.log('Response received:', response.status, response.config.url);
    return response;
  },
  async (error: any) => {
    console.error('Response error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data
    });
    
    // Se for erro 401, tentar renovar o token
    if (error.response?.status === 401) {
      console.log('Unauthorized error, token may be expired');
      // Aqui você pode implementar lógica para renovar o token
    }
    
    return Promise.reject(error);
  }
);

export const apiService = {
  get: async <T>(url: string, config: AxiosRequestConfig = {}) => {
    console.log('API GET request:', url);
    return api.get<T>(url, config);
  },
  post: async <T>(url: string, data = {}, config: AxiosRequestConfig = {}) => {
    console.log('API POST request:', url, data);
    return api.post<T>(url, data, config);
  },
  put: async <T>(url: string, data = {}, config: AxiosRequestConfig = {}) => {
    console.log('API PUT request:', url, data);
    return api.put<T>(url, data, config);
  },
  patch: async <T>(url: string, data = {}, config: AxiosRequestConfig = {}) => {
    console.log('API PATCH request:', url, data);
    return api.patch<T>(url, data, config);
  },
  delete: async <T>(url: string, config: AxiosRequestConfig = {}) => {
    console.log('API DELETE request:', url);
    return api.delete<T>(url, config);
  },
};

export default api;
