'use client';

import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

interface TextArtifactContentProps {
  content: string;
  status: 'streaming' | 'idle';
}

export function TextArtifactContent({ content, status }: TextArtifactContentProps) {
  return (
    <div className="flex flex-col p-4">
      <Card className="w-full">
        <CardContent className="p-4">
          <Textarea
            value={content}
            readOnly
            placeholder="Conteúdo do artifact de texto aparecerá aqui..."
            className="min-h-[300px] resize-none border-0 focus-visible:ring-0 text-sm leading-relaxed"
          />
          {status === 'streaming' && (
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span>Gerando conteúdo...</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
