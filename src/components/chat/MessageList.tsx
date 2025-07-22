import React, { useEffect, useRef, useCallback } from 'react';
import { cn, shouldShowAvatar } from '@/lib/utils';
import { Message, User } from '@/lib/types';
import MessageItem from './MessageItem';

interface MessageListProps {
  messages: Message[];
  users: User[];
  currentUserId: string;
  className?: string;
}

const MessageList = React.memo<MessageListProps>(({
  messages,
  users,
  currentUserId,
  className,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const userMap = React.useMemo(() => {
    return users.reduce((map, user) => {
      map[user.id] = user;
      return map;
    }, {} as Record<string, User>);
  }, [users]);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    }
  }, []);

  const debouncedScrollToBottom = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      scrollToBottom();
    }, 100);
  }, [scrollToBottom]);

  useEffect(() => {
    debouncedScrollToBottom();
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [messages.length, debouncedScrollToBottom]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      
      container.dataset.isNearBottom = isNearBottom.toString();
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || messages.length === 0) return;

    const isNearBottom = container.dataset.isNearBottom !== 'false';
    
    if (isNearBottom) {
      setTimeout(() => {
        scrollToBottom();
      }, 50);
    }
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <div className={cn('flex items-center justify-center p-8 h-full', className)}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No messages yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Start the conversation by sending a message below.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'overflow-y-auto overflow-x-hidden custom-scrollbar',
        'bg-white dark:bg-gray-800',
        'h-full min-h-0',
        className
      )}
      data-is-near-bottom="true"
    >
      <div className="flex flex-col min-h-full">
        <div className="flex-1" />
        <div className="py-4">
          {messages.map((message, index) => {
            const sender = userMap[message.senderId];
            const isOwn = message.senderId === currentUserId;
            const previousMessage = index > 0 ? messages[index - 1] : undefined;
            const nextMessage = index < messages.length - 1 ? messages[index + 1] : undefined;
            
            const showAvatar = shouldShowAvatar(message, previousMessage);
            const isFirst = index === 0 || shouldShowAvatar(message, previousMessage);
            const isLast = index === messages.length - 1 || 
               (nextMessage ? shouldShowAvatar(nextMessage, message) : true);

            if (!sender) {
              console.warn(`Sender not found for message ${message.id}`);
              return null;
            }

            return (
              <MessageItem
                key={message.id}
                message={message}
                sender={sender}
                isOwn={isOwn}
                showAvatar={showAvatar}
                isFirst={isFirst}
                isLast={isLast}
              />
            );
          })}
          
          <div ref={messagesEndRef} className="h-0" />
        </div>
      </div>
    </div>
  );
});

MessageList.displayName = 'MessageList';

export default MessageList; 