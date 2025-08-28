"use client";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useState } from "react";
import Image from "next/image";
import { PencilEditIcon, SparklesIcon } from "../icons";
import { Markdown } from "./markdown";
import { cn, sanitizeText } from "@/lib/utils";
import cx from "classnames";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { MessageEditor } from "./message-editor";
import { MessageActions } from "./message-actions";
import { MessageReasoning } from "./message-reasoning";
import { FunctionExecutionDisplay } from "./function-execution-display";
import type { ChatMessage } from "@/lib/types";

const PurePreviewMessage = ({
  chatId,
  message,
  isLoading,
  setMessages,
  regenerate,
  requiresScrollPadding,
}: {
  chatId: string;
  message: ChatMessage;
  isLoading: boolean;
  setMessages: (
    messages: ChatMessage[] | ((messages: ChatMessage[]) => ChatMessage[])
  ) => void;
  regenerate: () => void;
  requiresScrollPadding: boolean;
}) => {
  const [mode, setMode] = useState<"view" | "edit">("view");

  return (
    <AnimatePresence>
      <motion.div
        data-testid={`message-${message.role}`}
        className="w-full mx-auto max-w-3xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={cn(
            "flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl",
            {
              "w-full": mode === "edit",
              "group-data-[role=user]/message:w-fit": mode !== "edit",
            }
          )}
        >
          {message.role === "assistant" && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <Image
                  src="/fin-pet.png"
                  alt="Fin Pet"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
            </div>
          )}

          <div
            className={cn("flex flex-col gap-4 w-full", {
              "min-h-96": message.role === "assistant" && requiresScrollPadding,
            })}
          >
            {mode === "view" ? (
              <div className="flex flex-row gap-2 items-start">
                

                <div
                  data-testid="message-content"
                  className={cn("flex flex-col gap-4", {
                    "bg-green-600 text-white px-3 py-2 rounded-xl":
                      message.role === "user",
                  })}
                >
                  <Markdown>{sanitizeText(message.content)}</Markdown>
                </div>
              </div>
            ) : (
              <div className="flex flex-row gap-2 items-start">
                <div className="size-8" />

                <MessageEditor
                  key={message.id}
                  message={message}
                  setMode={setMode}
                  setMessages={setMessages}
                  regenerate={regenerate}
                />
              </div>
            )}

            {/* Exibir funções executadas DEPOIS do pensamento */}
            {message.role === "assistant" && message.metadata?.functions && (
              <FunctionExecutionDisplay functions={message.metadata.functions} />
            )}

            {message.role === "assistant" && (
              <MessageActions message={message} isLoading={isLoading} />
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.message.id !== nextProps.message.id) return false;
    if (prevProps.requiresScrollPadding !== nextProps.requiresScrollPadding)
      return false;
    if (prevProps.message.content !== nextProps.message.content) return false;
    if (prevProps.message.metadata !== nextProps.message.metadata) return false;

    return true;
  }
);

export const ThinkingMessage = () => {
  const role = 'assistant';

  return (
    <motion.div
      data-testid="message-assistant-loading"
      className="w-full mx-auto max-w-3xl px-4 group/message min-h-96"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cn(
          'flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl',
          {
            'group-data-[role=user]/message:bg-muted': true,
          },
        )}
      >
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
          <SparklesIcon size={14} />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-4 text-muted-foreground">
            Hmm...
          </div>
        </div>
      </div>
    </motion.div>
  );
};
