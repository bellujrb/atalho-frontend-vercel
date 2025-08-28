'use client';

import React, { memo, useEffect, useRef, useState } from 'react';
import type { Suggestion } from '@/lib/types';

type EditorProps = {
  content: string;
  onSaveContent: (updatedContent: string, debounce: boolean) => void;
  status: 'streaming' | 'idle';
  isCurrentVersion: boolean;
  currentVersionIndex: number;
  suggestions: Array<Suggestion>;
};

function PureEditor({
  content,
  onSaveContent,
  suggestions,
  status,
  isCurrentVersion,
}: EditorProps) {
  const [localContent, setLocalContent] = useState(content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (content !== localContent) {
      setLocalContent(content);
    }
  }, [content]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setLocalContent(newContent);
    
    if (status === 'idle') {
      onSaveContent(newContent, true);
    }
  };

  const handleBlur = () => {
    if (localContent !== content) {
      onSaveContent(localContent, false);
    }
  };

  return (
    <div className="relative prose dark:prose-invert w-full">
      <textarea
        ref={textareaRef}
        value={localContent}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-full min-h-[400px] p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        placeholder="Digite seu texto aqui..."
        disabled={!isCurrentVersion}
      />
      
      {suggestions.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            Sugestões:
          </h4>
          <ul className="space-y-1">
            {suggestions.map((suggestion) => (
              <li key={suggestion.id} className="text-sm text-blue-700 dark:text-blue-300">
                {suggestion.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function areEqual(prevProps: EditorProps, nextProps: EditorProps) {
  return (
    prevProps.suggestions === nextProps.suggestions &&
    prevProps.currentVersionIndex === nextProps.currentVersionIndex &&
    prevProps.isCurrentVersion === nextProps.isCurrentVersion &&
    !(prevProps.status === 'streaming' && nextProps.status === 'streaming') &&
    prevProps.content === nextProps.content &&
    prevProps.onSaveContent === nextProps.onSaveContent
  );
}

export const Editor = memo(PureEditor, areEqual);
