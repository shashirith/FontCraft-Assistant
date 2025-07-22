import React from 'react';
import { cn, formatTimestamp } from '@/lib/utils';
import { Message, User } from '@/lib/types';
import Avatar from '@/components/ui/Avatar';

interface MessageItemProps {
  message: Message;
  sender: User;
  isOwn: boolean;
  showAvatar: boolean;
  isFirst: boolean;
  isLast: boolean;
}

const MessageItem = React.memo<MessageItemProps>(({
  message,
  sender,
  isOwn,
  showAvatar,
  isFirst,
  isLast,
}) => {
  return (
    <div
      className={cn(
        'flex gap-3 px-4',
        isFirst ? 'mt-2' : 'mt-1',
        isLast ? 'mb-2' : ''
      )}
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
      
      <div className={cn('flex-1 max-w-xs', isOwn && 'flex justify-end')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-2 break-words',
            isOwn
              ? 'bg-blue-500 text-white rounded-br-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md'
          )}
        >
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
      </div>
    </div>
  );
});

MessageItem.displayName = 'MessageItem';

export default MessageItem; 