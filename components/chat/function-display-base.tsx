'use client';

import { FileText, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { useArtifact } from '@/hooks/use-artifact';
import React from 'react'; // Added missing import for React.useEffect

interface FunctionExecution {
  name: string;
  description: string;
  parameters: Record<string, any>;
  result: {
    successful: any[];
    failed: any[];
  };
  executionTime: number;
}

interface FunctionDisplayBaseProps {
  functions: {
    executed: FunctionExecution[];
    totalExecuted: number;
    hasErrors: boolean;
  };
  title?: string;
  icon?: React.ReactNode;
  showParameters?: boolean;
  showResults?: boolean;
  maxResults?: number;
}

export function FunctionDisplayBase({ 
  functions, 
  title = "Funções Executadas",
  icon = <FileText className="w-4 h-4 text-blue-600" />,
  showParameters = true,
  showResults = true,
  maxResults = 3
}: FunctionDisplayBaseProps) {
  const [expandedFunctions, setExpandedFunctions] = useState<Set<number>>(new Set());
  const { openArtifact } = useArtifact();

  if (!functions?.executed?.length) {
    return null;
  }

  const toggleFunction = (index: number) => {
    const newExpanded = new Set(expandedFunctions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedFunctions(newExpanded);
  };

  const openFunctionDataTable = (func: FunctionExecution) => {
    // Passar os dados diretamente como JSON para o artifact
    if (func.result.successful.length > 0) {
      // Abrir artifact com os dados JSON da função
      openArtifact('sheet', `${func.name} - Dados`, JSON.stringify(func.result.successful, null, 2));
    } else {
      // Se não houver dados bem-sucedidos, mostrar mensagem
      openArtifact('text', `${func.name} - Sem Dados`, 'Nenhum resultado bem-sucedido encontrado para esta função.');
    }
  };

  // Verificar se a função deve abrir automaticamente
  const shouldAutoOpen = (funcName: string) => {
    return funcName.toLowerCase().startsWith('get');
  };

  // Abrir automaticamente se for função get
  const autoOpenIfGet = (func: FunctionExecution) => {
    if (shouldAutoOpen(func.name) && func.result.successful.length > 0) {
      openFunctionDataTable(func);
    }
  };

  // Abrir automaticamente as funções get quando o componente montar
  React.useEffect(() => {
    functions.executed.forEach(func => {
      if (shouldAutoOpen(func.name)) {
        // Delay pequeno para garantir que o componente esteja montado
        setTimeout(() => autoOpenIfGet(func), 100);
      }
    });
  }, [functions.executed]);

  const renderParameterValue = (value: any): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    
    return String(value);
  };

  const renderResultItem = (item: any, index: number) => {
    // Renderização genérica para qualquer tipo de dados
    const keys = Object.keys(item);
    
    return (
      <div key={index} className="p-3 bg-white rounded border border-gray-200">
        <div className="text-xs text-gray-600">
          <div className="font-medium mb-2 text-gray-700">Coluna #{index + 1}</div>
          {keys.map((key) => {
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
            
            return (
              <div key={key} className="mb-1">
                <span className="font-medium text-gray-700">{key}:</span> {value}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="pb-4">
      <div className="space-y-3">
        {functions.executed.map((func, idx) => {
          const isExpanded = expandedFunctions.has(idx);
          
          return (
            <div key={idx} className="p-3 bg-white rounded border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  {shouldAutoOpen(func.name) ? (
                    <button
                      onClick={() => openFunctionDataTable(func)}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-left"
                    >
                      {func.name}
                    </button>
                  ) : (
                    <h4 className="text-sm font-semibold text-gray-800">{func.name}</h4>
                  )}
                  <p className="text-xs text-gray-600 mt-1">{func.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-gray-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <div className="text-xs space-y-1">
                        <div className="font-medium mb-2">Parâmetros:</div>
                        {Object.entries(func.parameters).map(([key, value]) => (
                          <div key={key}>
                            <span className="font-medium">{key}:</span> {renderParameterValue(value)}
                          </div>
                        ))}
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <div className="font-medium">Tempo de execução: {func.executionTime}ms</div>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                  <button
                    onClick={() => toggleFunction(idx)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="space-y-3 pt-2 border-t border-gray-100">
                  {/* Resultados bem-sucedidos */}
                  {showResults && func.result.successful.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-green-700">
                        ✓ {func.result.successful.length} resultado(s) bem-sucedido(s)
                      </span>
                      <div className="mt-1 space-y-2">
                        {func.result.successful.slice(0, maxResults).map((item, itemIdx) => 
                          renderResultItem(item, itemIdx)
                        )}
                        {func.result.successful.length > maxResults && (
                          <div className="text-xs text-gray-500 text-center py-1">
                            ... e mais {func.result.successful.length - maxResults} resultado(s)
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Resultados com falha */}
                  {showResults && func.result.failed.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-red-700">
                        ✗ {func.result.failed.length} falha(s)
                      </span>
                      <div className="mt-1 space-y-1">
                        {func.result.failed.map((item, itemIdx) => (
                          <div key={itemIdx} className="text-xs text-red-600 p-2 bg-red-50 rounded border border-red-200">
                            {JSON.stringify(item)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
