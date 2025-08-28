export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api/proxy',
  ENDPOINTS: {
    COMPANY: {
      REQUEST_ACCESS: 'waiting-list',
    },
    BANK: {
      INTEGRATIONS: 'inter-bank/company',
      CREATE_INTEGRATION: 'inter-bank/credentials',
    },
    CHAT: {
      EXISTS: 'chat-web/{companyId}/exists',
      SEND: 'chat-web/{companyId}/send',
      HISTORY: 'chat-web/{companyId}/history',
    },
  },
  TIMEOUT: 30000, 
} as const;
