'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { useMemo } from 'react';

interface SheetArtifactContentProps {
  content: string;
  status?: 'streaming' | 'idle';
}

interface DataItem {
  [key: string]: string | number | boolean | null;
}

export function SheetArtifactContent({ content, status }: SheetArtifactContentProps) {
  const { data, columns } = useMemo(() => {
    if (!content) {
      return { data: [], columns: [] };
    }

    try {
      // Tentar fazer parse do JSON primeiro (dados da função)
      let parsedData;
      try {
        parsedData = JSON.parse(content);
      } catch {
        // Se não for JSON, tentar CSV
        const lines = content.trim().split('\n');
        if (lines.length < 2) {
          return { data: [], columns: [] };
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const data = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
          const item: DataItem = {};
          headers.forEach((header, index) => {
            item[header] = values[index] || '';
          });
          return item;
        });

        const columns = headers.map(header => ({
          key: header,
          header: header.charAt(0).toUpperCase() + header.slice(1)
        }));

        return { data, columns };
      }

      // Se for JSON, processar os dados da função
      if (Array.isArray(parsedData)) {
        if (parsedData.length === 0) {
          return { data: [], columns: [] };
        }

        const firstItem = parsedData[0];
        const keys = Object.keys(firstItem);
        
        const columns = keys.map(key => ({
          key,
          header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
        }));

        const data = parsedData.map(item => {
          const processedItem: DataItem = {};
          keys.forEach(key => {
            let value = item[key];
            
            // Formatar valores especiais
            if (value === null || value === undefined) {
              value = '-';
            } else if (typeof value === 'object') {
              // Para categorias ou objetos aninhados
              if (Array.isArray(value)) {
                value = value.map(v => v.name || v).join(', ');
              } else if (value.name) {
                value = value.name;
              } else {
                value = JSON.stringify(value);
              }
            } else if (typeof value === 'number') {
              // Formatar números (moeda, etc.)
              if (key.toLowerCase().includes('valor') || key.toLowerCase().includes('price')) {
                value = new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(value);
              }
            } else if (typeof value === 'boolean') {
              value = value ? 'Sim' : 'Não';
            }
            
            processedItem[key] = value;
          });
          return processedItem;
        });

        return { data, columns };
      }

      return { data: [], columns: [] };
    } catch (error) {
      console.error('Error parsing content:', error);
      return { data: [], columns: [] };
    }
  }, [content]);

  if (data.length === 0) {
    return (
      <div className="flex flex-col p-4">
        <Card className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">Planilha de Dados</CardTitle>
              <Badge variant="secondary" className="text-xs">Dados</Badge>
              {status === 'streaming' && (
                <Badge variant="outline" className="animate-pulse text-xs">Gerando...</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-500 py-8">
              Nenhum dado disponível
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4">
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">Planilha de Dados</CardTitle>
            <Badge variant="secondary" className="text-xs">Dados</Badge>
            {status === 'streaming' && (
              <Badge variant="outline" className="animate-pulse text-xs">Gerando...</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <DataTable data={data} columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
}
