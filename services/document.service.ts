import { apiService } from '../lib/api';

export interface ProcessDocumentResponse {
  success: boolean;
  data?: {
    text: string;
    fileName: string;
    fileSize: number;
  };
  error?: string;
  details?: string;
}

class DocumentService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  }

  async processDocument(file: File): Promise<ProcessDocumentResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiService.post<ProcessDocumentResponse>(
        'google-document-ai/process-document',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Erro ao processar documento:', error);
      
      // Se for um erro de validação do arquivo
      if (error.response?.status === 400) {
        return {
          success: false,
          error: 'Arquivo inválido',
          details: 'O arquivo deve ser um PDF válido com tamanho máximo de 10MB',
        };
      }

      // Se for um erro interno
      if (error.response?.status === 500) {
        return {
          success: false,
          error: 'Erro interno do servidor',
          details: 'Não foi possível processar o documento. Tente novamente.',
        };
      }

      return {
        success: false,
        error: 'Erro ao processar documento',
        details: error.message || 'Erro desconhecido',
      };
    }
  }
}

export const documentService = new DocumentService();
export default documentService;
