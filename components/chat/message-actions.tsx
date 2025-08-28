import { useCopyToClipboard } from 'usehooks-ts';

import { CopyIcon } from '../icons';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { toast } from 'sonner';
import type { ChatMessage } from '@/lib/types';

export function MessageActions({
  message,
  isLoading,
}: {
  message: ChatMessage;
  isLoading: boolean;
}) {
  const [_, copyToClipboard] = useCopyToClipboard();

  if (isLoading) return null;
  if (message.role === 'user') return null;

  const handleCopy = async () => {
    const textToCopy = message.content.trim();

    if (!textToCopy) {
      toast.error("There's no text to copy!");
      return;
    }

    try {
      // Enhanced clipboard support for cross-platform compatibility
      if (navigator.clipboard && window.isSecureContext) {
        // Modern clipboard API (works on HTTPS and localhost)
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for older browsers or non-secure contexts
        await copyToClipboard(textToCopy);
      }
      toast.success('Copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-row gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="py-1 px-1.5 h-6 text-muted-foreground/60 hover:text-muted-foreground/80 hover:bg-muted/50 opacity-0 group-hover/message:opacity-100 transition-all duration-200 ease-in-out"
              variant="ghost"
              size="sm"
              onClick={handleCopy}
            >
              <CopyIcon size={12} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy message</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}


