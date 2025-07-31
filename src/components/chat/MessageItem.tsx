import React, { useState } from 'react';
import { cn, formatTimestamp, truncateText } from '@/lib/utils';
import { Message, User } from '@/lib/types';
import Avatar from '@/components/ui/Avatar';
import { useChat } from '@/hooks/useChat';

interface MessageItemProps {
  message: Message;
  sender: User;
  isOwn: boolean;
  showAvatar: boolean;
  isFirst: boolean;
  isLast: boolean;
  repliedMessage?: Message;
  repliedSender?: User;
}

const MessageItem = React.memo<MessageItemProps>(({
  message,
  sender,
  isOwn,
  showAvatar,
  isFirst,
  isLast,
  repliedMessage,
  repliedSender,
}) => {
  const { actions } = useChat();
  const [showReplyButton, setShowReplyButton] = useState(false);

  const handleReply = (e: React.MouseEvent) => {
    e.stopPropagation();
    actions.replyToMessage(message);
  };

  return (
    <div
      className={cn(
        'group relative flex gap-3 px-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors',
        isFirst ? 'mt-2' : 'mt-1',
        isLast ? 'mb-2' : ''
      )}
      onMouseEnter={() => setShowReplyButton(true)}
      onMouseLeave={() => setShowReplyButton(false)}
    >
      <div className="flex-shrink-0 w-8">
        {showAvatar && !isOwn && (
          <Avatar
            src={sender.avatar}
            name={sender.name}
            userId={sender.id}
            size="sm"
          />
        )}
      </div>
      
      <div className={cn('flex-1 max-w-xs relative', isOwn && 'flex justify-end')}>
        <div
          className={cn(
            'relative rounded-2xl px-4 py-2 break-words',
            isOwn
              ? 'bg-blue-500 text-white rounded-br-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md'
          )}
        >
          {/* Reply context */}
          {repliedMessage && repliedSender && (
            <div
              className={cn(
                'mb-2 p-2 rounded-lg border-l-2 text-xs',
                isOwn
                  ? 'bg-blue-600/30 border-blue-200'
                  : 'bg-gray-200/50 dark:bg-gray-600/50 border-gray-400 dark:border-gray-500'
              )}
            >
              <div className={cn(
                'font-medium mb-1',
                isOwn ? 'text-blue-100' : 'text-blue-600 dark:text-blue-400'
              )}>
                {repliedSender.name}
              </div>
              <div className={cn(
                'opacity-80',
                isOwn ? 'text-blue-100' : 'text-gray-600 dark:text-gray-300'
              )}>
                {truncateText(repliedMessage.content, 50)}
              </div>
            </div>
          )}

          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
          
          <div
            className={cn(
              'text-xs mt-1 opacity-70',
              isOwn ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
            )}
          >
            {formatTimestamp(message.timestamp)}
          </div>
        </div>

        {/* Reply button - always positioned on the right side */}
        {showReplyButton && (
          <button
            onClick={handleReply}
            className="absolute -top-2 right-0 p-1.5 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100 z-10"
            style={{
              transform: 'translateX(calc(100% + 8px))'
            }}
            aria-label="Reply to message"
          >
            <svg
              className="w-4 h-4 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
          </button>
        )}
      </div>
      
      {/* Spacer to prevent reply button from going outside viewport */}
      <div className="flex-shrink-0 w-12"></div>
    </div>
  );
});

MessageItem.displayName = 'MessageItem';

export default MessageItem; 