'use client';

/**
 * Messages Container
 */

import React from 'react';
import { Motion, motion } from 'framer-motion';
import { Message as MessageType } from '@/types';
import { Message } from './Message';
import { useAutoScroll } from '@/hooks';
import { Loading } from '@/components/common/Loading';

interface MessagesContainerProps {
  messages: MessageType[];
  isLoading?: boolean;
  streamingContent?: string;
}

export const MessagesContainer: React.FC<MessagesContainerProps> = ({
  messages,
  isLoading = false,
  streamingContent = '',
}) => {
  const messagesRef = useAutoScroll([messages, streamingContent]);

  return (
    <div
      ref={messagesRef}
      className="flex-1 overflow-y-auto messages-container p-6 space-y-4"
    >
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="text-6xl"
          >
            ✨
          </motion.div>
          <h2 className="text-2xl font-bold text-center text-gray-300">
            Welcome to OEDX AI
          </h2>
          <p className="text-gray-500 text-center max-w-md">
            Start a new conversation by typing a message below
          </p>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              onCopy={() => {}}
            />
          ))}

          {streamingContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold bg-gradient-to-br from-accent-purple to-accent-pink text-white">
                AI
              </div>
              <div className="flex-1 max-w-2xl">
                <div className="inline-block rounded-lg px-4 py-3 bg-dark-800 text-gray-100 break-words">
                  {streamingContent}
                  <span className="inline-block w-2 h-5 ml-1 bg-accent-cyan animate-pulse" />
                </div>
              </div>
            </motion.div>
          )}

          {isLoading && !streamingContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 items-center"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold bg-gradient-to-br from-accent-purple to-accent-pink text-white">
                AI
              </div>
              <Loading size="sm" variant="dots" />
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};
