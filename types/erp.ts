export type ERPType = 'omie' | 'granatum';

export interface ERPCredentials {
  companyId: string;
}

export interface OmieCredentials extends ERPCredentials {
  appKey: string;
  appSecret: string;
}

export interface GranatumCredentials extends ERPCredentials {
  apiToken: string;
}

export interface ERPConnection {
  type: ERPType;
  name: string;
  isConnected: boolean;
  credentials?: OmieCredentials | GranatumCredentials;
}

export interface ERPPartner {
  type: ERPType;
  name: string;
  color: string;
  credentialsFields: {
    name: string;
    key: string;
    type: 'text' | 'password';
    placeholder: string;
  }[];
}

export const ERP_PARTNERS: Record<ERPType, ERPPartner> = {
  omie: {
    type: 'omie',
    name: 'Omie',
    color: 'bg-blue-600',
    credentialsFields: [
      {
        name: 'App Key',
        key: 'appKey',
        type: 'text',
        placeholder: 'Sua chave de API'
      },
      {
        name: 'App Secret',
        key: 'appSecret',
        type: 'password',
        placeholder: 'Chave secreta'
      }
    ]
  },
  granatum: {
    type: 'granatum',
    name: 'Granatum',
    color: 'bg-purple-600',
    credentialsFields: [
      {
        name: 'API Token',
        key: 'apiToken',
        type: 'text',
        placeholder: 'Seu token de API'
      }
    ]
  }
};