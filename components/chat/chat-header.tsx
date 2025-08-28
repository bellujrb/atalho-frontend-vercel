'use client';

import { SidebarToggle } from '@/components/sidebar-toggle';
import { memo } from 'react';

function PureChatHeader({
  chatId,
  selectedModelId,
}: {
  chatId: string;
  selectedModelId: string;
}) {
  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
      <SidebarToggle />

      {/* <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0"
          >
            <PlusIcon />
            <span className="md:md:sr-only">Novo Chat</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Novo Chat</TooltipContent>
      </Tooltip> */}

      {/* <ModelSelector
        selectedModelId={selectedModelId}
        className="order-1 md:order-2"
      /> */}

    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return prevProps.selectedModelId === nextProps.selectedModelId;
});
