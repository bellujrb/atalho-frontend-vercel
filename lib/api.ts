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
}

export async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    if (globalGetToken) {
      const token = await globalGetToken();
      if (token) {
        return {
          Authorization: `Bearer ${token}`
        };
      }
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
      const authHeaders = await getAuthHeaders();
      if (authHeaders.Authorization) {
        config.headers.Authorization = authHeaders.Authorization;
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
    return response;
  },
  async (error: any) => {
    console.error('Erro no interceptor de resposta:', error);
    return Promise.reject(error);
  }
);

export const apiService = {
  get: async <T>(url: string, config: AxiosRequestConfig = {}) => {
    return api.get<T>(url, config);
  },
  post: async <T>(url: string, data = {}, config: AxiosRequestConfig = {}) => {
    return api.post<T>(url, data, config);
  },
  put: async <T>(url: string, data = {}, config: AxiosRequestConfig = {}) => {
    return api.put<T>(url, data, config);
  },
  patch: async <T>(url: string, data = {}, config: AxiosRequestConfig = {}) => {
    return api.patch<T>(url, data, config);
  },
  delete: async <T>(url: string, config: AxiosRequestConfig = {}) => {
    return api.delete<T>(url, config);
  },
};

export default api;
