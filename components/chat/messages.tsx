import { PreviewMessage, ThinkingMessage } from './message';
import { Greeting } from './greeting';
import { memo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMessages } from '@/hooks/use-messages';
import { ScrollToBottomButton } from './scroll-to-bottom-button';
import type { ChatMessage } from '@/lib/types';



interface MessagesProps {
  chatId: string;
  status: 'idle' | 'streaming';
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[] | ((messages: ChatMessage[]) => ChatMessage[])) => void;
  regenerate: () => void;
  isArtifactVisible: boolean;
}

function PureMessages({
  chatId,
  status,
  messages,
  setMessages,
  regenerate,
  isArtifactVisible,
}: MessagesProps) {
  const {
    containerRef: messagesContainerRef,
    endRef: messagesEndRef,
    autoScroll,
    onViewportEnter,
    onViewportLeave,
    hasSentMessage,
    autoScrollToBottom,
    forceScrollToBottom,
  } = useMessages({
    chatId,
    status,
    messages,
  });

  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        forceScrollToBottom('instant');
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [messages.length, forceScrollToBottom]);

  const handleScrollToBottom = () => {
    forceScrollToBottom('smooth');
  };



  return (
    <>
      <div
        ref={messagesContainerRef}
        className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4 relative scroll-smooth"
        style={{ scrollBehavior: 'smooth' }}
      >
        {messages.length === 0 && <Greeting />}

        {messages.map((message, index) => (
          <PreviewMessage
            key={message.id}
            chatId={chatId}
            message={message}
            isLoading={status === 'streaming' && messages.length - 1 === index}
            setMessages={setMessages}
            regenerate={regenerate}
            requiresScrollPadding={
              hasSentMessage && index === messages.length - 1
            }
          />
        ))}

        {status === 'streaming' && (
          <ThinkingMessage />
        )}

        <motion.div
          ref={messagesEndRef}
          className="shrink-0 min-w-[24px] min-h-[24px]"
          onViewportLeave={onViewportLeave}
          onViewportEnter={onViewportEnter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      </div>

      <ScrollToBottomButton
        isVisible={!autoScroll && messages.length > 0}
        onClick={handleScrollToBottom}
        className={isArtifactVisible ? 'right-8' : ''}
      />
    </>
  );
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.isArtifactVisible !== nextProps.isArtifactVisible) return false;
  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (prevProps.messages !== nextProps.messages) return false;

  return true;
});
