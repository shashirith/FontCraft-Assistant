import React, { useRef, useEffect } from 'react';
import { cn, shouldShowAvatar, isSameDay } from '@/lib/utils';
import { Message, User } from '@/lib/types';
import MessageItem from './MessageItem';

interface MessageListProps {
  messages: Message[];
  users: User[];
  currentUserId: string;
  className?: string;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  users,
  currentUserId,
  className,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getUserById = (userId: string): User | undefined => {
    return users.find(user => user.id === userId);
  };

  const getMessageById = (messageId: string): Message | undefined => {
    return messages.find(msg => msg.id === messageId);
  };

  const renderMessages = () => {
    const messageGroups: React.ReactElement[] = [];
    let currentDate: Date | null = null;

    messages.forEach((message, index) => {
      const sender = getUserById(message.senderId);
      const isOwn = message.senderId === currentUserId;
      const previousMessage = index > 0 ? messages[index - 1] : undefined;
      const nextMessage = index < messages.length - 1 ? messages[index + 1] : undefined;
      
      const showAvatar = shouldShowAvatar(message, previousMessage);
      const isFirst = !previousMessage || shouldShowAvatar(message, previousMessage);
      const isLast = !nextMessage || shouldShowAvatar(nextMessage, message);

      // Find replied message and sender if this is a reply
      const repliedMessage = message.replyTo ? getMessageById(message.replyTo) : undefined;
      const repliedSender = repliedMessage ? getUserById(repliedMessage.senderId) : undefined;

      // Date separator
      if (!currentDate || !isSameDay(message.timestamp, currentDate)) {
        currentDate = message.timestamp;
        messageGroups.push(
          <div
            key={`date-${message.timestamp.toISOString()}`}
            className="flex justify-center my-4"
          >
            <div className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400">
              {message.timestamp.toLocaleDateString([], {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        );
      }

      if (!sender) return;

      messageGroups.push(
        <MessageItem
          key={message.id}
          message={message}
          sender={sender}
          isOwn={isOwn}
          showAvatar={showAvatar}
          isFirst={isFirst}
          isLast={isLast}
          repliedMessage={repliedMessage}
          repliedSender={repliedSender}
        />
      );
    });

    return messageGroups;
  };

  return (
    <div className={cn('flex flex-col overflow-y-auto', className)}>
      <div className="flex-1 py-4">
        {renderMessages()}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList; 