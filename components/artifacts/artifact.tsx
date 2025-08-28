'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useArtifact } from '@/hooks/use-artifact';
import { ArtifactCloseButton } from './artifact-close-button';
import { TextArtifactContent } from './content/text-artifact';
import { SheetArtifactContent } from './content/sheet-artifact';
import { ArtifactKind } from '@/lib/types/artifact';
import { Download, FileSpreadsheet, Filter, Layers } from 'lucide-react';
import { useWindowSize } from 'usehooks-ts';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

// Função para renderizar o conteúdo baseado no tipo
const renderContent = (kind: ArtifactKind, content: string, status: 'streaming' | 'idle') => {
  switch (kind) {
    case 'text':
      return <TextArtifactContent content={content} status={status} />;
    case 'sheet':
      return <SheetArtifactContent content={content} status={status} />;
    default:
      return <TextArtifactContent content={content} status={status} />;
  }
};

export function Artifact() {
  const { artifact } = useArtifact();
  const { width: windowWidth } = useWindowSize();

  if (!artifact.isVisible) {
    return null;
  }

  const artifactWidth = windowWidth * 0.7;

  return (
    <AnimatePresence>
      <motion.div
        data-testid="artifact"
        className="fixed top-0 right-0 h-dvh z-50"
        style={{ width: `${artifactWidth}px` }}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="w-full h-full bg-background border-l shadow-2xl flex flex-col">
          {/* Header */}
          <motion.div 
            className="p-4 flex flex-row justify-between items-start border-b bg-muted/30" 
            initial={{ y: -20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <div className="flex flex-row gap-4 items-start">
              <ArtifactCloseButton />
              <div className="flex flex-col">
                <motion.div 
                  className="font-medium text-lg" 
                  initial={{ x: -20, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }} 
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  {artifact.title || 'Novo Artifact'}
                </motion.div>
                <motion.div 
                  className="text-sm text-muted-foreground mt-1" 
                  initial={{ x: -20, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }} 
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  {artifact.status === 'streaming' ? 'Gerando...' : 'Pronto'}
                </motion.div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Sheet-specific action buttons */}
              {artifact.kind === 'sheet' && (
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ x: 20, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }} 
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  {/* Download Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Formato de Download</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => console.log('Download CSV')}>
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => console.log('Download XLSX')}>
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        XLSX
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => console.log('Download PDF')}>
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        PDF
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Multiple Sheets Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                        <Layers className="h-4 w-4 mr-2" />
                        Abas
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Selecionar Planilha</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => console.log('Planilha: Vendas')}>
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Vendas
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => console.log('Planilha: Estoque')}>
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Estoque
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => console.log('Planilha: Financeiro')}>
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Financeiro
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => console.log('Planilha: RH')}>
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        RH
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => console.log('Gerenciar Abas')}>
                        <Layers className="h-4 w-4 mr-2" />
                        Gerenciar Abas
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Filter Button */}
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtro
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
          
          {/* Content */}
          <motion.div 
            className="flex-1 overflow-y-auto" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            {renderContent(artifact.kind, artifact.content, artifact.status)}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
