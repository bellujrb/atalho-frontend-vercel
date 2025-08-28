'use client';

import { FileText } from 'lucide-react';
import { FunctionDisplayBase } from './function-display-base';

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

interface FunctionExecutionDisplayProps {
  functions: {
    executed: FunctionExecution[];
    totalExecuted: number;
    hasErrors: boolean;
  };
}

export function FunctionExecutionDisplay({ functions }: FunctionExecutionDisplayProps) {
  // Pegar o nome da primeira função executada para o título
  const functionName = functions?.executed?.[0]?.name || 'Função Executada';
  
  return (
    <FunctionDisplayBase
      functions={functions}
      title={functionName}
      icon={<FileText className="w-4 h-4 text-blue-600" />}
      showParameters={true}
      showResults={true}
      maxResults={3}
    />
  );
}
